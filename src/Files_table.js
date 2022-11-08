import React from 'react';
import ReactDOM from 'react-dom';
import { useTable } from 'react-table';

function timeConverter(timestamp){
  var a = new Date(timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear() < 10 ? '0' + a.getFullYear() : a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
  var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
  return time;
}

function sizeFormat(bytes){ 
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;
  const tb = gb * 1024;

  if (bytes == null){
    return '';

  } else if ((bytes >= 0) && (bytes < kb)) {
      return `${bytes} o`;
  
  } else if ((bytes >= kb) && (bytes < mb)) {
      return `${Math.round(bytes / kb)} Ko`;
  
  } else if ((bytes >= mb) && (bytes < gb)) {
      return `${Math.round(bytes / mb)} Mo`;

  } else if ((bytes >= gb) && (bytes < tb)) {
      return `${Math.round(bytes / gb)} Go`;

  } else if (bytes >= tb) {
      return `${Math.round(bytes / tb)} To`;

  } else {
      return `${bytes} o`;
  }
}

function Files_table(props) {
  const data = props.files;

  const columns = React.useMemo(
    () => [
      {
        Header: '',
        accessor: 'img',
        Cell: ({ value }) => <img src={value} />
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Dernière modification',
        accessor: 'time',
        Cell: ({ value }) => timeConverter(value)
      },
      {
        Header: 'Poids',
        accessor: 'size',
        Cell: ({ value }) => sizeFormat(value)
      }
    ],
    []
  )

  const tableInstance = useTable({ columns, data })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }) 

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Files_table;