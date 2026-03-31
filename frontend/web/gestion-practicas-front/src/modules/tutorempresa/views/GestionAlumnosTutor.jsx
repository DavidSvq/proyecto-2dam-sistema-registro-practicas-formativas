import { Row, Col } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";

const GestionAlumnosTutor = () => {
  // 1. Datos de ejemplo específicos para el Tutor
  // En el futuro, estos vendrán filtrados por la ID de la empresa del tutor
  const misAlumnos = [
    { id: 101, nombre: 'Ana López', email: 'ana.l@fp.com', ciclo: '2º DAW', horas: '120/370' },
    { id: 102, nombre: 'Pedro Ruíz', email: 'p.ruiz@fp.com', ciclo: '2º DAW', horas: '80/370' },
  ];

  // 2. Configuración de la Tabla (más simplificada que la del Gestor)
  const columnas = ['Nombre', 'Email', 'Ciclo / Curso', 'Horas Acumuladas'];
  const llaves = ['nombre', 'email', 'ciclo', 'horas'];

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Mis Alumnos en Prácticas</h2>
          <p className="text-muted">Listado de alumnos asignados a su tutoría en esta empresa.</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <AppTable 
              headers={columnas} 
              data={misAlumnos} 
              accessorKeys={llaves} 
              actions={[
                { 
                  label: 'Ver Ficha', 
                  variant: 'outline-primary', 
                  handler: (alumno) => console.log("Consultando ficha de:", alumno) 
                }
              ]}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default GestionAlumnosTutor;