import { Table } from 'react-bootstrap';
import TableActions from './TableActtions'; // Mantengo tu falta de ortografía por si el archivo se llama así

const AppTable = ({ headers, data, accessorKeys, onView, onEdit, onDelete }) => {
  // Determinamos si hay alguna acción para mostrar la columna
  const hasActions = onView || onEdit || onDelete;

  return (
    <Table striped bordered hover responsive className="shadow-sm mt-3 bg-white">
      <thead className="table-dark">
        <tr>
          {headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
          {hasActions && <th className="text-center">Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {/* Celdas de datos */}
              {accessorKeys.map((key, cellIndex) => (
                <td key={cellIndex}>{item[key] || '-'}</td>
              ))}

              {/* Columna de acciones usando el componente TableActions */}
              {hasActions && (
                <td className="text-center">
                  <TableActions 
                    item={item}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length + (hasActions ? 1 : 0)} className="text-center">
              No hay datos disponibles
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default AppTable;