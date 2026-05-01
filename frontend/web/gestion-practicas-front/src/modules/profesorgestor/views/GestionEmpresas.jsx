import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Spinner, Badge } from "react-bootstrap";
import { empresaService } from '../../../services/empresaService';
import { centroService } from '../../../services/centroService';
import AppTable from "../../../common/components/AppTable";
import AppModal from "../../../common/components/AppModal";
import AppForm from "../../../common/components/AppForm";
import Swal from 'sweetalert2';

const GestionEmpresas = ({ user }) => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState('');

  const columnas = ['CIF', 'Razón Social', 'Persona de Contacto', 'Teléfono'];
  const llaves = ['cif', 'razonSocial', 'personaContacto', 'telefonoContacto'];

  const camposEmpresa = [
    // FILA 1: CIF (4) + RAZÓN SOCIAL (8) = 12
    { 
        name: 'cif', 
        label: 'CIF', 
        type: 'text', 
        md: 4, 
        disabled: !!selectedEmpresa, 
        required: true 
    },
    { 
        name: 'razonSocial', 
        label: 'Razón Social', 
        type: 'text', 
        md: 8, 
        required: true 
    },

    // FILA 2: PERSONA DE CONTACTO (6) + LOCALIDAD (6) = 12
    { name: 'personaContacto', label: 'Persona de Contacto', type: 'text', md: 6 },
    { name: 'localidad', label: 'Localidad', type: 'text', md: 6 },

    // FILA 3: TELÉFONO (4) + DIRECCIÓN (8) = 12
    { name: 'telefonoContacto', label: 'Teléfono', type: 'text', md: 4 },
    { name: 'direccion', label: 'Dirección', type: 'text', md: 8 },

    // FILA 4: EMAIL DE CONTACTO (Fila completa)
    { name: 'emailContacto', label: 'Email de Contacto', type: 'email', md: 12 },
  ];

  const empresasFiltradas = empresas.filter(emp => 
    emp.razonSocial.toLowerCase().includes(filtroTexto.toLowerCase()) || 
    emp.cif.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  const cargarEmpresas = async () => {
    try {
      setLoading(true);
      const data = await empresaService.getEmpresas();
      setEmpresas(data);
    } catch (err) {
      console.error("Error al cargar empresas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarEmpresas(); }, []);

  const abrirModalEditar = (empresa, readOnly = false) => {
    setIsReadOnly(readOnly);
    setSelectedEmpresa(empresa);
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setIsReadOnly(false);
    setSelectedEmpresa(null);
    setShowModal(true);
  };

  const manejarGuardar = async (formData) => {
    try {
      if (selectedEmpresa) {
        await empresaService.updateEmpresa(selectedEmpresa.cif, formData);
      } else {
        await empresaService.createEmpresa(formData);
      }
      setShowModal(false);
      cargarEmpresas();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error al procesar la solicitud. Revisa si el CIF ya existe.",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const manejarEliminar = async (empresa) => {
    const { cif } = empresa;
    if (window.confirm(`¿Estás seguro de que deseas eliminar la empresa con CIF: ${cif}?`)) {
      try {
        await empresaService.deleteEmpresa(cif);
        Swal.fire({
          title: "¡Eliminado!",
          text: "Empresa eliminada correctamente.",
          icon: "success",
          confirmButtonColor: "#0d6efd",
          timer: 2000
        });
        cargarEmpresas();
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: "NO SE PUEDE ELIMINAR:\n\n" +
            "Esta empresa tiene alumnos, tutores o convenios asociados.",
          icon: "error",
          confirmButtonColor: "#dc3545"
        });
      }
    }
  };

  return (
    <Container fluid className="px-2 px-md-4 pb-5">
      {/* CABECERA ADAPTADA */}
      <Row className="mb-4 align-items-center g-3 pt-3">
        <Col xs={12} md={8} className="text-center text-md-start">
          <h2 className="fw-bold text-primary mb-0 fs-3 fs-md-2">Gestión de Empresas</h2>
          <p className="text-muted small mb-0">Centro: {user?.profesorInfo?.centroNombre}</p>
        </Col>
        <Col xs={12} md={4} className="text-center text-md-end">
          <Button 
            variant="primary" 
            className="w-100 w-md-auto shadow-sm" 
            onClick={abrirModalCrear}
          >
            <i className="bi bi-plus-circle me-2"></i>Nueva Empresa
          </Button>
        </Col>
      </Row>

      {/* BUSCADOR ADAPTADO */}
      <Row className="mb-4 mx-0 bg-light p-3 rounded border shadow-sm">
        <Col xs={12}>
          <Form.Label className="small fw-bold text-secondary">Buscar Empresa (Nombre o CIF)</Form.Label>
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <i className="bi bi-search text-primary"></i>
            </InputGroup.Text>
            <Form.Control 
              className="border-start-0"
              placeholder="Ej: Inditex o B12345678..." 
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* TABLA CON SCROLL AUTOMÁTICO */}
      <div className="bg-white rounded shadow-sm border overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted small">Cargando empresas...</p>
          </div>
        ) : (
          <AppTable 
            headers={columnas} 
            data={empresasFiltradas} 
            accessorKeys={llaves} 
            onView={(emp) => abrirModalEditar(emp, true)}
            onEdit={(emp) => abrirModalEditar(emp, false)}
            onDelete={manejarEliminar}
          />
        )}
      </div>

      {/* MODAL DE EDICIÓN/CREACIÓN */}
      <AppModal 
        show={showModal} 
        handleClose={() => {
          setShowModal(false);
          setSelectedEmpresa(null);
        }} 
        title={isReadOnly ? "Detalle de Empresa" : (selectedEmpresa ? "Editar Empresa" : "Nueva Empresa")}
        size="lg"
        closeLabel={isReadOnly ? "Volver" : "Cancelar"}
      >
        <div className="px-1">
          <AppForm 
            fields={camposEmpresa.map(f => ({ 
              ...f, 
              disabled: isReadOnly || f.disabled 
            }))} 
            initialValues={selectedEmpresa || { 
              cif: '', 
              razonSocial: '', 
              direccion: '', 
              localidad: '', 
              telefonoContacto: '', 
              emailContacto: '', 
              personaContacto: '' 
            }} 
            onSubmit={manejarGuardar} 
            buttonLabel={isReadOnly ? null : "Guardar Empresa"} 
          />
        </div>
      </AppModal>
    </Container>
  );
};

export default GestionEmpresas;