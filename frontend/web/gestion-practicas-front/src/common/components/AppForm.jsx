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
    <Form onSubmit={handleSubmit} className="p-2 p-md-3 bg-white rounded shadow-sm">
      <Row className="g-2 g-md-3"> {/* g-2 reduce el espacio entre campos en móvil */}
        {fields.map((field, index) => (
          /* 
             Cambiamos md={field.md} por xs={12} md={field.md || 12}. 
             Esto obliga a que en móvil cada campo ocupe su propia línea 
          */
          <Col xs={12} md={field.md || 12} key={index} className="mb-2 mb-md-3">
            <Form.Group controlId={`form-${field.name}`}>
              <Form.Label className="fw-bold small">{field.label}</Form.Label>
              
              {field.type === 'select' ? (
                <Form.Select 
                  name={field.name} 
                  value={formData[field.name] || ''} 
                  onChange={handleChange}
                  required={field.required}
                  disabled={field.disabled}
                  className="form-control-sm form-control-md" /* Ajuste sutil de tamaño */
                >
                  <option value="">Seleccione...</option>
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
                  /* En móvil los inputs de texto/fecha a veces se ven mejor algo más compactos */
                  size="md" 
                />
              )}
            </Form.Group>
          </Col>
        ))}
      </Row>

      {buttonLabel && (
        /* 
           d-grid hace que el botón ocupe todo el ancho en móvil (mucho más usable).
           d-md-flex lo devuelve a su tamaño normal alineado a la derecha en PC.
        */
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
          <Button 
            variant="primary" 
            type="submit" 
            size="lg" 
            className="px-5" /* Un poco más de aire lateral en el botón */
          >
            {buttonLabel}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default AppForm;