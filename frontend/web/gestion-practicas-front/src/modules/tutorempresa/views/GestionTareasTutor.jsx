import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert, Form, Card } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";
import { tutorEmpresaService } from "../../../services/tutorEmpresaService";

const GestionTareasTutor = ({ user }) => {
  const [alumnos, setAlumnos] = useState([]); // Para el Selector
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(""); // ID del alumno actual
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Configuración de la Tabla
  const columnas = ['Fecha Límite', 'Título Tarea', 'Horas Estimadas', 'Estado'];
  const llaves = ['fechaLimite', 'titulo', 'horasEstimadasIA', 'estado'];

  // EFECTO A: Cargar la lista de alumnos inicial (para el Select)
  useEffect(() => {
    const cargarAlumnos = async () => {
      if (user?.id) {
        try {
          const data = await tutorEmpresaService.getMisAlumnos(user.id);
          setAlumnos(data);
          if (data.length > 0) {
            setAlumnoSeleccionado(data[0].id); // Seleccionamos el primero por defecto
          }
        } catch (err) {
          setError("Error al cargar la lista de alumnos.");
        }
      }
    };
    cargarAlumnos();
  }, [user?.id]);

  // EFECTO B: Cargar tareas cada vez que cambie el alumno en el Selector
  useEffect(() => {
    const fetchTareas = async () => {
      if (!alumnoSeleccionado) return;
      
      try {
        setLoading(true);
        const data = await tutorEmpresaService.getTareasAlumno(alumnoSeleccionado);
        
        // Flattening simple para la tabla
        const tareasAplanadas = data.map(tarea => ({
          ...tarea,
          horasEstimadasIA: `${tarea.horasEstimadasIA}h`
        }));

        setTareas(tareasAplanadas);
      } catch (err) {
        console.error("Error cargando tareas:", err);
        setTareas([]); // Limpiar si hay error
      } finally {
        setLoading(false);
      }
    };

    fetchTareas();
  }, [alumnoSeleccionado]);

  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  return (
    <>
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <h2 className="fw-bold">Gestión de Tareas</h2>
          <p className="text-muted">Seleccione un alumno para supervisar sus actividades.</p>
        </Col>
        
        {/* SELECTOR DINÁMICO */}
        <Col md={4}>
          <Card className="border-primary shadow-sm">
            <Card.Body className="p-2">
              <Form.Group>
                <Form.Label className="small fw-bold text-primary mb-1">ALUMNO ASIGNADO</Form.Label>
                <Form.Select 
                  value={alumnoSeleccionado} 
                  onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                  className="form-select-sm"
                >
                  {alumnos.length === 0 && <option>No hay alumnos</option>}
                  {alumnos.map(alu => (
                    <option key={alu.id} value={alu.id}>
                      {alu.nombre} {alu.apellidos}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            {loading ? (
              <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
            ) : (
              <AppTable 
                headers={columnas} 
                data={tareas} 
                accessorKeys={llaves} 
                actions={[
                  { 
                    label: 'Revisar', 
                    variant: 'outline-success', 
                    handler: (tarea) => console.log("Revisando tarea ID:", tarea.idTarea) 
                  }
                ]}
              />
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default GestionTareasTutor;