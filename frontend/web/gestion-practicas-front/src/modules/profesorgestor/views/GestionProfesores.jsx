import React, { useEffect, useState } from 'react';
import { profesorService } from '../../../services/profesorService';
import AppTable from '../../../common/components/AppTable';
import { Spinner, Button } from 'react-bootstrap';

const GestionProfesores = () => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Configuración de la tabla (Basada en tu JSON)
  const headers = ['ID Docente', 'Nombre', 'Apellidos', 'Email Institucional', 'Rol Sistema'];
  const accessorKeys = ['id', 'nombre', 'apellidos', 'email', 'rol'];

  // 2. Definición de acciones (Botones)
  const acciones = [
    { 
      label: 'Editar', 
      variant: 'warning', 
      handler: (row) => console.log("Editando al profesor ID:", row.id) 
    },
    { 
      label: 'Baja', 
      variant: 'danger', 
      handler: (row) => console.log("Dando de baja al profesor:", row.id) 
    }
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Usamos el ID del centro que ya validamos
        const data = await profesorService.getProfesoresByCentro("CEN01");
        setProfesores(data);
      } catch (error) {
        console.error("Error al cargar la lista de profesores:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="container-fluid mt-4">
      {/* Cabecera de la sección */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Gestión de Profesores</h2>
          <p className="text-muted">Panel de administración de personal docente del centro.</p>
        </div>
        <Button variant="primary" className="shadow-sm">
          <i className="bi bi-person-plus me-2"></i>Nuevo Profesor
        </Button>
      </div>

      {/* Cuerpo de la vista: Spinner o Tabla */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-secondary">Sincronizando con el centro...</p>
        </div>
      ) : (
        <AppTable 
          headers={headers} 
          data={profesores} 
          accessorKeys={accessorKeys}
          actions={acciones}
        />
      )}
    </div>
  );
};

export default GestionProfesores;