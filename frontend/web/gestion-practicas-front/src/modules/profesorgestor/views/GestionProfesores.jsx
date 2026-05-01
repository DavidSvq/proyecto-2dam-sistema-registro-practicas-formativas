import React, { useEffect, useState } from 'react';
import { profesorService } from '../../../services/profesorService';
import { centroService } from '../../../services/centroService';
import AppTable from '../../../common/components/AppTable';
import AppModal from '../../../common/components/AppModal';
import AppForm from '../../../common/components/AppForm';
import { Spinner, Button, Row, Col, Form, InputGroup} from 'react-bootstrap';
import Swal from 'sweetalert2';

const GestionProfesores = () => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [modoLectura, setModoLectura] = useState(false);

  // Estado para el término de búsqueda
  const [filtro, setFiltro] = useState('');

  // 1. Configuración de la tabla (Vista resumida)
  const headers = ['ID', 'Nombre', 'Apellidos', 'Alumnos'];
  const accessorKeys = ['id', 'nombre', 'apellidos', 'numAlumnos'];

  // 2. Definición dinámica del Formulario
  const camposFormulario = [
    // Fila 1: Código Docente + Nº Alumnos
    { 
        name: 'id', 
        label: 'Código Docente', 
        type: 'text', 
        md: 6, 
        disabled: !!selectedProfesor || modoLectura, 
        required: true 
    },
    { 
        name: 'numAlumnos', 
        label: 'Nº Alumnos', 
        type: 'number', 
        md: 6, 
        disabled: true 
    },
    // Fila 2: Nombre + Apellidos
    { 
        name: 'nombre', 
        label: 'Nombre', 
        type: 'text', 
        md: 6, 
        disabled: modoLectura, 
        required: true 
    },
    { 
        name: 'apellidos', 
        label: 'Apellidos', 
        type: 'text', 
        md: 6, 
        disabled: modoLectura, 
        required: true 
    },
    // Fila 3: Email (Ancho completo)
    { 
        name: 'email', 
        label: 'Email Institucional', 
        type: 'email', 
        md: 12, 
        disabled: modoLectura, 
        required: true 
    },
    // Fila 4: Centro Docente (Ancho completo)
    { 
        name: 'nombreCentro', 
        label: 'Centro Docente', 
        type: 'text', 
        md: 12, 
        disabled: true 
    },
  ];

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const centro = await centroService.getPrincipal();
      const data = await profesorService.getProfesoresByCentro(centro.codCentro);
      setProfesores(data);
    } catch (error) {
      console.error("Error al cargar la lista de profesores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Lógica de filtrado dinámico
  const profesoresFiltrados = profesores.filter(p => 
    p.id.toLowerCase().includes(filtro.toLowerCase()) ||
    p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    p.apellidos.toLowerCase().includes(filtro.toLowerCase())
  );

  // 3. Handlers para el Modal
  const abrirCrear = () => {
    setSelectedProfesor(null);
    setModoLectura(false);
    setShowModal(true);
  };

  const abrirEditar = (profesor) => {
    setSelectedProfesor(profesor);
    setModoLectura(false);
    setShowModal(true);
  };

  const abrirVerDetalle = (profesor) => {
    setSelectedProfesor(profesor);
    setModoLectura(true);
    setShowModal(true);
  };

  const manejarGuardar = async (formData) => {
    // Si estamos en modo lectura, el botón simplemente cierra el modal
    if (modoLectura) {
      setShowModal(false);
      return;
    }

    try {
      const centro = await centroService.getPrincipal();
      if (selectedProfesor) {
        await profesorService.updateProfesor(selectedProfesor.id, formData, centro.codCentro);
      } else {
        await profesorService.createProfesor(formData, centro.codCentro);
      }
      setShowModal(false);
      cargarDatos();
    } catch (error) {
      Swal.fire({
        title: "Error de Validación",
        text: "Error al procesar el docente. Verifica que el ID o Email no existan ya.",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const manejarBaja = async (id) => {
    if (window.confirm(`¿Seguro que deseas dar de baja al docente ${id}?`)) {
      try {
        await profesorService.deleteProfesor(id);
        cargarDatos();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se puede eliminar el profesor (puede tener alumnos asignados).",
          icon: "error",
          confirmButtonColor: "#dc3545"
        });
      }
    }
  };


  return (
    <>
      {/* CABECERA: Título y Botón adaptables */}
      <Row className="mb-4 align-items-center g-3 pt-2">
        <Col xs={12} md={8} className="text-center text-md-start">
          <h2 className="fw-bold text-primary mb-0 fs-3 fs-md-2">Gestión de Profesores</h2>
          <p className="text-muted small mb-0">Administración de personal docente del centro.</p>
        </Col>
        <Col xs={12} md={4} className="text-center text-md-end">
          <Button 
            variant="primary" 
            className="w-100 w-md-auto shadow-sm" 
            onClick={abrirCrear}
          >
            <i className="bi bi-person-plus me-2"></i>Nuevo Profesor
          </Button>
        </Col>
      </Row>

      {/* BUSCADOR: Estilo limpio y táctil */}
      <Row className="mb-4 mx-0 bg-light p-3 rounded border shadow-sm">
        <Col xs={12}>
          <Form.Label className="small fw-bold text-secondary">Buscar por nombre o ID</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <i className="bi bi-search text-primary"></i>
            </InputGroup.Text>
            <Form.Control 
              className="border-start-0"
              placeholder="Nombre, apellidos o código..." 
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* TABLA DE RESULTADOS: Sin Spinner para evitar errores de importación */}
      <div className="bg-white rounded shadow-sm border overflow-hidden">
        <AppTable 
          headers={headers} 
          data={profesoresFiltrados} 
          accessorKeys={accessorKeys}
          onView={abrirVerDetalle} 
          onEdit={abrirEditar}     
          onDelete={manejarBaja}    
        />
      </div>

      {/* MODAL: Ajustado para evitar desbordamientos en móvil */}
      <AppModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={modoLectura ? "Detalles del Docente" : (selectedProfesor ? "Editar Docente" : "Registrar Nuevo Docente")}
        size="lg"
      >
        <div className="px-1">
          <AppForm 
            fields={camposFormulario.map(f => ({ 
              ...f, 
              disabled: modoLectura || f.disabled 
            }))}
            initialValues={selectedProfesor ? {
              ...selectedProfesor,
              nombreCentro: selectedProfesor.centro?.nombre || 'No asignado'
            } : { id: '', nombre: '', apellidos: '', email: '', numAlumnos: 0, nombreCentro: '' }}
            onSubmit={manejarGuardar}
            buttonLabel={modoLectura ? null : "Guardar Cambios"}
          />
        </div>
      </AppModal>
    </>
  );
};

export default GestionProfesores;