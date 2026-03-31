import { Table, Button } from 'react-bootstrap';

const AppTable = ({ headers, data, accessorKeys, actions }) => {
  return (
    <Table striped bordered hover responsive className="shadow-sm mt-3 bg-white">
      <thead className="table-dark">
        <tr>
          {headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
          {actions && <th className="text-center">Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {/* Usamos accessorKeys para sacar el dato exacto del objeto */}
              {accessorKeys.map((key, cellIndex) => (
                <td key={cellIndex}>{item[key] || '-'}</td>
              ))}

              {/* Columna de botones (si existen) */}
              {actions && (
                <td className="text-center">
                  {actions.map((action, actIndex) => (
                    <Button
                      key={actIndex}
                      variant={action.variant || 'primary'}
                      size="sm"
                      className="me-2"
                      onClick={() => action.handler(item)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length + (actions ? 1 : 0)} className="text-center">
              No hay datos disponibles
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default AppTable;