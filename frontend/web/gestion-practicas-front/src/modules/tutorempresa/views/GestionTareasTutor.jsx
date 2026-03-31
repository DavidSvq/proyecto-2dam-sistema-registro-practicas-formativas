import { Row, Col } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";

const GestionTareasTutor = () => {
  // 1. Datos de ejemplo: Tareas enviadas por los alumnos para revisión
  const tareasPendientes = [
    { id: 501, alumno: 'Ana López', fecha: '2026-03-20', titulo: 'Implementación de Login', estado: 'Pendiente' },
    { id: 502, alumno: 'Pedro Ruíz', fecha: '2026-03-21', titulo: 'Diseño de Base de Datos', estado: 'Revisada' },
  ];

  // 2. Configuración de la Tabla
  const columnas = ['Alumno', 'Fecha Entrega', 'Descripción Tarea', 'Estado'];
  const llaves = ['alumno', 'fecha', 'titulo', 'estado'];

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Gestión de Tareas</h2>
          <p className="text-muted">Supervisión y validación de las tareas semanales de los alumnos.</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <AppTable 
              headers={columnas} 
              data={tareasPendientes} 
              accessorKeys={llaves} 
              actions={[
                { 
                  label: 'Revisar', 
                  variant: 'outline-success', 
                  handler: (tarea) => console.log("Revisando tarea:", tarea) 
                }
              ]}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default GestionTareasTutor;