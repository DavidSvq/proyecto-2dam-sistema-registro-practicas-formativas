import api from '../api/axiosConfig';

export const empresaService = {
    // Obtener empresas filtradas por el identificador del centro/grupo
    getEmpresasByCentro: async (idCentro) => {
        try {
            // La URL final será: http://localhost:8088/api/empresas/CIF001
            const response = await api.get(`empresas/centro/${idCentro}`);
            return response.data; 
        } catch (error) {
            console.error(`Error al obtener empresas para el centro ${idCentro}:`, error);
            throw error;
        }
    }
};