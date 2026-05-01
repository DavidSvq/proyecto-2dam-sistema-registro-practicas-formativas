import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge } from "react-bootstrap";
import { asistenciaService } from "../../../services/asistenciaService";
import AppTable from "../../../common/components/AppTable";
import InfoCard from "../../../common/components/InfoCard";
import AppModal from "../../../common/components/AppModal";
import AppForm from "../../../common/components/AppForm";
import Swal from 'sweetalert2';

const AsistenciaAlumno = ({ user }) => {
  // Estados de datos
  const [asistenciaHoy, setAsistenciaHoy] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de interacción
  const [horaManual, setHoraManual] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [filtroFecha, setFiltroFecha] = useState("");

  // Estados para tu AppModal y AppForm
  const [showEditModal, setShowEditModal] = useState(false);
  const [registroAEditar, setRegistroAEditar] = useState(null);

  // Configuración de columnas para AppTable
  const tableHeaders = ["Fecha", "Entrada", "Salida", "Horas", "Observaciones"];
  const tableKeys = ["fecha", "horaEntrada", "horaSalida", "horasDiarias", "observaciones"];

  // Configuración de campos para tu AppForm (Edición)
  const camposEdicion = [
    { label: "Fecha", name: "fecha", type: "date", disabled: true, md: 12 },
    { label: "Hora de Entrada", name: "horaEntrada", type: "time", required: true, md: 6 },
    { label: "Hora de Salida", name: "horaSalida", type: "time", required: true, md: 6 },
    { label: "Observaciones", name: "observaciones", type: "textarea", md: 12 }
  ];

  const hoyLargo = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const getHoraActual = () => {
    return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const cargarDatos = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const hoyISO = new Date().toISOString().split('T')[0];
      
      // 1. Estado de hoy
      const estadoHoy = await asistenciaService.buscarPorFecha(user.id, hoyISO);
      setAsistenciaHoy(estadoHoy);
      setObservaciones(estadoHoy?.observaciones || "");
      setHoraManual(getHoraActual());

      // 2. Historial completo
      const lista = await asistenciaService.getHistorial(user.id);
      formatearYSetearHistorial(lista);
      
      setError(null);
    } catch (err) {
      setError("Error al conectar con el servidor de asistencias.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatearYSetearHistorial = (lista) => {
    const data = (lista || []).map(item => ({
      ...item,
      // Formateamos las horas para que tu AppTable las pinte directamente con unidad
      horasDiarias: item.horasDiarias ? `${Number(item.horasDiarias).toFixed(2)} h` : "-"
    }));
    setHistorial(data);
  };

  useEffect(() => {
    cargarDatos();
  }, [user?.id]);

  // --- ACCIONES DE FICHAJE ---
  const handleEntrada = async () => {
    try {
      setActionLoading(true);
      await asistenciaService.registrarEntrada(user.id, `${horaManual}:00`);
      await cargarDatos();
    } catch (err) {
      Swal.fire({
        title: "Error de Registro",
        text: err.response?.data?.message || "Error al registrar entrada",
        icon: "error",
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Aceptar"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSalida = async () => {
    try {
      setActionLoading(true);
      await asistenciaService.registrarSalida(user.id, observaciones, `${horaManual}:00`);
      await cargarDatos();
    } catch (err) {
      Swal.fire({
        title: "Error de Registro",
        text: err.response?.data?.message || "Error al registrar salida",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    } finally {
      setActionLoading(false);
    }
  };

  // --- LÓGICA DE FILTRO ---
  const handleFiltrar = async () => {
    if (!filtroFecha) {
      cargarDatos();
      return;
    }
    try {
      const res = await asistenciaService.buscarPorFecha(user.id, filtroFecha);
      formatearYSetearHistorial(res ? [res] : []);
    } catch (err) {
      console.error("Error filtrando:", err);
    }
  };

  // --- LÓGICA DE EDICIÓN (USANDO TUS COMPONENTES) ---
  const handleAbrirEdicion = (item) => {
    // Quitamos el " h" del string para que el formulario trate el valor limpio
    const limpio = { ...item, horasDiarias: item.horasDiarias.replace(" h", "") };
    setRegistroAEditar(limpio);
    setShowEditModal(true);
  };

  const handleGuardarEdicion = async (formData) => {
    try {
      setActionLoading(true);

      // 1. Llamada al service usando el ID que guardamos al abrir el modal
      // registroAEditar.idAsistencia es el nombre que viene en tu JSON
      await asistenciaService.actualizarAsistencia(registroAEditar.idAsistencia, formData);
      
      // 2. Cerramos el modal
      setShowEditModal(false);
      
      // 3. RECARGAMOS LOS DATOS PARA VER LOS CAMBIOS REFLEJADOS
      await cargarDatos(); 

      Swal.fire({
        title: "¡Éxito!",
        text: "¡Registro actualizado correctamente!",
        icon: "success",
        confirmButtonColor: "#0d6efd",
        timer: 2000
      });
    } catch (err) {
      console.error("Error al actualizar:", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "No se pudo actualizar el registro",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  const estaDentro = asistenciaHoy && !asistenciaHoy.horaSalida;
  const jornadaCerrada = asistenciaHoy && asistenciaHoy.horaSalida;

  return (
    <Container fluid className="px-2 px-md-4 pb-5">
      {/* CABECERA: Se apila en móvil, alineada en PC */}
      <Row className="mb-3 mb-md-4 pt-3 align-items-center"> {/* Reducimos margen en móvil */}
        <Col xs={12} md={8} className="mb-2 mb-md-0 text-center text-md-start"> {/* Centrado en móvil ayuda a la jerarquía */}
          <h2 className="fw-bold text-primary mb-0 fs-3 fs-md-2">Gestión de Asistencia</h2>
          <p className="fs-6 fw-bold text-dark text-capitalize mb-0">
            <i className="bi bi-calendar3 me-2 text-primary"></i>
            {hoyLargo}
          </p>
        </Col>
        <Col xs={12} md={4} className="text-center text-md-end">
           <Badge bg="light" text="dark" className="border shadow-sm p-2 w-100 w-md-auto mt-2 mt-md-0">
             Alumno: {user?.id}
           </Badge>
        </Col>
      </Row>

      {/* PANEL DE CONTROL DINÁMICO */}
      <Row className="mb-4 mb-md-5 g-3"> {/* g-3 asegura espacio uniforme entre las dos columnas */}
        <Col lg={4}>
          <InfoCard 
            titulo="Estado Actual" 
            contenido={!asistenciaHoy ? "Ausente" : estaDentro ? "En Jornada" : "Finalizado"} 
            variante={!asistenciaHoy ? "secondary" : estaDentro ? "warning" : "success"}
            icono="bi bi-person-badge"
          />
        </Col>
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100 bg-white">
            <Card.Body className="d-flex align-items-center p-3 p-md-4">
              {!asistenciaHoy && (
                <div className="w-100 d-flex flex-column flex-md-row gap-3 align-items-md-end">
                    <Form.Group className="flex-grow-1">
                       <Form.Label className="small fw-bold text-muted">HORA DE ENTRADA</Form.Label>
                       <Form.Control 
                         type="time" 
                         size="lg" // Botones e inputs más grandes en móvil son más fáciles de tocar
                         value={horaManual} 
                         onChange={(e)=>setHoraManual(e.target.value)}
                       />
                    </Form.Group>
                    <Button variant="primary" size="lg" className="px-4 w-100 w-md-auto" onClick={handleEntrada} disabled={actionLoading}>
                      Fichar Entrada
                    </Button>
                </div>
              )}

              {estaDentro && (
                <div className="w-100">
                  <Row className="g-3"> {/* g-3 para que los inputs no se peguen al apilarse */}
                    <Col xs={12} md={3}>
                      <Form.Label className="small fw-bold text-muted">HORA SALIDA</Form.Label>
                      <Form.Control type="time" size="lg" value={horaManual} onChange={(e)=>setHoraManual(e.target.value)}/>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Label className="small fw-bold text-muted">OBSERVACIONES</Form.Label>
                      <Form.Control 
                        placeholder="¿Qué has hecho hoy?" 
                        size="lg"
                        value={observaciones} 
                        onChange={(e)=>setObservaciones(e.target.value)}
                      />
                    </Col>
                    <Col xs={12} md={3} className="d-flex align-items-end">
                      <Button variant="danger" size="lg" className="w-100" onClick={handleSalida} disabled={actionLoading}>
                        Cerrar Jornada
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}

              {jornadaCerrada && (
                <div className="text-center w-100 py-2">
                  <h5 className="text-success mb-0 fw-bold fs-6 fs-md-5">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Jornada completada ({asistenciaHoy.horaEntrada} - {asistenciaHoy.horaSalida})
                  </h5>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* HISTORIAL CON FILTRADO */}
      <Card className="border-0 shadow-sm overflow-hidden"> {/* overflow-hidden evita que la tabla sobresalga del radio del borde */}
        <Card.Header className="bg-white py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom gap-3">
          <h5 className="fs-5 fw-bold mb-0 text-center text-md-start">Historial de Jornadas</h5>
          <div className="d-flex gap-2 flex-wrap flex-md-nowrap">
            <Form.Control 
              type="date" 
              className="flex-grow-1 w-md-auto" 
              value={filtroFecha} 
              onChange={(e) => setFiltroFecha(e.target.value)} 
            />
            <Button variant="primary" className="flex-grow-1" onClick={handleFiltrar}>Buscar</Button>
            <Button variant="secondary" className="flex-grow-1" onClick={() => {setFiltroFecha(""); cargarDatos();}}>
                <i className="bi bi-arrow-clockwise"></i> {/* Un icono ayuda a identificar "Limpiar" en móvil */}
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <AppTable 
            headers={tableHeaders} 
            accessorKeys={tableKeys} 
            data={historial} 
            onEdit={handleAbrirEdicion}
          />
        </Card.Body>
      </Card>

      {/* MODAL EDICIÓN */}
      <AppModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        title={`Editar Jornada - ${registroAEditar?.fecha}`}
        size="lg"
      >
        <AppForm 
          fields={camposEdicion} 
          initialValues={registroAEditar} 
          onSubmit={handleGuardarEdicion}
          buttonLabel="Guardar Cambios"
        />
      </AppModal>
    </Container>
  );
};

export default AsistenciaAlumno;