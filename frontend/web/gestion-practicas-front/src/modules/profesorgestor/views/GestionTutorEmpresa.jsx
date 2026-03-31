import { useState, useEffect } from 'react';
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { tutorEmpresaService } from '../../../services/tutorEmpresaService';
import AppTable from "../../../common/components/AppTable";
import InfoCard from "../../../common/components/InfoCard";

const GestionTutoresEmpresa = () => {
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configuración de la tabla
  const columnas = ['ID', 'Nombre Completo', 'Email', 'Empresa', 'Alumnos a Cargo'];
  const llaves = ['id', 'nombreCompleto', 'email', 'empresaNombre', 'numAlumnos'];

  useEffect(() => {
    const cargarTutores = async () => {
      try {
        setLoading(true);
        // Probamos con el CIF del JSON que me has pasado
        const data = await tutorEmpresaService.getTutoresByEmpresa("CIF001");

        const procesados = data.map(t => ({
          ...t,
          nombreCompleto: `${t.nombre} ${t.apellidos}`,
          empresaNombre: t.empresa ? t.empresa.razonSocial : 'N/A'
        }));

        setTutores(procesados);
      } catch (error) {
        console.error("Error cargando tutores de empresa:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarTutores();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Tutores de Empresa</h2>
          <p className="text-muted">Personal de contacto y supervisión en los centros de trabajo.</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InfoCard 
            titulo="Total Tutores (Empresa Seleccionada)" 
            contenido={loading ? '...' : tutores.length} 
            variante="info" 
            icono="bi bi-person-badge"
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="info" />
              </div>
            ) : (
              <AppTable 
                headers={columnas} 
                data={tutores} 
                accessorKeys={llaves} 
                actions={[
                  { label: 'Contacto', variant: 'outline-primary', handler: (t) => console.log("Email a:", t.email) }
                ]}
              />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GestionTutoresEmpresa;