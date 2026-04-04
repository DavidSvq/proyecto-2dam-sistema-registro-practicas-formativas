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
      <Card.Body className="d-flex align-items-center justify-content-between">
        <div>
          <p className="text-muted mb-1 text-uppercase fw-bold small">{titulo}</p>
          <h4 className="mb-0 fw-bold">{contenido}</h4>
        </div>
        {icono && (
          <div className={`text-${variante} opacity-25`}>
            <i className={`${icono} fs-1`}></i>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default InfoCard;