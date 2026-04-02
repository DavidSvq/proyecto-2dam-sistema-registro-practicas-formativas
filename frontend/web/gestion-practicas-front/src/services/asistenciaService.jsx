import api from '../api/axiosConfig';

export const asistenciaService = {
    // 1. Marcar Entrada (POST)
    registrarEntrada: async (idAlumno, hora = null) => {
        const url = hora 
            ? `/asistencias/entrada/${idAlumno}?hora=${hora}` 
            : `/asistencias/entrada/${idAlumno}`;
        const response = await api.post(url);
        return response.data;
    },

    // 2. Marcar Salida (PATCH)
    registrarSalida: async (idAlumno, observaciones, hora = null) => {
        const url = hora 
            ? `/asistencias/salida/${idAlumno}?hora=${hora}` 
            : `/asistencias/salida/${idAlumno}`;
        // Enviamos observaciones en el body como un String simple según tu Controller
        const response = await api.patch(url, observaciones, {
            headers: { 'Content-Type': 'text/plain' }
        });
        return response.data;
    },

    // 3. Consultar por fecha (GET con Query Params)
    buscarPorFecha: async (idAlumno, fecha) => {
        const response = await api.get(`/asistencias/buscar`, {
            params: { idAlumno, fecha }
        });
        return response.data;
    },

    // 4. Historial completo (GET)
    getHistorial: async (idAlumno) => {
        const response = await api.get(`/asistencias/historial/${idAlumno}`);
        return response.data;
    }
};