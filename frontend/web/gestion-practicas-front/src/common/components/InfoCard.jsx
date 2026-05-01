import { Card } from 'react-bootstrap';

/**
 * InfoCard: Tarjeta versátil para mostrar cualquier dato relevante.
 * @param {string} titulo - Etiqueta superior (ej: "Sede Actual", "Horas Totales")
 * @param {string|number} contenido - El dato principal a mostrar.
 * @param {string} variante - Color de la barra lateral (primary, success, warning, danger, info, dark)
 * @param {string} icono - Clase de FontAwesome o Bootstrap Icons (opcional)
 */
const InfoCard = ({ titulo, contenido, variante = "primary", icono }) => {
  return (
    <Card className={`shadow-sm border-0 border-start border-4 border-${variante} h-100`}>
      <Card.Body className="d-flex align-items-center justify-content-between p-2 p-md-3">
        <div className="flex-grow-1 min-width-0">
          <p className="text-muted mb-1 text-uppercase fw-bold small fs-7" style={{ fontSize: '0.75rem' }}>
            {titulo}
          </p>
          <h4 className="mb-0 fw-bold fs-5 fs-md-4 text-truncate">{contenido}</h4>
        </div>
        {icono && (
          <div className={`text-${variante} opacity-25 ms-2 d-none d-sm-block`}>
            <i className={`${icono} fs-2 fs-md-1`}></i>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default InfoCard;