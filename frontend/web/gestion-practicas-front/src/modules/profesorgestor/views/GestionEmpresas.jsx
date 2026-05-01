import { useState, useEffect } from 'react';
import { Row, Col, Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { empresaService } from '../../../services/empresaService';
import { centroService } from '../../../services/centroService';
import AppTable from "../../../common/components/AppTable";
import AppModal from "../../../common/components/AppModal";
import AppForm from "../../../common/components/AppForm";
import Swal from 'sweetalert2';

const GestionEmpresas = ({ user }) => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState('');

  const columnas = ['CIF', 'Razón Social', 'Persona de Contacto', 'Teléfono'];
  const llaves = ['cif', 'razonSocial', 'personaContacto', 'telefonoContacto'];

  const camposEmpresa = [
    // FILA 1: CIF (4) + RAZÓN SOCIAL (8) = 12
    { 
        name: 'cif', 
        label: 'CIF', 
        type: 'text', 
        md: 4, 
        disabled: !!selectedEmpresa, 
        required: true 
    },
    { 
        name: 'razonSocial', 
        label: 'Razón Social', 
        type: 'text', 
        md: 8, 
        required: true 
    },

    // FILA 2: PERSONA DE CONTACTO (6) + LOCALIDAD (6) = 12
    { name: 'personaContacto', label: 'Persona de Contacto', type: 'text', md: 6 },
    { name: 'localidad', label: 'Localidad', type: 'text', md: 6 },

    // FILA 3: TELÉFONO (4) + DIRECCIÓN (8) = 12
    { name: 'telefonoContacto', label: 'Teléfono', type: 'text', md: 4 },
    { name: 'direccion', label: 'Dirección', type: 'text', md: 8 },

    // FILA 4: EMAIL DE CONTACTO (Fila completa)
    { name: 'emailContacto', label: 'Email de Contacto', type: 'email', md: 12 },
  ];

  const empresasFiltradas = empresas.filter(emp => 
    emp.razonSocial.toLowerCase().includes(filtroTexto.toLowerCase()) || 
    emp.cif.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  const cargarEmpresas = async () => {
    try {
      setLoading(true);
      const data = await empresaService.getEmpresas();
      setEmpresas(data);
    } catch (err) {
      console.error("Error al cargar empresas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarEmpresas(); }, []);

  const abrirModalEditar = (empresa, readOnly = false) => {
    setIsReadOnly(readOnly);
    setSelectedEmpresa(empresa);
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setIsReadOnly(false);
    setSelectedEmpresa(null);
    setShowModal(true);
  };

  const manejarGuardar = async (formData) => {
    try {
      if (selectedEmpresa) {
        await empresaService.updateEmpresa(selectedEmpresa.cif, formData);
      } else {
        await empresaService.createEmpresa(formData);
      }
      setShowModal(false);
      cargarEmpresas();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error al procesar la solicitud. Revisa si el CIF ya existe.",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const manejarEliminar = async (empresa) => {
    const { cif } = empresa;
    if (window.confirm(`¿Estás seguro de que deseas eliminar la empresa con CIF: ${cif}?`)) {
      try {
        await empresaService.deleteEmpresa(cif);
        Swal.fire({
          title: "¡Eliminado!",
          text: "Empresa eliminada correctamente.",
          icon: "success",
          confirmButtonColor: "#0d6efd",
          timer: 2000
        });
        cargarEmpresas();
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: "NO SE PUEDE ELIMINAR:\n\n" +
            "Esta empresa tiene alumnos, tutores o convenios asociados.",
          icon: "error",
          confirmButtonColor: "#dc3545"
        });
      }
    }
  };

  return (
    <>
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold">Gestión de Empresas</h2>
          <p className="text-muted">Centro: {user?.profesorInfo?.centroNombre}</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={abrirModalCrear}>Nueva Empresa</Button>
        </Col>
      </Row>

      <Row className="mb-3 mx-0 bg-light p-3 rounded border">
        <Col md={12}>
          <Form.Label className="small fw-bold text-secondary">Buscar Empresa (Nombre o CIF)</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-white"><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control 
              placeholder="Ej: Inditex o B12345678..." 
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <div className="bg-white p-4 rounded shadow-sm border">
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : (
          <AppTable 
            headers={columnas} 
            data={empresasFiltradas} 
            accessorKeys={llaves} 
            onView={(emp) => abrirModalEditar(emp, true)}
            onEdit={(emp) => abrirModalEditar(emp, false)}
            onDelete={manejarEliminar}
          />
        )}
      </div>

      <AppModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        title={isReadOnly ? "Detalle de Empresa" : (selectedEmpresa ? "Editar Empresa" : "Nueva Empresa")}
        size="lg"
        closeLabel={isReadOnly ? "Volver" : "Cancelar"}
      >
        <AppForm 
          fields={camposEmpresa.map(f => ({ ...f, disabled: isReadOnly || f.disabled }))} 
          initialValues={selectedEmpresa || { cif: '', razonSocial: '', direccion: '', localidad: '', telefonoContacto: '', emailContacto: '', personaContacto: '' }} 
          onSubmit={manejarGuardar} 
          buttonLabel={isReadOnly ? null : "Guardar"} 
        />
      </AppModal>
    </>
  );
};

export default GestionEmpresas;