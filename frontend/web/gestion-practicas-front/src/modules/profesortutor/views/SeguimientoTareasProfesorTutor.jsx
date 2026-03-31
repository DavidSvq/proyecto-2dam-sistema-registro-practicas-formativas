import { Row, Col } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";

const SeguimientoTareasProfesorTutor = () => {
  // 1. Datos de ejemplo: Últimas tareas de los alumnos tutelados
  const tareasAlumnos = [
    { id: 301, alumno: 'Ana López', semana: 'Semana 3', titulo: 'Conexión a API', estado: 'Pendiente de Validar' },
    { id: 302, alumno: 'Pedro Ruíz', semana: 'Semana 3', titulo: 'Maquetación CSS', estado: 'Validada' },
    { id: 303, alumno: 'Ana López', semana: 'Semana 2', titulo: 'Estructura Proyecto', estado: 'Validada' },
  ];

  // 2. Configuración de la Tabla
  const columnas = ['Alumno', 'Semana', 'Actividad Realizada', 'Estado'];
  const llaves = ['alumno', 'semana', 'titulo', 'estado'];

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Seguimiento de Tareas</h2>
          <p className="text-muted">Revisión y supervisión de los diarios de trabajo de sus alumnos.</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <AppTable 
              headers={columnas} 
              data={tareasAlumnos} 
              accessorKeys={llaves} 
              actions={[
                { 
                  label: 'Detalles', 
                  variant: 'outline-secondary', 
                  handler: (t) => console.log("Abriendo detalle de tarea:", t.id) 
                }
              ]}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SeguimientoTareasProfesorTutor;