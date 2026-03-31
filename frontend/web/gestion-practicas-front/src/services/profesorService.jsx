import api from '../api/axiosConfig';

export const profesorService = {
    /**
     * Obtiene la lista completa de profesores asociados a un centro.
     * Endpoint: GET /api/profesores/centro/{idCentro}
     */
    getProfesoresByCentro: async (idCentro) => {
        try {
            const response = await api.get(`profesores/centro/${idCentro}`);
            
            // Log para verificar en la consola que llegan los 8 profesores
            console.log(`Paso 2: Datos recibidos para el centro ${idCentro}:`, response.data);
            
            return response.data; 
        } catch (error) {
            console.error(`Error en profesorService (getProfesoresByCentro):`, error);
            throw error;
        }
    }
};