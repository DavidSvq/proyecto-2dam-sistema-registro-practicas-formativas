import React, { useEffect, useState } from 'react';
import { profesorService } from '../../../services/profesorService';
import { centroService } from '../../../services/centroService';
import AppTable from '../../../common/components/AppTable';
import AppModal from '../../../common/components/AppModal';
import AppForm from '../../../common/components/AppForm';
import { Spinner, Button, Row, Col, Form, InputGroup} from 'react-bootstrap';

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
      alert("Error al procesar el docente. Verifica que el ID o Email no existan ya.");
    }
  };

  const manejarBaja = async (id) => {
    if (window.confirm(`¿Seguro que deseas dar de baja al docente ${id}?`)) {
      try {
        await profesorService.deleteProfesor(id);
        cargarDatos();
      } catch (error) {
        alert("No se puede eliminar el profesor (puede tener alumnos asignados).");
      }
    }
  };


  return (
    <div className="container-fluid mt-4">
      {/* FILA 1: TÍTULO Y BOTÓN DE ACCIÓN */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold text-dark">Gestión de Profesores</h2>
          <p className="text-muted">Administración de personal docente del centro.</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" className="shadow-sm" onClick={abrirCrear}>
            <i className="bi bi-person-plus me-2"></i>Nuevo Profesor
          </Button>
        </Col>
      </Row>

      {/* FILA 2: BARRA DE BÚSQUEDA (Siguiendo el estilo de Alumnos) */}
      <Row className="mb-3 g-3 bg-light p-3 rounded border mx-0 align-items-end">
        <Col md={12}>
          <Form.Label className="small fw-bold text-secondary">Buscar por nombre o ID</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-white">
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control 
              placeholder="Buscar docente por nombre, apellidos o código..." 
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* TABLA DE RESULTADOS */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-secondary">Sincronizando con el centro...</p>
        </div>
      ) : (
        <div className="bg-white p-3 rounded shadow-sm border">
          <AppTable 
            headers={headers} 
            data={profesoresFiltrados} 
            accessorKeys={accessorKeys}
            onView={abrirVerDetalle} // Pasas la función directamente
            onEdit={abrirEditar}      // Pasas la función directamente
            onDelete={manejarBaja}    // Pasas la función directamente
          />
        </div>
      )}

      {/* MODAL (Se mantiene igual) */}
      <AppModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={modoLectura ? "Detalles del Docente" : (selectedProfesor ? "Editar Docente" : "Registrar Nuevo Docente")}
      >
        <AppForm 
          fields={camposFormulario}
          initialValues={selectedProfesor ? {
            ...selectedProfesor,
            nombreCentro: selectedProfesor.centro?.nombre || 'No asignado'
          } : { id: '', nombre: '', apellidos: '', email: '', numAlumnos: 0, nombreCentro: '' }}
          onSubmit={manejarGuardar}
          buttonLabel={modoLectura ? "Volver" : "Guardar Cambios"}
        />
      </AppModal>
    </div>
  );
};

export default GestionProfesores;