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
    <Modal show={show} onHide={handleClose} size={size} centered scrollable>
      <Modal.Header closeButton className="py-2 py-md-3">
        <Modal.Title className="fs-5 fs-md-4">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-2 p-md-3">
        {children}
      </Modal.Body>
      <Modal.Footer className="p-2 p-md-3">
        <Button variant="secondary" onClick={handleClose} className="w-100 w-md-auto" >
          {closeLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default AppModal;