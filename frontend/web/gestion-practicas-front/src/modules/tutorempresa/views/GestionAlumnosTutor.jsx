import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";
import { tutorEmpresaService } from "../../../services/tutorEmpresaService";

const GestionAlumnosTutor = ({ user }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Configuración de la Tabla (Headers y AccessorKeys)
  const columnas = ['Nombre Completo', 'Email', 'Centro Educativo', 'Profesor Tutor', 'Horas Acumuladas'];
  const llaves = ['nombreCompleto', 'email', 'centroNombre', 'profesorNombre', 'horasTotales'];

  useEffect(() => {
    const fetchAlumnos = async () => {
      // 1. Verificamos que el user.id llegue (ahora ya debería llegar desde App.jsx)
      if (!user?.id) return;

      try {
        setLoading(true);
        // 2. Llamada al service con tu ruta exacta: tutores-empresa/alumnos/TUT001
        const data = await tutorEmpresaService.getMisAlumnos(user.id);
        
        // 3. FLATTENING: Adaptamos el JSON complejo a las llaves de tu AppTable
        const alumnosAplanados = data.map(alumno => ({
          ...alumno,
          nombreCompleto: `${alumno.nombre} ${alumno.apellidos}`,
          centroNombre: alumno.centro?.nombre || "No disponible",
          profesorNombre: alumno.profesor 
            ? `${alumno.profesor.nombre} ${alumno.profesor.apellidos}` 
            : "Sin asignar",
          // Mapeamos horasTotales que es el dato real del JSON
          horasTotales: alumno.horasTotales || 0 
        }));

        setAlumnos(alumnosAplanados);
      } catch (err) {
        setError("Error al cargar la lista de alumnos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumnos();
  }, [user?.id]);


  if (loading) return (
    <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
  );

  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Mis Alumnos en Prácticas</h2>
          <p className="text-muted">Listado de alumnos asignados a su tutoría en esta empresa.</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            {/* 3. Uso de AppTable con tus props exactas */}
            <AppTable 
              headers={columnas} 
              data={alumnos} 
              accessorKeys={llaves} 
              actions={[
                { 
                  label: 'Ver Ficha', 
                  variant: 'outline-primary', 
                  handler: (alumno) => console.log("Consultando ficha de:", alumno) 
                }
              ]}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default GestionAlumnosTutor;