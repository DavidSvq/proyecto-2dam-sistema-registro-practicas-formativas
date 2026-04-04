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
    },

    // 2. Crear un nuevo alumno
    // alumnoData debe contener: { id, nombre, apellidos, email, rol: "ALUMNO", centro: { codCentro }, ... }
    createAlumno: async (alumnoData) => {
        try {
            const response = await api.post('alumnos', alumnoData);
            return response.data;
        } catch (error) {
            console.error("Error al crear el alumno:", error);
            throw error;
        }
    },

    // 3. Actualizar un alumno existente
    // El ID se pasa en la URL y el objeto completo en el body
    updateAlumno: async (id, alumnoData) => {
        try {
            const response = await api.put(`alumnos/${id}`, alumnoData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar el alumno ${id}:`, error);
            throw error;
        }
    },

    // 4. Eliminar un alumno (o desactivar, según decidamos)
    deleteAlumno: async (id) => {
        try {
            const response = await api.delete(`alumnos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar el alumno ${id}:`, error);
            throw error;
        }
    },

    // 5. Obtener el perfil de un alumno por su ID
    getAlumnoById: async (id) => {
        try {
            const response = await api.get(`alumnos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener el perfil del alumno ${id}:`, error);
            throw error;
        }
    },

    // 6. LISTAR POR TUTOR DOCENTE
    getAlumnosByProfesor: async (id) => {
        const response = await api.get(`/alumnos/tutor/${id}`);
        return response.data;
    }

};