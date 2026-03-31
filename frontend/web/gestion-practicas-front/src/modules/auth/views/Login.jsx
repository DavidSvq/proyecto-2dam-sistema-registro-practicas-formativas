import { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { loginService } from '../service/authService';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rol: '' 
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!credentials.rol) {
      setError("Por favor, seleccione un perfil de usuario.");
      return;
    }

    try {
      const data = await loginService(credentials.email, credentials.password, credentials.rol);
      
      // Guardamos en persistencia y notificamos a App.jsx
      localStorage.setItem('user', JSON.stringify(data));
      onLogin(data); 

      // Redirección inmediata por rol
      const rutas = {
        'PROFESOR_GESTOR': '/dashboard',
        'TUTOR_EMPRESA': '/tutor-dashboard',
        'ALUMNO': '/alumno-dashboard',
        'PROFESOR_TUTOR': '/profesor-tutor-dashboard'
      };

      navigate(rutas[data.rol] || '/');

    } catch (err) {
      setError("Error de autenticación. Verifique sus credenciales y el perfil seleccionado.");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0"> {/* Añadido border-0 para un look más limpio */}
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 fw-bold">Acceso al Sistema</h2>
              
              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">Perfil</Form.Label>
                  <Form.Select 
                    name="rol" 
                    onChange={handleChange} 
                    value={credentials.rol}
                    required
                  >
                    <option value="" disabled>Seleccione su perfil...</option>
                    <option value="ALUMNO">Alumno</option>
                    <option value="PROFESOR_GESTOR">Profesor Gestor</option>
                    <option value="PROFESOR_TUTOR">Profesor Tutor</option>
                    <option value="TUTOR_EMPRESA">Tutor Empresa</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">Usuario / Email</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="email" 
                    placeholder="ejemplo@correo.com" 
                    value={credentials.email}
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold small">Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    placeholder="********"
                    value={credentials.password}
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold shadow-sm">
                  ENTRAR
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;