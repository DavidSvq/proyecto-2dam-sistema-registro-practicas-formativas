import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { centroService } from '../../../services/centroService';
import { alumnoService } from '../../../services/alumnoService';
import { profesorService } from '../../../services/profesorService';
import InfoCard from '../../../common/components/InfoCard';
import AppModal from '../../../common/components/AppModal';
import AppForm from '../../../common/components/AppForm';

const GestionCentro = () => {
  const [centro, setCentro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [stats, setStats] = useState({ alumnos: 0, profesores: 0 });

  // 1. Campos del formulario: Se ven todos, pero solo editamos los de contacto
  const fields = [
    { name: 'nombre', label: 'Nombre Institucional', type: 'text', md: 12, disabled: true },
    { name: 'direccion', label: 'Dirección', type: 'text', md: 12, disabled: true },
    { name: 'codCentro', label: 'Código Centro', type: 'text', md: 4, disabled: true },
    { name: 'localidad', label: 'Localidad', type: 'text', md: 4, disabled: true },
    { name: 'telefono', label: 'Teléfono de Contacto', type: 'text', md: 4 },
    { name: 'correoInstitucional', label: 'Correo Oficial', type: 'email', md: 12 }
  ];

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const dataCentro = await centroService.getPrincipal();
      setCentro(dataCentro);

      if (dataCentro?.codCentro) {
        const [alumnos, profesores] = await Promise.all([
          alumnoService.getAlumnosByCentro(dataCentro.codCentro),
          profesorService.getProfesoresByCentro(dataCentro.codCentro)
        ]);
        setStats({
          alumnos: alumnos.length,
          profesores: profesores.length
        });
      }
    } catch (error) {
      console.error("Error al cargar datos del centro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardar = async (formData) => {
    try {
      // Verificamos que codCentro existe antes de enviar
      if (!centro?.codCentro) {
          alert("Error: No se encuentra el código del centro.");
          return;
      }

      const payload = { 
        ...centro, 
        ...formData 
      };

      await centroService.update(payload); // Ahora enviará api.put('centros/CEN01', payload)
      setShowModal(false);
      setEditData(null);
      await cargarDatos(); 
    } catch (error) {
      alert("Error al actualizar: Revisa la consola.");
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Configuración del Centro</h2>
          <p className="text-muted">Gestión de datos institucionales y contacto.</p>
        </div>
        <Button 
          variant="outline-primary" 
          onClick={() => {
            setEditData(centro); 
            setShowModal(true);
          }}
        >
          <i className="bi bi-pencil-square me-2"></i>Editar Información
        </Button>
      </div>

      {centro && (
        <>
          <Row className="g-4">
            <Col md={12}>
              <InfoCard titulo="Nombre Institucional" contenido={centro.nombre} variante="dark" icono="bi bi-building" />
            </Col>

            <Col md={12}>
              <InfoCard titulo="Dirección" contenido={centro.direccion || 'No especificada'} variante="secondary" icono="bi bi-geo" />
            </Col>

            <Col md={4}>
              <InfoCard titulo="Código Centro" contenido={centro.codCentro} variante="primary" icono="bi bi-hash" />
            </Col>
            <Col md={4}>
              <InfoCard titulo="Localidad" contenido={centro.localidad} variante="info" icono="bi bi-geo-alt" />
            </Col>
            <Col md={4}>
              <InfoCard titulo="Teléfono" contenido={centro.telefono || 'No asignado'} variante="success" icono="bi bi-telephone" />
            </Col>

            <Col md={12}>
              <InfoCard titulo="Correo Electrónico Oficial" contenido={centro.correoInstitucional} variante="warning" icono="bi bi-envelope-at" />
            </Col>

            <Col md={6}>
              <InfoCard titulo="Total Alumnos" contenido={stats.alumnos.toString()} variante="secondary" icono="bi bi-people" />
            </Col>
            <Col md={6}>
              <InfoCard titulo="Total Profesores" contenido={stats.profesores.toString()} variante="secondary" icono="bi bi-person-badge" />
            </Col>
          </Row>

          <AppModal 
            show={showModal} 
            handleClose={() => {
              setShowModal(false);
              setEditData(null);
            }} 
            title="Editar Datos de Contacto"
            size="lg"
          >
            {showModal && editData && (
              <AppForm 
                key={editData.codCentro} 
                fields={fields} 
                initialValues={editData} 
                onSubmit={handleGuardar} 
                onCancel={() => {
                  setShowModal(false);
                  setEditData(null);
                }} 
                buttonLabel="Guardar Cambios"
              />
            )}
          </AppModal>
        </>
      )}
    </div>
  );
};

export default GestionCentro;