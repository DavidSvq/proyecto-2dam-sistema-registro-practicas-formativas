import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge, Stack } from "react-bootstrap";
import { tareaService } from "../../../services/tareaService";
import AppTable from "../../../common/components/AppTable";
import AppModal from "../../../common/components/AppModal";
import AppForm from "../../../common/components/AppForm";
import Swal from 'sweetalert2';

const TareasAlumno = ({ user }) => {
  // --- ESTADOS DE DATOS ---
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // --- ESTADOS DE INTERACCIÓN ---
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  // --- ESTADOS DE MODALES ---
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  // Configuración para AppTable
  const tableHeaders = ["ID", "Título", "Límite", "Estado", "Horas Reales"];
  const tableKeys = ["idTarea", "titulo", "fechaLimite", "estado", "horasReales"];

  // Configuración para AppForm (Solo horas, ya que el Back no pide descripción en el Patch)
  const camposFinalizar = [
    { 
      label: "Horas Reales Invertidas (Obligatorio)", 
      name: "horas", 
      type: "number", 
      required: true, 
      placeholder: "Ej: 4.5",
      md: 12 
    }
  ];

  // --- CARGA DE DATOS ---
  const cargarDatos = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const lista = await tareaService.getTareasPorAlumno(user.id);
      
      // Formateo de datos para la tabla (Estilo Asistencia)
      const dataFormateada = (lista || []).map(item => ({
        ...item,
        horasRealesFormateadas: item.horasReales ? `${Number(item.horasReales).toFixed(2)} h` : "0.00 h"
      }));
      
      setTareas(dataFormateada);
      setError(null);
    } catch (err) {
      setError("No se pudo conectar con el servidor de tareas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [user?.id]);

  // --- LÓGICA DE NEGOCIO ---
  
  // Identificamos la tarea en curso
  const tareaActivaAuto = tareas.find(t => 
    t.estado === "EN_PROGRESO" || t.estado === "ASIGNADA" || t.estado === "REASIGNADA"
  );

  const tareaAMostrar = tareaSeleccionada || tareaActivaAuto || null;

  // Cambios de estado sin horas (Iniciar / Pedir Ayuda)
  const handleCambiarEstadoSimple = async (id, nuevoEstado) => {
    try {
      setActionLoading(true);
      // Mapea con el Controller: @RequestParam EstadoTarea nuevoEstado, @RequestParam Double horas
      await tareaService.completarTareaAlumno(id, nuevoEstado, 0);
      setTareaSeleccionada(null);
      await cargarDatos();
    } catch (err) {
      Swal.fire({
        title: "Error de Actualización",
        text: err.response?.data?.message || "Servidor no disponible",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Cierre de tarea con horas desde AppForm
  const handleFinalizarTarea = async (formData) => {
    if (!tareaAMostrar) return;
    try {
      setActionLoading(true);
      // Usamos el campo "horas" que definimos en camposFinalizar
      await tareaService.completarTareaAlumno(
        tareaActivaAuto.idTarea, 
        "COMPLETADA", 
        formData.horas 
      );
      
      setShowFinalizarModal(false);
      setTareaSeleccionada(null);
      await cargarDatos();
      Swal.fire({
        title: "¡Éxito!",
        text: "¡Tarea finalizada y horas registradas!",
        icon: "success",
        confirmButtonColor: "#0d6efd",
        timer: 2000
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "No se pudo cerrar la tarea",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    } finally {
      setActionLoading(false);
    }
  };

  // --- FILTRADO ---
  const tareasFiltradas = tareas.filter(t => {
    const matchText = (t.titulo?.toLowerCase() || "").includes(filtroTexto.toLowerCase());
    const matchEstado = filtroEstado === "" || t.estado === filtroEstado;
    return matchText && matchEstado;
  });

  const getBadgeEstado = (estado) => {
    const colores = {
      ASIGNADA: "secondary",
      EN_PROGRESO: "warning",
      COMPLETADA: "info",
      VALIDADA: "success",
      REASIGNADA: "danger",
      CANCELADA: "dark"
    };
    return <Badge bg={colores[estado] || "light"}>{estado}</Badge>;
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  return (
    <Container fluid className="px-2 px-md-4 pb-5">
      {/* CABECERA */}
      <Row className="mb-4 pt-3 align-items-center">
        <Col xs={12} md={8} className="text-center text-md-start">
          <h2 className="fw-bold text-primary mb-0 fs-3 fs-md-2">Mi Plan de Trabajo</h2>
          <p className="fs-6 fw-bold text-dark mb-0">
            <i className="bi bi-journal-check me-2 text-primary"></i>
            Gestión y Reporte de Tareas
          </p>
        </Col>
        <Col xs={12} md={4} className="text-center text-md-end mt-2 mt-md-0">
          <Badge bg="light" text="dark" className="border shadow-sm p-2 w-100 w-md-auto">
            Alumno ID: {user?.id}
          </Badge>
        </Col>
      </Row>

      {/* CARD DINÁMICA */}
      <Card className={`border-0 shadow-sm mb-4 mb-md-5 ${tareaAMostrar?.estado === 'EN_PROGRESO' ? 'border-start border-4 border-primary' : ''}`}>
        <Card.Body className="py-4">
          {tareaAMostrar ? (
            <Row className="align-items-center g-3"> 
              <Col xs={12} lg={8}>
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 mb-2">
                  <h3 className="fw-bold mb-0 fs-4 fs-md-3">{tareaAMostrar.titulo}</h3>
                  <div>{getBadgeEstado(tareaAMostrar.estado)}</div>
                </div>
                <p className="text-muted fs-6 fs-md-5">{tareaAMostrar.descripcion}</p>
                
                {/* Información secundaria: se envuelve (wrap) en pantallas pequeñas */}
                <div className="d-flex flex-wrap gap-3 gap-md-4 small fw-bold text-secondary">
                  <span><i className="bi bi-calendar-x me-1"></i> Límite: {tareaAMostrar.fechaLimite}</span>
                  <span><i className="bi bi-clock-history me-1"></i> Est.: {tareaAMostrar.horasEstimadasIA}h</span>
                  {tareaAMostrar.horasRealesFormateadas !== "0.00 h" && (
                    <span className="text-success"><i className="bi bi-clock-fill me-1"></i> {tareaAMostrar.horasRealesFormateadas}</span>
                  )}
                </div>
              </Col>
              
              <Col xs={12} lg={4} className="text-lg-end">
                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-lg-end">
                  {tareaAMostrar.estado === "ASIGNADA" && (
                    <Button variant="primary" size="lg" className="w-100 w-md-auto" onClick={() => handleCambiarEstadoSimple(tareaAMostrar.idTarea, "EN_PROGRESO")} disabled={actionLoading}>
                      Iniciar Tarea
                    </Button>
                  )}
                  {tareaAMostrar.estado === "EN_PROGRESO" && (
                    <>
                      <Button variant="outline-danger" className="w-100 w-md-auto" onClick={() => handleCambiarEstadoSimple(tareaAMostrar.idTarea, "ASIGNADA")} disabled={actionLoading}>
                        Pedir Ayuda
                      </Button>
                      <Button variant="success" size="lg" className="w-100 w-md-auto" onClick={() => setShowFinalizarModal(true)}>
                        Finalizar Tarea
                      </Button>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          ) : (
            <div className="text-center py-3 text-muted">No hay tareas seleccionadas o activas.</div>
          )}
        </Card.Body>
      </Card>

      {/* HISTORIAL Y FILTROS */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <Card.Header className="bg-white py-3 border-bottom">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <h5 className="mb-0 fw-bold">Registro de Actividades</h5>
            <div className="d-flex flex-column flex-sm-row gap-2">
              <Form.Control 
                placeholder="Buscar por título..." 
                size="sm" 
                className="w-100 w-md-auto" 
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)} 
              />
              <Form.Select 
                size="sm" 
                className="w-100 w-md-auto" 
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="ASIGNADA">Asignadas</option>
                <option value="EN_PROGRESO">En Progreso</option>
                <option value="COMPLETADA">Completadas</option>
                <option value="VALIDADA">Validadas</option>
                <option value="CANCELADA">Canceladas</option>
              </Form.Select>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <AppTable 
            headers={tableHeaders} 
            accessorKeys={tableKeys} 
            data={tareasFiltradas} 
            onView={(t) => { 
              setTareaSeleccionada(t); 
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Card.Body>
      </Card>

      {/* MODAL: FINALIZAR TAREA */}
      <AppModal show={showFinalizarModal} handleClose={() => setShowFinalizarModal(false)} title="Finalizar Entrega">
        <div className="px-1">
          <Alert variant="primary" className="border-0 shadow-sm py-2 mb-4 small">
             <i className="bi bi-info-circle-fill me-2"></i>
             Indica el tiempo real para: <strong>{tareaAMostrar?.titulo}</strong>
          </Alert>
          <AppForm 
            fields={camposFinalizar} 
            onSubmit={handleFinalizarTarea} 
            buttonLabel="Confirmar y Cerrar Tarea"
          />
        </div>
      </AppModal>
    </Container>
  );
};

export default TareasAlumno;