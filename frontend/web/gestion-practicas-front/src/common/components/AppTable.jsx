import { useState } from 'react';
import { Table } from 'react-bootstrap';
import TableActions from './TableActtions';
import { Pagination } from 'react-bootstrap'; 

const AppTable = ({ headers, data, accessorKeys, onView, onEdit, onDelete, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Determinamos si hay alguna acción para mostrar la columna
  const hasActions = onView || onEdit || onDelete;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <div className="table-container">
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
          {currentItems.length > 0 ? (
            currentItems.map((item, rowIndex) => (
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
      {/* Controles de Paginación con Inicio y Fin */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          {/* Ir a la primera página */}
          <Pagination.First 
            onClick={() => paginate(1)} 
            disabled={currentPage === 1} 
          />
          
          {/* Anterior */}
          <Pagination.Prev 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1} 
          />

          {/* Números de página */}
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item 
              key={i + 1} 
              active={i + 1 === currentPage}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}

          {/* Siguiente */}
          <Pagination.Next 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages} 
          />

          {/* Ir a la última página */}
          <Pagination.Last 
            onClick={() => paginate(totalPages)} 
            disabled={currentPage === totalPages} 
          />
        </Pagination>
      )}
    </div>
  );
};

export default AppTable;