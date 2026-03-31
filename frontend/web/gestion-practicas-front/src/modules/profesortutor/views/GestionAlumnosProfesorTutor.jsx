import { Row, Col } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";

const GestionAlumnosProfesorTutor = () => {
  // 1. Datos de ejemplo: Alumnos que este profesor tutela
  const alumnosTutelados = [
    { id: 201, nombre: 'Ana López', empresa: 'Tech Solutions S.L.', tutorEmpresa: 'Carlos Gómez', estado: 'Activo' },
    { id: 202, nombre: 'Pedro Ruíz', empresa: 'Sistemas Avanzados', tutorEmpresa: 'Elena Marte', estado: 'Activo' },
    { id: 203, nombre: 'Lucía Sanz', empresa: 'Diseño Digital', tutorEmpresa: 'Roberto Sol', estado: 'Finalizado' },
  ];

  // 2. Configuración de la Tabla
  const columnas = ['Alumno', 'Empresa Asignada', 'Tutor de Empresa', 'Estado'];
  const llaves = ['nombre', 'empresa', 'tutorEmpresa', 'estado'];

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Mis Alumnos Tutelados</h2>
          <p className="text-muted">Listado de estudiantes bajo su supervisión académica.</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <AppTable 
              headers={columnas} 
              data={alumnosTutelados} 
              accessorKeys={llaves} 
              actions={[
                { 
                  label: 'Ver Seguimiento', 
                  variant: 'outline-primary', 
                  handler: (a) => console.log("Consultando seguimiento de:", a.nombre) 
                }
              ]}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default GestionAlumnosProfesorTutor;