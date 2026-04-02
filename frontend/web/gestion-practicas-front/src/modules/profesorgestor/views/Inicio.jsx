import { useEffect, useState } from "react";
import { Row, Col, Spinner, Card, ListGroup } from "react-bootstrap";
import InfoCard from "../../../common/components/InfoCard";
import { alumnoService } from "../../../services/alumnoService";
import { profesorService } from "../../../services/profesorService";
import { empresaService } from "../../../services/empresaService";
import { centroService } from "../../../services/centroService"; // Importamos tu service de centros

const Inicio = ({ user }) => {
  const [stats, setStats] = useState({ alumnos: 0, empresas: 0, profesores: 0 });
  const [centro, setCentro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        // 1. Obtenemos el centro principal (tu función real)
        const centroPrincipal = await centroService.getPrincipal();
        setCentro(centroPrincipal);

        // 2. Extraemos el campo real: codCentro ("CEN01")
        const idParaFiltrar = centroPrincipal.codCentro; 

        if (idParaFiltrar) {
          // 3. Lanzamos las peticiones usando ese código exacto
          const [dataAlumnos, dataProfesores, dataEmpresas] = await Promise.all([
            alumnoService.getAlumnosByCentro(idParaFiltrar),
            profesorService.getProfesoresByCentro(idParaFiltrar),
            empresaService.getEmpresas()
          ]);

          // 4. Actualizamos el estado con los .length reales
          setStats({
            alumnos: dataAlumnos.length,
            profesores: dataProfesores.length,
            empresas: dataEmpresas.length
          });
        }
      } catch (error) {
        console.error("Error cargando estadísticas con codCentro:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDashboard();
  }, []); // Se ejecuta al montar el componente

  if (loading) return <div className="p-5 text-center"><Spinner animation="border" /></div>;

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold">Panel de Control: Gestor</h2>
        <p className="text-muted">
          Bienvenido, <strong>{user?.nombre}</strong>. 
          Gestionando: <strong>{user?.profesorInfo?.centroNombre}</strong>
        </p>
      </div>

      {/* 1. Fila de InfoCards (KPIs) */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <InfoCard titulo="Alumnos" contenido={stats.alumnos.toString()} variante="primary" />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard titulo="Empresas" contenido={stats.empresas.toString()} variante="success" />
        </Col>
        <Col md={4} className="mb-3">
          <InfoCard titulo="Profesores" contenido={stats.profesores.toString()} variante="info" />
        </Col>
      </Row>

      {/* 2. Cuadro de Bienvenida */}
      <Row className="mb-5">
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border text-center">
            <h4 className="fw-bold">Bienvenido al Sistema de Gestión de FCT</h4>
            <p className="text-muted mb-0">
              Selecciona una opción del menú lateral para comenzar una gestión.
            </p>
          </div>
        </Col>
      </Row>

      {/* 3. Información del Centro (Ficha detallada) */}
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white fw-bold py-3">
              <i className="bi bi-building me-2"></i> Información del Centro Docente
            </Card.Header>
            <ListGroup variant="flush">
              <Row className="g-0">
                <Col md={6} className="border-end">
                  <ListGroup.Item><strong>Código:</strong> {centro?.codCentro}</ListGroup.Item>
                  <ListGroup.Item><strong>Nombre Oficial:</strong> {centro?.nombre}</ListGroup.Item>
                  <ListGroup.Item><strong>Dirección:</strong> {centro?.direccion}</ListGroup.Item>
                </Col>
                <Col md={6}>
                  <ListGroup.Item><strong>Localidad:</strong> {centro?.localidad}</ListGroup.Item>
                  <ListGroup.Item><strong>Teléfono:</strong> {centro?.telefono}</ListGroup.Item>
                  <ListGroup.Item><strong>Correo Institucional:</strong> {centro?.correoInstitucional}</ListGroup.Item>
                </Col>
              </Row>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Inicio;