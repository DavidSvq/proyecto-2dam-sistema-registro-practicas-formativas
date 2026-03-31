import React, { useEffect, useState } from 'react';
import { empresaService } from '../../../services/empresaService';
import AppTable from '../../../common/components/AppTable';

const GestionEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 2. Definimos por separado lo que pide tu componente */
  const headers = ['CIF', 'Nombre Empresa', 'Localidad', 'Persona de Contacto', 'Teléfono', 'Email'];
  const accessorKeys = ['cif', 'razonSocial', 'localidad', 'personaContacto', 'telefonoContacto', 'emailContacto'];

  const acciones = [
    { 
      label: 'Editar', 
      variant: 'warning', 
      handler: (row) => console.log("Editando empresa:", row.cif) 
    },
    { 
      label: 'Eliminar', 
      variant: 'danger', 
      handler: (row) => console.log("Borrando empresa:", row.cif) 
    }
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Usamos el ID de centro que ya sabemos que funciona
        const data = await empresaService.getEmpresasByCentro("CEN01");
        setEmpresas(data);
      } catch (error) {
        console.error("Error al cargar la tabla:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Gestión de Empresas</h2>
          <p className="text-muted">Listado de empresas colaboradoras del centro.</p>
        </div>
        <button className="btn btn-primary">Nueva Empresa</button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Cargando empresas...</p>
        </div>
      ) : (
        /* LLAMADA CORREGIDA A TU APPTABLE */
        <AppTable 
          headers={headers} 
          data={empresas} 
          accessorKeys={accessorKeys}
          actions={acciones}
        />
      )}
    </div>
  );
};

export default GestionEmpresas;