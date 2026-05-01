import { useState, useEffect } from 'react';
import { Row, Col, Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { tutorEmpresaService } from '../../../services/tutorEmpresaService';
import { empresaService } from '../../../services/empresaService';
import AppTable from "../../../common/components/AppTable";
import AppModal from "../../../common/components/AppModal";
import AppForm from "../../../common/components/AppForm";
import Swal from 'sweetalert2';

const GestionTutoresEmpresa = ({ user }) => {
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [optionsEmpresas, setOptionsEmpresas] = useState([]);

  const columnas = ['ID', 'Nombre Completo', 'Email', 'Empresa', 'Alumnos'];
  const llaves = ['id', 'nombreCompleto', 'email', 'empresaNombre', 'numAlumnos'];

  // 1. CARGA DE DATOS (Corregida con fk_empresa para que el form la vea)
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const empData = await empresaService.getEmpresas();
      setOptionsEmpresas(empData.map(e => ({ label: e.razonSocial, value: e.cif })));

      const promesas = empData.map(e => tutorEmpresaService.getTutoresByEmpresa(e.cif));
      const resultados = await Promise.all(promesas);
      
      const procesados = resultados.flat().map(t => ({
        ...t,
        nombreCompleto: `${t.nombre} ${t.apellidos}`,
        empresaNombre: t.empresa ? t.empresa.razonSocial : 'N/A',
        fk_empresa: t.empresa ? t.empresa.cif : '' // Esto rellena el select
      }));

      setTutores(procesados);
    } catch (error) {
      console.error("Error cargando tutores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  // 2. DEFINICIÓN DE CAMPOS (Dinámica según el estado)
  const obtenerCampos = () => {
    const campos = [
      // FILA 1: ID (4) + Num Alumnos (8) = 12
      { 
        name: 'id', 
        label: 'Código Tutor', 
        type: 'text', 
        md: 4, 
        disabled: !!selectedTutor 
      },
      { 
        name: 'numAlumnos', 
        label: 'Número de Alumnos Asignados', 
        type: 'number', 
        md: 8, 
        disabled: !!selectedTutor
      },
      // FILA 2: Nombre (6) + Apellidos (6) = 12
      { name: 'nombre', label: 'Nombre', type: 'text', md: 6, required: true },
      { name: 'apellidos', label: 'Apellidos', type: 'text', md: 6, required: true },
      // FILA 3: Email (12)
      { name: 'email', label: 'Email', type: 'email', md: 12, required: true },
      // FILA 4: Empresa (12)
      { 
        name: 'fk_empresa', 
        label: 'Empresa', 
        type: 'select', 
        md: 12, 
        options: optionsEmpresas,
        required: true 
      }
    ];

    // Solo añadimos el campo password si NO estamos en modo "Ver"
    /*if (!isReadOnly) {
      campos.push({ name: 'password', label: 'Contraseña', type: 'password', md: 4, required: !selectedTutor });
    }*/

    return campos;
  };

  // 3. MANEJADORES
  const abrirModalEditar = (tutor, readOnly = false) => {
    setIsReadOnly(readOnly);
    setSelectedTutor(tutor);
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setIsReadOnly(false);
    setSelectedTutor(null);
    setShowModal(true);
  };

  const manejarGuardar = async (formData) => {
    try {
      if (selectedTutor) {
        await tutorEmpresaService.actualizarTutor(selectedTutor.id, formData);
      } else {
        await tutorEmpresaService.registrarTutor(formData, formData.fk_empresa);
      }
      setShowModal(false);
      cargarDatos();
    } catch (err) { 
      Swal.fire({
        title: "Error al guardar",
        text: "Ocurrió un error al guardar los datos del tutor.",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const manejarEliminar = async (tutor) => {
    if (window.confirm(`¿Eliminar a ${tutor.nombreCompleto}?`)) {
      try {
        await tutorEmpresaService.eliminarTutor(tutor.id);
        cargarDatos();
      } catch (err) { 
        Swal.fire({
          title: "Error al eliminar",
          text: "Ocurrió un error al eliminar el tutor.",
          icon: "error",
          confirmButtonColor: "#dc3545"
        });
      }
    }
  };

  const tutoresFiltrados = tutores.filter(t => 
    (t.nombreCompleto.toLowerCase().includes(filtroTexto.toLowerCase()) || t.id.toLowerCase().includes(filtroTexto.toLowerCase())) &&
    (filtroEmpresa === '' || t.fk_empresa === filtroEmpresa)
  );

  return (
    <>
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold">Gestión de Tutores de Empresa</h2>
          <p className="text-muted">Centro: {user?.profesorInfo?.centroNombre}</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={abrirModalCrear}>Nuevo Tutor</Button>
        </Col>
      </Row>

      <Row className="mb-3 g-3 bg-light p-3 rounded border mx-0">
        <Col md={7}>
          <Form.Label className="small fw-bold text-secondary">Buscar Tutor</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-white"><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control 
              placeholder="Nombre o ID..." 
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={5}>
          <Form.Label className="small fw-bold text-secondary">Filtrar por Empresa</Form.Label>
          <Form.Select value={filtroEmpresa} onChange={(e) => setFiltroEmpresa(e.target.value)}>
            <option value="">Todas las empresas</option>
            {optionsEmpresas.map(emp => (
              <option key={emp.value} value={emp.value}>{emp.label}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <div className="bg-white p-4 rounded shadow-sm border">
        {loading ? <div className="text-center"><Spinner animation="border" /></div> : (
          <AppTable 
            headers={columnas} 
            data={tutoresFiltrados} 
            accessorKeys={llaves} 
            onView={(t) => abrirModalEditar(t, true)}
            onEdit={(t) => abrirModalEditar(t, false)}
            onDelete={manejarEliminar}
          />
        )}
      </div>

      <AppModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        title={isReadOnly ? "Detalle Tutor" : (selectedTutor ? "Editar Tutor" : "Nuevo Tutor")}
        size="lg"
        closeLabel={isReadOnly ? "Volver" : "Cancelar"}
      >
        <AppForm 
          fields={obtenerCampos().map(f => ({ ...f, disabled: isReadOnly || f.disabled }))} 
          initialValues={selectedTutor || { id: '', nombre: '', apellidos: '', email: '', fk_empresa: '' }} 
          onSubmit={manejarGuardar} 
          buttonLabel={isReadOnly ? null : "Guardar"} 
        />
      </AppModal>
    </>
  );
};

export default GestionTutoresEmpresa;