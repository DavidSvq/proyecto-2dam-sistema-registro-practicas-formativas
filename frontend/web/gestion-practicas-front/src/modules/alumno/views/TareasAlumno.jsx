import { Row, Col } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";

const TareasAlumno = () => {
  // 1. Datos de ejemplo para el listado de tareas
  const misTareas = [
    { id: 1, semana: 'Semana 1', titulo: 'Configuración entorno y Git', estado: 'Entregado' },
    { id: 2, semana: 'Semana 2', titulo: 'Maquetación vistas Login', estado: 'Entregado' },
    { id: 3, semana: 'Semana 3', titulo: 'Desarrollo de Rutas Privadas', estado: 'Pendiente' },
  ];

  // 2. Configuración de la Tabla
  const columnas = ['Semana', 'Descripción de la Tarea', 'Estado'];
  const llaves = ['semana', 'titulo', 'estado'];

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Mis Tareas</h2>
          <p className="text-muted">Seguimiento de actividades semanales entregadas.</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <AppTable 
              headers={columnas} 
              data={misTareas} 
              accessorKeys={llaves} 
              // Quitamos el array de actions para que sea solo lectura
              actions={[]} 
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default TareasAlumno;