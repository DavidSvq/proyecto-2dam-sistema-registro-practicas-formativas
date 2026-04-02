import { Form, Button, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const AppForm = ({ fields, initialValues = {}, onSubmit, buttonLabel = 'Guardar' }) => {
  const [formData, setFormData] = useState(initialValues);

  // Sincroniza el estado cuando cambian los valores iniciales (al pulsar la lupa)
  useEffect(() => {
    setFormData(initialValues || {});
  }, [initialValues?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const fieldConfig = fields.find(f => f.name === name);
    if (fieldConfig?.onChange) {
        fieldConfig.onChange(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Si no hay campos, no renderizamos nada para evitar errores
  if (!fields || !Array.isArray(fields)) return null;

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
                  disabled={field.disabled}
                >
                  <option value="">Seleccione...</option>
                  {/* Validación de seguridad para las opciones */}
                  {Array.isArray(field.options) && field.options.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  type={field.type || 'text'}
                  name={field.name}
                  placeholder={field.placeholder || ''}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  disabled={field.disabled}
                  as={field.type === 'textarea' ? 'textarea' : 'input'}
                  rows={field.type === 'textarea' ? 3 : 1}
                />
              )}
            </Form.Group>
          </Col>
        ))}
      </Row>
      {buttonLabel && (
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
          <Button variant="primary" type="submit" size="lg">
            {buttonLabel}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default AppForm;