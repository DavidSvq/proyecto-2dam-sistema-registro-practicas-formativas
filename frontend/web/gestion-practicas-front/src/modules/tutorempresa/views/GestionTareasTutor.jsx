import { useEffect, useState, useMemo } from "react";
import { Row, Col, Spinner, Alert, Form, Button, Container } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";
import AppModal from "../../../common/components/AppModal";
import AppForm from "../../../common/components/AppForm";
import { tareaService } from "../../../services/tareaService";
import { tutorEmpresaService } from "../../../services/tutorEmpresaService";
import Swal from 'sweetalert2';

const GestionTareasTutor = ({ user }) => {
  const [todasLasTareas, setTodasLasTareas] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null); // Para editar
  
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtroAlumno, setFiltroAlumno] = useState("TODOS");
  const [filtroEstado, setFiltroEstado] = useState("ASIGNADA"); 
  const [filtroTexto, setFiltroTexto] = useState("");

  // Ajuste de llaves: usamos 'id' que es lo que viene del back
  const columnas = ['ID','Fecha Límite', 'Título Tarea', 'Alumno', 'Horas Estimadas', 'Estado'];
  const llaves = ['idTarea', 'fechaLimite', 'titulo', 'nombreAlumno', 'horasEstimadasIA', 'estado'];

  const cargarDatos = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [resTareas, resAlumnos] = await Promise.all([
        tareaService.getTodasPorTutor(user.id),
        tutorEmpresaService.getMisAlumnos(user.id)
      ]);

      const tareasAplanadas = resTareas.map(t => ({
        ...t,
        nombreAlumno: t.alumno ? `${t.alumno.nombre} ${t.alumno.apellidos}` : 'Sin asignar',
        horasEstimadasIA: `${t.horasEstimadasIA || 0}h`
      }));

      setTodasLasTareas(tareasAplanadas);
      setAlumnos(resAlumnos);
    } catch (err) {
      setError("No se pudieron cargar las tareas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, [user?.id]);

  // Manejador único para Crear y Editar
  const handleSubmitTarea = async (formData) => {
    if (!formData.tecnologia || !formData.tipoTarea || !formData.dificultad) {
      Swal.fire({
        title: "Atención",
        text: "Debes seleccionar Tecnología, Tipo de Tarea y Dificultad para continuar.",
        icon: "warning",
        confirmButtonColor: "#ffc107"
      });
      return; // Detiene la ejecución aquí
    }
    try {
      const prefijo = `${formData.tecnologia} ${formData.tipoTarea} ${formData.dificultad} `;
      const descripcionFinal = prefijo + formData.descripcion;

      // Construimos el JSON limpio que el Backend espera recibir
      const payload = {
        ...(tareaSeleccionada && { idTarea: tareaSeleccionada.idTarea }),
        titulo: formData.titulo,
        descripcion: descripcionFinal,
        fechaLimite: formData.fechaLimite,
        // Si no hay estado en el form (creación), ponemos ASIGNADA
        estado: formData.estado || "ASIGNADA",
        // El Backend necesita los IDs dentro de objetos
        tutorEmpresa: { id: user.id },
        alumno: { id: formData.idAlumno }
      };

      if (tareaSeleccionada) {
        // Para el PUT, necesitamos el ID de la tarea
        // IMPORTANTE: No mandes 'tareaSeleccionada' entero, solo los campos necesarios
        await tareaService.modificarTarea(tareaSeleccionada.idTarea, payload);
      } else {
        await tareaService.crearTarea(payload);
      }

      cerrarModal();
      cargarDatos();
      Swal.fire({
        title: "¡Éxito!",
        text: "¡Tarea guardada con éxito!",
        icon: "success",
        confirmButtonColor: "#0d6efd",
        timer: 2000
      });
    } catch (err) {
      Swal.fire({
        title: "Error al guardar",
        text: "Ocurrió un error al guardar la tarea.",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const abrirModalEdicion = (tarea) => {
    setTareaSeleccionada(tarea);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setTareaSeleccionada(null);
    setShowModal(false);
  };

  const tareasFiltradas = useMemo(() => {
    return todasLasTareas.filter(t => {
      const matchAlu = filtroAlumno === "TODOS" || t.alumno?.id === filtroAlumno;
      const matchEst = filtroEstado === "TODOS" || t.estado === filtroEstado;
      const busqueda = filtroTexto.toLowerCase();
      const matchTexto = t.titulo.toLowerCase().includes(busqueda) || 
                        t.descripcion.toLowerCase().includes(busqueda);
      return matchAlu && matchEst && matchTexto;
    });
  }, [todasLasTareas, filtroAlumno, filtroEstado, filtroTexto]);

  // Campos del formulario con ESTADO incluido para el Tutor
  const campos = [
    { name: 'titulo', label: 'Título de la Tarea', type: 'text', required: true, md: 12 },
    // --- NUEVOS SELECTORES ---
    ...(!tareaSeleccionada ? [
      { 
        name: 'tecnologia', 
        label: 'Tecnología', 
        type: 'select', 
        required: true, 
        md: 4, 
        options: [
          { value: 'Frontend', label: 'Frontend' },
          { value: 'Backend', label: 'Backend' },
          { value: 'Data', label: 'Data' },
          { value: 'Data BBDD', label: 'Data BBDD' },
          { value: 'Mobile', label: 'Mobile' },
          { value: 'Testing', label: 'Testing' },
          { value: 'Sistemas', label: 'Sistemas' },
          { value: 'Gestión', label: 'Gestión' },
          { value: 'Web', label: 'Web' }
        ]
      },
      { 
        name: 'tipoTarea', 
        label: 'Tipo de Tarea', 
        type: 'select', 
        required: true, 
        md: 4, 
        options: [
          { value: 'Desarrollo', label: 'Desarrollo' },
          { value: 'Arreglo', label: 'Arreglo' },
          { value: 'Documentación', label: 'Documentación' },
          { value: 'Refactorización', label: 'Refactorización' },
          { value: 'Investigación', label: 'Investigación' }
        ]
      },
      { 
        name: 'dificultad', 
        label: 'Dificultad', 
        type: 'select', 
        required: true, 
        md: 4, 
        options: [
          { value: 'Baja', label: 'Baja' },
          { value: 'Media', label: 'Media' },
          { value: 'Alta', label: 'Alta' }
        ]
      },
    ] : []),
    // -------------------------
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, md: 12 },
    { name: 'fechaLimite', label: 'Fecha Límite', type: 'date', required: true, md: 6 },
    { 
      name: 'idAlumno', 
      label: 'Asignar a Alumno', 
      type: 'select', 
      required: true, 
      md: 6,
      options: alumnos.map(a => ({ value: a.id, label: `${a.nombre} ${a.apellidos}` }))
    },
    // Solo mostramos el selector de estado si estamos editando
    ...(tareaSeleccionada ? [{
      name: 'estado',
      label: 'Estado de la Tarea',
      type: 'select',
      md: 12,
      options: [
        { value: 'ASIGNADA', label: 'Asignada' },
        { value: 'EN_PROGRESO', label: 'En Progreso' },
        { value: 'COMPLETADA', label: 'Completada' },
        { value: 'VALIDADA', label: 'Validada' },
        { value: 'CANCELADA', label: 'Cancelada' }
      ]
    }] : [])
  ];

  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  return (
    <Container fluid className="px-3 px-md-4 pb-5">
      {/* CABECERA: Adaptable con botón que ocupa el ancho total en móvil */}
      <Row className="mb-4 align-items-center g-3 pt-2">
        <Col xs={12} md={8} className="text-center text-md-start">
          <h2 className="fw-bold text-primary mb-0 fs-3 fs-md-2">Gestión de Tareas</h2>
          <p className="text-muted small mb-0">Administre y realice el seguimiento de las tareas.</p>
        </Col>
        <Col xs={12} md={4} className="text-center text-md-end">
          <Button 
            variant="primary" 
            className="w-100 w-md-auto shadow-sm"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i>Nueva Tarea
          </Button>
        </Col>
      </Row>

      {/* FILTROS: Optimizados para lectura vertical en móviles */}
      <Row className="mb-4 g-3 bg-light p-3 rounded border mx-0 shadow-sm">
        <Col xs={12} md={3}>
          <Form.Label className="small fw-bold text-secondary text-uppercase">Buscar</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Título..."
            value={filtroTexto} 
            onChange={(e) => setFiltroTexto(e.target.value)} 
          />
        </Col>
        <Col xs={12} md={5}>
          <Form.Label className="small fw-bold text-secondary text-uppercase">Alumno</Form.Label>
          <Form.Select value={filtroAlumno} onChange={(e) => setFiltroAlumno(e.target.value)}>
            <option value="TODOS">Todos los alumnos</option>
            {alumnos.map(alu => (
              <option key={alu.id} value={alu.id}>{alu.nombre} {alu.apellidos}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={4}>
          <Form.Label className="small fw-bold text-secondary text-uppercase">Estado</Form.Label>
          <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="ASIGNADA">Asignadas</option>
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="COMPLETADA">Completadas</option>
            <option value="VALIDADA">Validadas</option>
            <option value="CANCELADA">Canceladas</option>
            <option value="TODOS">Ver Histórico</option>
          </Form.Select>
        </Col>
      </Row>

      {/* TABLA DE RESULTADOS: Con scroll preventivo y texto protegido */}
      <Row>
        <Col xs={12}>
          {/* Aseguramos que el contenedor blanco no se rompa */}
          <div className="bg-white rounded shadow-sm border overflow-hidden">
            {loading ? (
              <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
            ) : (
              /* Al llamar a AppTable, ella sola ya gestiona su scroll */
              <AppTable 
                headers={columnas} 
                data={tareasFiltradas} 
                accessorKeys={llaves} 
                onEdit={abrirModalEdicion}
              />
            )}
          </div>
        </Col>
      </Row>

      {/* MODAL: Padding táctil para el formulario */}
      <AppModal 
        show={showModal} 
        handleClose={cerrarModal} 
        title={tareaSeleccionada ? "Gestionar Tarea" : "Crear Nueva Tarea"}
        size="lg"
      >
        <div className="px-1">
          <AppForm 
            fields={campos} 
            initialValues={tareaSeleccionada ? {
              ...tareaSeleccionada,
              idAlumno: tareaSeleccionada.alumno?.id
            } : {}}
            onSubmit={handleSubmitTarea}
            buttonLabel={tareaSeleccionada ? "Guardar Cambios" : "Asignar Tarea"}
          />
        </div>
      </AppModal>
    </Container>
  );
};

export default GestionTareasTutor;