import api from '../api/axiosConfig';

export const profesorService = {
    getProfesoresByCentro: async (idCentro) => {
        const response = await api.get(`profesores/centro/${idCentro}`);
        return response.data; 
    },
    
    getProfesorById: async (id) => {
        const response = await api.get(`profesores/${id}`);
        return response.data;
    },

    createProfesor: async (profesorData, codCentro) => {
        const nuevoProfesor = {
            ...profesorData,
            password: '1234',
            rol: 'PROFESOR_TUTOR',
            numAlumnos: 0,
            // AJUSTE CRÍTICO: Debe ser 'codCentro' para que el CentroDocenteDTO lo mapee
            centro: { 
                codCentro: codCentro 
            }
        };
        const response = await api.post('profesores', nuevoProfesor);
        return response.data;
    },

    updateProfesor: async (id, profesorData, codCentro) => {
        const profesorActualizado = {
            ...profesorData,
            password: '1234',
            rol: 'PROFESOR_TUTOR',
            centro: { 
                codCentro: codCentro 
            }
        };
        const response = await api.put(`profesores/${id}`, profesorActualizado);
        return response.data;
    },

    deleteProfesor: async (id) => {
        await api.delete(`profesores/${id}`);
    }
};