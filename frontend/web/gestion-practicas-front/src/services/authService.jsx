import api from '../api/axiosConfig';

export const loginService = async (email, password, rol) => {
  const roleToEndpoint = {
    'ALUMNO': 'alumnos',
    'PROFESOR_GESTOR': 'profesores',
    'PROFESOR_TUTOR': 'profesores', 
    'TUTOR_EMPRESA': 'tutores-empresa'
  };

  const folder = roleToEndpoint[rol];

  try {
    // Enviamos el objeto con los nombres EXACTOS de tu Java: email, password, rol
    const response = await api.post(`/${folder}/login`, {
      email,
      password,
      rol
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Añade esto a tus servicios (puedes ponerlo debajo de loginService)
export const recuperarPasswordService = async (email, nuevaPassword, rol) => {
  const roleToEndpoint = {
    'ALUMNO': 'alumnos',
    'PROFESOR_GESTOR': 'profesores',
    'PROFESOR_TUTOR': 'profesores', 
    'TUTOR_EMPRESA': 'tutores-empresa'
  };

  const folder = roleToEndpoint[rol];

  try {
    // Coincide con @PutMapping("/recuperar-password") en Java
    const response = await api.put(`/${folder}/recuperar-password`, {
      email,
      nuevaPassword
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};