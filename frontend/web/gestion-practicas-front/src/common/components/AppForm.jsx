import { Form, Button, Row, Col } from 'react-bootstrap';
import { useState } from 'react';

/**
 * AppForm: Generador dinámico de formularios
 * @param {Array} fields - Configuración: [{ name: 'nombre', label: 'Nombre', type: 'text', placeholder: '...' }]
 * @param {Object} initialValues - Valores por defecto (ej: para editar) { nombre: 'Juan' }
 * @param {Function} onSubmit - Función que recibe los datos finales
 * @param {string} buttonLabel - Texto del botón de envío
 */
const AppForm = ({ fields, initialValues = {}, onSubmit, buttonLabel = 'Guardar' }) => {
  const [formData, setFormData] = useState(initialValues);

  // Manejador universal de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Enviamos el "DTO" construido al padre
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 bg-white rounded shadow-sm">
      <Row>
        {fields.map((field, index) => (
          <Col md={field.md || 12} key={index} className="mb-3">
            <Form.Group controlId={`form-${field.name}`}>
              <Form.Label className="fw-bold">{field.label}</Form.Label>
              
              {field.type === 'select' ? (
                <Form.Select 
                  name={field.name} 
                  value={formData[field.name] || ''} 
                  onChange={handleChange}
                  required={field.required}
                >
                  <option value="">Seleccione...</option>
                  {field.options.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  type={field.type || 'text'}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  as={field.type === 'textarea' ? 'textarea' : 'input'}
                  rows={field.type === 'textarea' ? 3 : 1}
                />
              )}
            </Form.Group>
          </Col>
        ))}
      </Row>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
        <Button variant="primary" type="submit" size="lg">
          {buttonLabel}
        </Button>
      </div>
    </Form>
  );
};

export default AppForm;