import api from '../api/axiosConfig';

export const empresaService = {
    // Obtener empresas filtradas por el identificador del centro/grupo
    getEmpresas: async () => {
        try {
            // La URL final será: http://localhost:8088/api/empresas/CIF001
            const response = await api.get(`empresas`);
            return response.data; 
        } catch (error) {
            console.error(`Error al obtener empresas para el centro ${idCentro}:`, error);
            throw error;
        }
    },
    getEmpresaByCif: async (cif) => {
        const response = await api.get(`empresas/${cif}`);
        return response.data;
    },
    createEmpresa: async (empresa) => {
        const response = await api.post('empresas', empresa);
        return response.data;
    },
    updateEmpresa: async (cif, empresa) => {
        const response = await api.put(`empresas/${cif}`, empresa);
        return response.data;
    },
    deleteEmpresa: async (cif) => {
        await api.delete(`empresas/${cif}`);
    }
};