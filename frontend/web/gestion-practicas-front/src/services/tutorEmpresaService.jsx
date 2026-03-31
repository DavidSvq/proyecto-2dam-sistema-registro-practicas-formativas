import api from '../api/axiosConfig';

export const tutorEmpresaService = {
    // Obtener tutores de una empresa concreta
    getTutoresByEmpresa: async (cif) => {
        try {
            const response = await api.get(`tutores-empresa/empresa/${cif}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener tutores de la empresa ${cif}:`, error);
            throw error;
        }
    }
};