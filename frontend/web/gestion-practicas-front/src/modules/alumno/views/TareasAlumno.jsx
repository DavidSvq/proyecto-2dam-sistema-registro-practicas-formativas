import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge, Stack } from "react-bootstrap";
import { tareaService } from "../../../services/tareaService";
import AppTable from "../../../common/components/AppTable";
import AppModal from "../../../common/components/AppModal";
import AppForm from "../../../common/components/AppForm";

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
        horasReales: item.horasReales ? `${Number(item.horasReales).toFixed(2)} h` : "0.00 h"
      }));
      
      setTareas(dataFormateada);
      setError(null);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
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
  const tareaActiva = tareas.find(t => 
    t.estado === "EN_PROGRESO" || t.estado === "ASIGNADA" || t.estado === "REASIGNADA"
  );

  // Cambios de estado sin horas (Iniciar / Pedir Ayuda)
  const handleCambiarEstadoSimple = async (id, nuevoEstado) => {
    try {
      setActionLoading(true);
      // Mapea con el Controller: @RequestParam EstadoTarea nuevoEstado, @RequestParam Double horas
      await tareaService.completarTareaAlumno(id, nuevoEstado, 0);
      await cargarDatos();
    } catch (err) {
      alert("Error al actualizar el estado: " + (err.response?.data?.message || "Servidor no disponible"));
    } finally {
      setActionLoading(false);
    }
  };

  // Cierre de tarea con horas desde AppForm
  const handleFinalizarTarea = async (formData) => {
    try {
      setActionLoading(true);
      // Usamos el campo "horas" que definimos en camposFinalizar
      await tareaService.completarTareaAlumno(
        tareaActiva.idTarea, 
        "COMPLETADA", 
        formData.horas 
      );
      
      setShowFinalizarModal(false);
      await cargarDatos();
      alert("¡Tarea finalizada y horas registradas!");
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || "No se pudo cerrar la tarea"));
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
    <Container fluid className="px-4 pb-5">
      {/* CABECERA */}
      <Row className="mb-4 pt-3">
        <Col md={8}>
          <h2 className="fw-bold text-primary mb-0">Mi Plan de Trabajo</h2>
          <p className="fs-5 fw-bold text-dark mb-0">
            <i className="bi bi-journal-check me-2 text-primary"></i>
            Gestión y Reporte de Tareas
          </p>
        </Col>
        <Col md={4} className="text-md-end">
          <Badge bg="light" text="dark" className="border shadow-sm p-2">Alumno ID: {user?.id}</Badge>
        </Col>
      </Row>

      {/* PANEL DE ACCIÓN (TAREA ACTUAL) */}
      <Card className={`border-0 shadow-sm mb-5 ${tareaActiva?.estado === 'EN_PROGRESO' ? 'border-start border-4 border-primary' : ''}`}>
        <Card.Body className="py-4">
          {tareaActiva ? (
            <Row className="align-items-center">
              <Col lg={8}>
                <Stack direction="horizontal" gap={2} className="mb-2">
                  <h3 className="fw-bold mb-0">{tareaActiva.titulo}</h3>
                  {getBadgeEstado(tareaActiva.estado)}
                </Stack>
                <p className="text-muted fs-5">{tareaActiva.descripcion}</p>
                <div className="d-flex gap-4 small fw-bold text-secondary">
                  <span><i className="bi bi-calendar-x me-1"></i> Límite: {tareaActiva.fechaLimite}</span>
                  <span><i className="bi bi-clock-history me-1"></i> Estimación IA: {tareaActiva.horasEstimadasIA}h</span>
                </div>
              </Col>
              <Col lg={4} className="text-lg-end mt-4 mt-lg-0">
                <Stack direction="horizontal" gap={2} className="justify-content-lg-end">
                  {tareaActiva.estado === "ASIGNADA" && (
                    <Button variant="primary" size="lg" className="px-4" onClick={() => handleCambiarEstadoSimple(tareaActiva.idTarea, "EN_PROGRESO")} disabled={actionLoading}>
                      Iniciar Tarea
                    </Button>
                  )}

                  {tareaActiva.estado === "EN_PROGRESO" && (
                    <>
                      <Button variant="outline-danger" onClick={() => handleCambiarEstadoSimple(tareaActiva.idTarea, "ASIGNADA")} disabled={actionLoading}>
                        Pedir Ayuda
                      </Button>
                      <Button variant="success" size="lg" className="px-4" onClick={() => setShowFinalizarModal(true)}>
                        Finalizar Tarea
                      </Button>
                    </>
                  )}

                  {tareaActiva.estado === "REASIGNADA" && (
                    <Alert variant="warning" className="mb-0 py-2 border-0 shadow-sm">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      Ayuda solicitada al tutor.
                    </Alert>
                  )}
                </Stack>
              </Col>
            </Row>
          ) : (
            <div className="text-center py-3">
              <p className="text-muted mb-0 font-italic">No tienes tareas activas asignadas en este momento.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* HISTORIAL Y FILTROS */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
          <h5 className="mb-0 fw-bold">Registro de Actividades</h5>
          <div className="d-flex gap-2">
            {/* Buscador de texto */}
            <Form.Control 
              placeholder="Buscar por título..." 
              size="sm" 
              className="w-auto" 
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)} 
            />
            
            {/* Selector con TODOS los estados del Enum de Java */}
            <Form.Select 
              size="sm" 
              className="w-auto" 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="ASIGNADA">Asignadas</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="COMPLETADA">Completadas (Pendiente Validar)</option>
              <option value="VALIDADA">Validadas (Finalizadas)</option>
              <option value="CANCELADA">Canceladas</option>
            </Form.Select>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <AppTable 
            headers={tableHeaders} 
            accessorKeys={tableKeys} 
            data={tareasFiltradas} 
            onView={(t) => { setTareaSeleccionada(t); setShowViewModal(true); }}
          />
        </Card.Body>
      </Card>

      {/* MODAL: VER DETALLES */}
      <AppModal show={showViewModal} handleClose={() => setShowViewModal(false)} title="Información de la Tarea">
        {tareaSeleccionada && (
          <div className="px-2">
            <h4 className="fw-bold text-primary">{tareaSeleccionada.titulo}</h4>
            <div className="mb-3">{getBadgeEstado(tareaSeleccionada.estado)}</div>
            <p className="p-3 bg-light rounded border">{tareaSeleccionada.descripcion}</p>
            <Row className="mt-4">
              <Col xs={6}>
                <label className="text-muted small d-block">LÍMITE DE ENTREGA</label>
                <span className="fw-bold">{tareaSeleccionada.fechaLimite}</span>
              </Col>
              <Col xs={6}>
                <label className="text-muted small d-block">HORAS REPORTADAS</label>
                <span className="fw-bold text-success">{tareaSeleccionada.horasReales}</span>
              </Col>
            </Row>
          </div>
        )}
      </AppModal>

      {/* MODAL: FINALIZAR TAREA (REPORTE DE HORAS) */}
      <AppModal show={showFinalizarModal} handleClose={() => setShowFinalizarModal(false)} title="Finalizar Entrega">
        <div className="px-2">
          <Alert variant="primary" className="border-0 shadow-sm py-2 mb-4">
             <i className="bi bi-info-circle-fill me-2"></i>
             Indica el tiempo real que te ha tomado completar: <strong>{tareaActiva?.titulo}</strong>
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