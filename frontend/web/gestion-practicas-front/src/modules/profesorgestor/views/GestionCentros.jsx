import React, { useEffect, useState } from 'react';
import { centroService } from '../../../services/centroService';
import InfoCard from '../../../common/components/InfoCard';
import { Row, Col, Button } from 'react-bootstrap';

const GestionCentro = () => {
  const [centro, setCentro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCentro = async () => {
      try {
        setLoading(true);
        const data = await centroService.getPrincipal();
        setCentro(data);
      } catch (error) {
        console.error("Error cargando centro:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarCentro();
  }, []);

  if (loading) return <div className="p-4 text-center">Cargando configuración...</div>;

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Configuración del Centro</h2>
          <p className="text-muted">Datos institucionales registrados en el sistema.</p>
        </div>
        {centro && (
          <Button variant="outline-primary" onClick={() => console.log("Editar centro")}>
            <i className="bi bi-pencil-square me-2"></i>Editar Información
          </Button>
        )}
      </div>

      {centro ? (
        <Row className="g-4">
          {/* Card Principal: Nombre */}
          <Col md={12}>
            <InfoCard 
              titulo="Nombre Institucional" 
              contenido={centro.nombre} 
              variante="dark" 
              icono="bi bi-building" 
            />
          </Col>

          {/* Cards de detalles */}
          <Col md={4}>
            <InfoCard 
              titulo="Código Centro" 
              contenido={centro.codCentro} 
              variante="primary" 
              icono="bi bi-hash" 
            />
          </Col>
          <Col md={4}>
            <InfoCard 
              titulo="Localidad" 
              contenido={centro.localidad} 
              variante="info" 
              icono="bi bi-geo-alt" 
            />
          </Col>
          <Col md={4}>
            <InfoCard 
              titulo="Teléfono" 
              contenido={centro.telefono || 'No asignado'} 
              variante="success" 
              icono="bi bi-telephone" 
            />
          </Col>
          <Col md={12}>
            <InfoCard 
              titulo="Correo Electrónico Oficial" 
              contenido={centro.correoInstitucional} 
              variante="warning" 
              icono="bi bi-envelope-at" 
            />
          </Col>
        </Row>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">No hay datos del centro.</p>
          <Button variant="primary">Configurar Centro Ahora</Button>
        </div>
      )}
    </div>
  );
};

export default GestionCentro;