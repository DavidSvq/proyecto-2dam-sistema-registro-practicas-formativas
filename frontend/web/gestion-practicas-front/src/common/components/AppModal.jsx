import { Modal, Button } from 'react-bootstrap';

/**
 * AppModal: Contenedor genérico para diálogos y formularios.
 * @param {boolean} show - Estado que controla si se ve o no.
 * @param {function} handleClose - Función para cerrar el modal.
 * @param {string} title - Título de la ventana.
 * @param {ReactElement} children - El contenido que metamos dentro (ej: un AppForm).
 */
const AppModal = ({ show, handleClose, title, children, size = "md", closeLabel = "Cancelar" }) => {
  return (
    <Modal show={show} onHide={handleClose} size={size} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {closeLabel} {/* <--- Aquí usamos la nueva prop */}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default AppModal;