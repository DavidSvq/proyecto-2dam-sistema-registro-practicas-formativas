import api from '../api/axiosConfig';

export const alumnoService = {
    // Obtener todos los alumnos de un centro
    getAlumnosByCentro: async (idCentro) => {
        try {
            const response = await api.get(`alumnos/centro/${idCentro}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener alumnos del centro ${idCentro}:`, error);
            throw error;
        }
    }
};