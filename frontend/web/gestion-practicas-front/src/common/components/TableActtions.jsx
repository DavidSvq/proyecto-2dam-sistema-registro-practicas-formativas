import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

const TableActions = ({ item, onView, onEdit, onDelete, viewLabel="Ver", editLabel="Editar", deleteLabel="Baja" }) => {
  
  // Función interna para no repetir código del botón
  const BotonAccion = ({ onClick, icon, variant, label }) => (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{label}</Tooltip>}
    >
      <Button
        variant={variant}
        size="sm"
        className="me-1 d-inline-flex align-items-center justify-content-center"
        style={{ width: '32px', height: '32px' }}
        onClick={() => onClick(item)}
      >
        <i className={`bi ${icon}`} style={{ fontSize: '1.1rem' }}></i>
      </Button>
    </OverlayTrigger>
  );

  return (
    <div className="d-flex justify-content-center">
      {onView && (
        <BotonAccion onClick={onView} icon="bi-eye" variant="outline-info" label={viewLabel} />
      )}
      {onEdit && (
        <BotonAccion onClick={onEdit} icon="bi-pencil" variant="outline-warning" label={editLabel} />
      )}
      {onDelete && (
        <BotonAccion onClick={onDelete} icon="bi-trash" variant="outline-danger" label={deleteLabel} />
      )}
    </div>
  );
};

export default TableActions;