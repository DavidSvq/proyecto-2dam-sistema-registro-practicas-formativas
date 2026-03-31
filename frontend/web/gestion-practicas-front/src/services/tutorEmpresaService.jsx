import api from '../api/axiosConfig';

export const tutorEmpresaService = {
    // Método para obtener el perfil del tutor que inicia sesión
    getTutorPerfil: async (id) => {
        try {
            const response = await api.get(`tutores-empresa/perfil/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener perfil del tutor ${id}:`, error);
            throw error;
        }
    },

    // Obtener tutores de una empresa concreta
    getTutoresByEmpresa: async (cif) => {
        try {
            const response = await api.get(`tutores-empresa/empresa/${cif}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener tutores de la empresa ${cif}:`, error);
            throw error;
        }
    },

    // Obrtener el listado de tareas de un alumno asignado al tutor de empresa
    getTareasAlumno: async (alumnoId) => {
        try {
            // Ruta exacta confirmada: tareas/alumno/{id}
            const response = await api.get(`tareas/alumno/${alumnoId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener tareas del alumno ${alumnoId}:`, error);
            throw error;
        }
    },

    // Obtener el listado de alumnos del tutor de empresa
    getMisAlumnos: async (tutorId) => {
        try {
            const response = await api.get(`tutores-empresa/alumnos/${tutorId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener alumnos del tutor ${tutorId}:`, error);
            throw error;
        }
    }
};