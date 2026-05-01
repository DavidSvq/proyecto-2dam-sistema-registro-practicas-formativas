import { useState, useEffect } from 'react';
import { Row, Col, Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { alumnoService } from '../../../services/alumnoService';
import { centroService } from '../../../services/centroService';
import { empresaService } from '../../../services/empresaService';
import { profesorService } from '../../../services/profesorService';
import { tutorEmpresaService } from '../../../services/tutorEmpresaService';
import AppTable from "../../../common/components/AppTable";
import AppModal from "../../../common/components/AppModal";
import AppForm from "../../../common/components/AppForm";
import Swal from 'sweetalert2';

const GestionAlumnos = ({ user }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEmpresa, setFiltroEmpresa] = useState('');

  const [optionsEmpresas, setOptionsEmpresas] = useState([]);
  const [optionsProfesores, setOptionsProfesores] = useState([]);
  const [optionsTutores, setOptionsTutores] = useState([]);

  const columnas = ['ID', 'Alumno', 'Empresa', 'Tutor Empresa', 'Profesor Tutor'];
  const llaves = ['id', 'nombreCompleto', 'empresaNombre', 'tutorEmpresaNombre', 'profesorNombre'];

  const camposAlumno = [
    // FILA 1: CODIGO Y HORAS TOTALES
    { 
        name: 'id', 
        label: 'Código (ID)', 
        type: 'text', 
        md: 6, 
        disabled: !!selectedAlumno, 
        required: true 
    },
    { 
        name: 'horasTotales', 
        label: 'Horas Totales', 
        type: 'number', 
        md: 6, 
        required: true 
    },

    // FILA 2: NOMBRE Y APELLIDOS
    { name: 'nombre', label: 'Nombre', type: 'text', md: 6, required: true },
    { name: 'apellidos', label: 'Apellidos', type: 'text', md: 6, required: true },

    // FILA 3: EMAIL
    { name: 'email', label: 'Email', type: 'email', md: 12, required: true },

    // FILA 4: PROFESOR TUTOR (Fila separada)
    { 
        name: 'fk_profesor', 
        label: 'Profesor Tutor', 
        type: 'select', 
        md: 12, 
        options: optionsProfesores 
    },

    // FILA 5: EMPRESA (Fila separada)
    { 
        name: 'fk_empresa', 
        label: 'Empresa Asignada', 
        type: 'select', 
        md: 12, 
        options: optionsEmpresas,
        onChange: (val) => cargarTutores(val)
    },

    // FILA 6: TUTOR EMPRESA (Fila separada)
    { 
        name: 'fk_tutor', 
        label: 'Tutor de Empresa', 
        type: 'select', 
        md: 12, 
        options: optionsTutores 
    }
  ];

  const alumnosFiltrados = alumnos.filter(alu => {
    const coincideTexto = 
      alu.nombreCompleto.toLowerCase().includes(filtroTexto.toLowerCase()) || 
      alu.id.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideEmpresa = filtroEmpresa === '' || alu.fk_empresa === filtroEmpresa;
    return coincideTexto && coincideEmpresa;
  });

  const cargarTutores = async (cif) => {
    if (!cif) { setOptionsTutores([]); return; }
    try {
        const data = await tutorEmpresaService.getTutoresByEmpresa(cif);
        setOptionsTutores(data.map(t => ({ label: `${t.nombre} ${t.apellidos}`, value: t.id })));
    } catch (e) { console.error("Error al traer tutores", e); }
  };

  const cargarAlumnos = async () => {
    try {
      setLoading(true);
      const centro = await centroService.getPrincipal(); 
      const data = await alumnoService.getAlumnosByCentro(centro.codCentro);

      const procesados = data.map(alu => ({
        ...alu,
        nombreCompleto: `${alu.nombre} ${alu.apellidos}`,
        fk_empresa: alu.empresa?.cif || '',
        fk_profesor: alu.profesor?.id || '',
        fk_tutor: alu.tutorEmpresa?.id || '',
        horasTotales: alu.horasTotales || 0,
        tutorEmpresaNombre: alu.tutorEmpresa ? `${alu.tutorEmpresa.nombre} ${alu.tutorEmpresa.apellidos}` : 'No asignado',
        profesorNombre: alu.profesor ? `${alu.profesor.nombre} ${alu.profesor.apellidos}` : 'Sin tutor',
        empresaNombre: alu.empresa ? alu.empresa.razonSocial : 'Sin empresa'
      }));

      setAlumnos(procesados);

      const [empData, profData] = await Promise.all([
        empresaService.getEmpresas(),
        profesorService.getProfesoresByCentro(centro.codCentro)
      ]);
      setOptionsEmpresas(empData.map(e => ({ label: e.razonSocial, value: e.cif })));
      setOptionsProfesores(profData.map(p => ({ label: `${p.nombre} ${p.apellidos}`, value: p.id })));

    } catch (err) { console.error("Error al cargar datos", err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { cargarAlumnos(); }, []);

  const abrirModalEditar = async (alumno, readOnly = false) => {
    console.log("DATOS RECIBIDOS EN ABRIR_MODAL:", alumno);
    setIsReadOnly(readOnly);
    setOptionsTutores([]);
    if (alumno.fk_empresa) {
        await cargarTutores(alumno.fk_empresa);
    }
    setSelectedAlumno(alumno);
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setIsReadOnly(false);
    setSelectedAlumno(null);
    setOptionsTutores([]); 
    setShowModal(true);
  };

  const manejarGuardar = async (formData) => {
    try {
      const centro = await centroService.getPrincipal();
      const payload = {
        ...formData,
        rol: "ALUMNO",
        centro: { codCentro: centro.codCentro },
        empresa: formData.fk_empresa ? { cif: formData.fk_empresa } : null,
        profesor: formData.fk_profesor ? { id: formData.fk_profesor } : null,
        tutorEmpresa: formData.fk_tutor ? { id: formData.fk_tutor } : null
      };

      if (selectedAlumno) {
        await alumnoService.updateAlumno(selectedAlumno.id, payload);
      } else {
        await alumnoService.createAlumno(payload);
      }
      setShowModal(false);
      cargarAlumnos();
    } catch (err) { 
      Swal.fire({
        title: "Error",
        text: "Error al procesar la solicitud.",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const manejarEliminar = async (alumno) => {
    if (window.confirm(`¿Estás seguro de eliminar al alumno ${alumno.nombreCompleto}?`)) {
      try {
        await alumnoService.deleteAlumno(alumno.id);
        Swal.fire({
          title: "¡Eliminado!",
          text: "Alumno eliminado correctamente.",
          icon: "success",
          confirmButtonColor: "#0d6efd",
          timer: 2000
        });
        cargarAlumnos();
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: "No se puede eliminar el alumno. Es probable que tenga registros asociados (asistencias, evaluaciones, etc).",
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
          <h2 className="fw-bold">Gestión de Alumnos</h2>
          <p className="text-muted">Centro: {user?.profesorInfo?.centroNombre}</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={abrirModalCrear}>Matricular Alumno</Button>
        </Col>
      </Row>

      <Row className="mb-3 g-3 bg-light p-3 rounded border mx-0">
        <Col md={7}>
          <Form.Label className="small fw-bold text-secondary">Buscar por nombre o ID</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-white"><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control 
              placeholder="Buscar alumno..." 
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
            data={alumnosFiltrados} 
            accessorKeys={llaves} 
            onView={(alu) => abrirModalEditar(alu, true)}
            onEdit={(alu) => abrirModalEditar(alu, false)}
            onDelete={manejarEliminar}
          />
        )}
      </div>

      <AppModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        title={isReadOnly ? "Detalle Alumno" : (selectedAlumno ? "Editar Alumno" : "Nuevo Alumno")}
        size="lg"
        closeLabel={isReadOnly ? "Volver" : "Cancelar"}
      >
        <AppForm 
          fields={camposAlumno.map(f => ({ ...f, disabled: isReadOnly || f.disabled }))} 
          initialValues={selectedAlumno || { nombre: '', apellidos: '', email: '', horasTotales: 0 }} 
          onSubmit={manejarGuardar} 
          buttonLabel={isReadOnly ? null : "Guardar"} 
        />
      </AppModal>
    </>
  );
};

export default GestionAlumnos;