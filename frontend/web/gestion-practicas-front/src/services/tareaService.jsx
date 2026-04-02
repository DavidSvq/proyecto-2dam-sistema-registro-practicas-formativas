import api from '../api/axiosConfig';

export const tareaService = {

    /**
     * 1. CREACIÓN: Tutor de Empresa crea y asigna la tarea.
     */
    crearTarea: async (tareaData) => {
        const response = await api.post('/tareas', tareaData);
        return response.data;
    },

    /**
     * 2. LISTADO GENERAL: Para la tabla de gestión del Tutor.
     */
    getTodasPorTutor: async (idTutor) => {
        const response = await api.get(`/tareas/tutor/${idTutor}`);
        return response.data;
    },

    /**
     * 3. LISTADO FILTRADO: Por tutor y estado (Dashboard/Contadores).
     */
    getTareasPorTutorYEstado: async (idTutor, estado) => {
        const response = await api.get(`/tareas/tutor/${idTutor}/estado/${estado}`);
        return response.data;
    },

    /**
     * 4. LISTADO ALUMNO: Todas las tareas de un alumno concreto.
     */
    getTareasPorAlumno: async (idAlumno) => {
        const response = await api.get(`/tareas/alumno/${idAlumno}`);
        return response.data;
    },

    /**
     * 5. GESTIÓN TUTOR EMPRESA: Modifica cualquier campo de la tarea (incluido el estado).
     * El tutor usa este PUT para cambios generales.
     */
    modificarTarea: async (idTarea, tareaData) => {
        const response = await api.put(`/tareas/${idTarea}`, tareaData);
        return response.data;
    },

    /**
     * 6. BORRADO: Elimina la tarea físicamente.
     */
    eliminarTarea: async (idTarea) => {
        const response = await api.delete(`/tareas/${idTarea}`);
        return response.data;
    },

    /**
     * 7. ACCIÓN ALUMNO: Cambia el estado y añade horas reales obligatoriamente.
     * Mapea con: actualizarEstadoAlumno(idTarea, nuevoEstado, horasReales)
     */
    completarTareaAlumno: async (idTarea, nuevoEstado, horasReales) => {
        const response = await api.patch(`/tareas/${idTarea}/alumno/estado`, null, {
            params: { 
                nuevoEstado: nuevoEstado,
                horasReales: horasReales 
            }
        });
        return response.data;
    },

    // Cambio de estado para el tutor
    actualizarEstadoTutor: async (id, nuevoEstado) => {
        try {
            // Usamos axios (o la librería que tengas) para el PATCH
            // La URL debe coincidir con el @PatchMapping("/{id}/estado-tutor")
            const response = await api.patch(`/tareas/${id}/estado-tutor`, null, {
            params: { nuevoEstado }
            });
            return response.data;
        } catch (error) {
            console.error("Error al actualizar estado (Tutor):", error);
            throw error;
        }
        },

    /**
     * 8. ACCIÓN PROFESOR TUTOR: Revisa la tarea (pasa a REVISADA).
     * Mapea con: revisarTarea(idTarea)
     */
    revisarTareaProfesor: async (idTarea) => {
        const response = await api.patch(`/tareas/${idTarea}/revisar`);
        return response.data;
    }
    
};