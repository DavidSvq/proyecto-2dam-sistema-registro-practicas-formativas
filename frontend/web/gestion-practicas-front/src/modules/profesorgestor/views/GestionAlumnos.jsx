import { useState, useEffect } from 'react';
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { alumnoService } from '../../../services/alumnoService';
import AppTable from "../../../common/components/AppTable";
import AppModal from "../../../common/components/AppModal";
import AppForm from "../../../common/components/AppForm";
import InfoCard from "../../../common/components/InfoCard";

const GestionAlumnos = () => {
  // 1. ESTADOS PRINCIPALES
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // 2. CONFIGURACIÓN DE LA TABLA
  // Definimos los encabezados y las llaves que crearemos en el procesado (Paso 4)
  const columnas = ['ID', 'Nombre Completo', 'Email', 'Horas', 'Empresa', 'Tutor Docente'];
  const llaves = ['id', 'nombreCompleto', 'email', 'horasTotales', 'empresaNombre', 'tutorNombre'];

  // 3. CONFIGURACIÓN DEL FORMULARIO DE ALTA
  const camposAlumno = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, md: 6 },
    { name: 'apellidos', label: 'Apellidos', type: 'text', required: true, md: 6 },
    { name: 'email', label: 'Correo Electrónico', type: 'email', required: true, md: 12 }
  ];

  // 4. CARGA Y "APLANADO" DE DATOS (Efecto de montaje)
  useEffect(() => {
    const cargarAlumnos = async () => {
      try {
        setLoading(true);
        const data = await alumnoService.getAlumnosByCentro("CEN01");

        // Transformamos el JSON complejo en uno plano para que AppTable lo pinte fácil
        const procesados = data.map(alu => ({
          ...alu,
          nombreCompleto: `${alu.nombre} ${alu.apellidos}`,
          horasTotales: `${alu.horasTotales}h`,
          // Extraemos datos de los objetos anidados del JSON
          empresaNombre: alu.empresa ? alu.empresa.razonSocial : 'Sin asignar',
          tutorNombre: alu.profesor ? `${alu.profesor.nombre} ${alu.profesor.apellidos}` : 'Sin tutor'
        }));

        setAlumnos(procesados);
      } catch (error) {
        console.error("Error al conectar con la API de Alumnos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarAlumnos();
  }, []);

  // 5. MANEJADORES
  const manejarGuardar = (datos) => {
    console.log("Datos listos para enviar al POST de Java:", datos);
    setShowModal(false);
  };

  return (
    <>
      {/* CABECERA DINÁMICA */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold text-dark">Gestión de Alumnos</h2>
          <p className="text-muted">Panel de control de FCT y seguimiento de prácticas.</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" size="lg" onClick={() => setShowModal(true)} className="shadow-sm">
            <i className="bi bi-person-plus me-2"></i>Matricular Alumno
          </Button>
        </Col>
      </Row>

      {/* RESUMEN ESTADÍSTICO (Basado en datos reales) */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <InfoCard 
            titulo="Total Alumnos" 
            contenido={loading ? '...' : alumnos.length} 
            variante="primary" 
            icono="bi bi-people"
          />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard 
            titulo="Asignados a Empresa" 
            contenido={loading ? '...' : alumnos.filter(a => a.empresaNombre !== 'Sin asignar').length} 
            variante="success" 
            icono="bi bi-building-check"
          />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard 
            titulo="Pendientes de Asignar" 
            contenido={loading ? '...' : alumnos.filter(a => a.empresaNombre === 'Sin asignar').length} 
            variante="danger" 
            icono="bi bi-person-exclamation"
          />
        </Col>
      </Row>

      {/* SECCIÓN DE TABLA */}
      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <h5 className="mb-4 fw-bold">Listado de Expedientes</h5>
            
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Recuperando datos de la base de datos...</p>
              </div>
            ) : (
              <AppTable 
                headers={columnas} 
                data={alumnos} 
                accessorKeys={llaves} 
                actions={[
                  { 
                    label: 'Expediente', 
                    variant: 'outline-primary', 
                    handler: (a) => console.log("Abriendo alumno:", a.id) 
                  }
                ]}
              />
            )}
          </div>
        </Col>
      </Row>

      {/* MODAL DE ALTA */}
      <AppModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        title="Nueva Matriculación"
      >
        <AppForm 
          fields={camposAlumno} 
          onSubmit={manejarGuardar} 
          buttonLabel="Registrar Alumno" 
        />
      </AppModal>
    </>
  );
};

export default GestionAlumnos;