import { useState } from 'react';
import { Row, Col, Button } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";
import AppModal from "../../../common/components/AppModal";
import AppForm from "../../../common/components/AppForm";
import InfoCard from "../../../common/components/InfoCard";

const GestionAlumnos = () => {
  // 1. Estado para el Modal de Alta
  const [showModal, setShowModal] = useState(false);

  // 2. Datos de ejemplo (Simulando lo que vendrá de la BBDD)
  const alumnosEjemplo = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@fp.com', estado: 'Sin Asignar', curso: '2º DAW' },
    { id: 2, nombre: 'María García', email: 'maria@fp.com', estado: 'En Prácticas', curso: '2º ASIR' },
    { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@fp.com', estado: 'Finalizado', curso: '2º DAW' },
  ];

  // 3. Configuración de la Tabla
  const columnas = ['Nombre', 'Email', 'Curso', 'Estado'];
  const llaves = ['nombre', 'email', 'curso', 'estado'];

  // 4. Configuración del Formulario de Alta
  const camposAlumno = [
    { name: 'nombre', label: 'Nombre Completo', type: 'text', required: true, md: 6 },
    { name: 'email', label: 'Correo Electrónico', type: 'email', required: true, md: 6 },
    { name: 'curso', label: 'Ciclo / Curso', type: 'select', md: 12, options: [
        { label: '2º DAW', value: 'DAW2' },
        { label: '2º ASIR', value: 'ASIR2' },
        { label: '2º DAM', value: 'DAM2' }
      ] 
    }
  ];

  const manejarGuardar = (datos) => {
    console.log("Nuevo Alumno para el Backend:", datos);
    setShowModal(false);
    alert(`Alumno ${datos.nombre} registrado correctamente.`);
  };

  return (
    <>
      {/* CABECERA DE LA VISTA */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold">Gestión de Alumnos</h2>
          <p className="text-muted">Administración de estudiantes y estados de FCT</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>
            + Dar de Alta Alumno
          </Button>
        </Col>
      </Row>

      {/* RESUMEN INFORMATIVO (InfoCards) */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <InfoCard titulo="Total Alumnos" contenido="45" variante="primary" />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard titulo="En Prácticas" contenido="38" variante="success" />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard titulo="Pendientes" contenido="7" variante="danger" />
        </Col>
      </Row>

      {/* TABLA DE DATOS */}
      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <h5 className="mb-3">Listado de Alumnos</h5>
            <AppTable 
              headers={columnas} 
              data={alumnosEjemplo} 
              accessorKeys={llaves} 
              actions={[
                { label: 'Editar', variant: 'outline-secondary', handler: (a) => console.log("Editando:", a) }
              ]}
            />
          </div>
        </Col>
      </Row>

      {/* MODAL PARA NUEVO ALUMNO */}
      <AppModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        title="Registrar Nuevo Estudiante"
      >
        <AppForm 
          fields={camposAlumno} 
          onSubmit={manejarGuardar} 
          buttonLabel="Guardar Alumno" 
        />
      </AppModal>
    </>
  );
};

export default GestionAlumnos;