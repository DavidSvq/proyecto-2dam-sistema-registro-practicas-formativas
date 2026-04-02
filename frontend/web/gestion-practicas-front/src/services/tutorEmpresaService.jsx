import api from '../api/axiosConfig';

export const tutorEmpresaService = {
    // --- CONSULTAS ---
    getTutorPerfil: async (id) => {
        try {
            const response = await api.get(`tutores-empresa/perfil/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener perfil del tutor ${id}:`, error);
            throw error;
        }
    },

    getTutoresByEmpresa: async (cif) => {
        try {
            const response = await api.get(`tutores-empresa/empresa/${cif}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener tutores de la empresa ${cif}:`, error);
            throw error;
        }
    },

    getMisAlumnos: async (tutorId) => {
        try {
            const response = await api.get(`tutores-empresa/alumnos/${tutorId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener alumnos del tutor ${tutorId}:`, error);
            throw error;
        }
    },

    // --- ACCIONES DE GESTIÓN (NUEVAS) ---
    
    registrarTutor: async (tutorData, cifEmpresa) => {
        try {
            // Construimos el objeto completo para que el Backend no reciba nulos
            const nuevoTutor = {
                ...tutorData,
                password: '1234',        // Valor por defecto igual que en Profesores
                rol: 'TUTOR_EMPRESA',    // El rol correspondiente al Enum de Java
                numAlumnos: 0            // Valor inicial
                // Nota: No incluimos el objeto empresa aquí porque ya viaja en la URL como cifEmpresa
            };

            // Endpoint: POST /api/tutores-empresa/empresa/{cifEmpresa}
            const response = await api.post(`tutores-empresa/empresa/${cifEmpresa}`, nuevoTutor);
            return response.data;
        } catch (error) {
            console.error("Error al registrar tutor:", error);
            throw error;
        }
    },

    actualizarTutor: async (idTutor, datosNuevos) => {
        try {
            // Endpoint: PUT /api/tutores-empresa/{idTutor}
            const response = await api.put(`tutores-empresa/${idTutor}`, datosNuevos);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar tutor ${idTutor}:`, error);
            throw error;
        }
    },

    eliminarTutor: async (idTutor) => {
        try {
            // Endpoint: DELETE /api/tutores-empresa/{idTutor}
            const response = await api.delete(`tutores-empresa/${idTutor}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar tutor ${idTutor}:`, error);
            throw error;
        }
    }
};