import { Row, Col } from "react-bootstrap";
import AppTable from "../../../common/components/AppTable";
import InfoCard from "../../../common/components/InfoCard";

const AsistenciaAlumno = () => {
  // 1. Datos de ejemplo: Historial de asistencia del alumno
  const historialAsistencia = [
    { id: 1, fecha: '2026-03-10', tipo: 'Falta', estado: 'Justificada', observacion: 'Cita Médica' },
    { id: 2, fecha: '2026-03-15', tipo: 'Retraso', estado: 'Sin Justificar', observacion: 'Problemas transporte' },
    { id: 3, fecha: '2026-03-22', tipo: 'Falta', estado: 'Pendiente', observacion: 'Indisposición' },
  ];

  // 2. Configuración de la Tabla
  const columnas = ['Fecha', 'Tipo de Incidencia', 'Estado', 'Observaciones'];
  const llaves = ['fecha', 'tipo', 'estado', 'observacion'];

  return (
    <>
      {/* CABECERA */}
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Diario de Asistencia</h2>
          <p className="text-muted">Consulta tu registro de faltas y retrasos durante el periodo de FCT.</p>
        </Col>
      </Row>

      {/* RESUMEN RÁPIDO DE FALTAS */}
      <Row className="mb-4">
        <Col md={6}>
          <InfoCard titulo="Faltas Justificadas" contenido="1" variante="success" />
        </Col>
        <Col md={6}>
          <InfoCard titulo="Pendientes de Justificar" contenido="2" variante="danger" />
        </Col>
      </Row>

      {/* TABLA DE REGISTROS */}
      <Row>
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <h5 className="mb-3">Historial de Incidencias</h5>
            <AppTable 
              headers={columnas} 
              data={historialAsistencia} 
              accessorKeys={llaves} 
              actions={[
                { 
                  label: 'Subir Justificante', 
                  variant: 'outline-secondary', 
                  handler: (item) => console.log("Abriendo modal para subir archivo de la fecha:", item.fecha) 
                }
              ]}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default AsistenciaAlumno;