import api from '../api/axiosConfig';

export const centroService = {
    // Obtener los datos del centro principal
    getPrincipal: async () => {
        try {
            const response = await api.get('centros/principal');
            return response.data; // Retorna el objeto único del centro
        } catch (error) {
            console.error("Error al obtener los datos del centro:", error);
            throw error;
        }
    },

    // Para el futuro Paso de "Modificar"
    update: async (data) => {
        try {
            const response = await api.put('centros', data);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar el centro:", error);
            throw error;
        }
    }
};