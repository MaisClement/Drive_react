import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useTable, useSortBy, useRowSelect } from 'react-table'
import { Link, useNavigate } from "react-router-dom";

function timeConverter(timestamp) {
  var a = new Date(timestamp * 1000);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear() < 10 ? '0' + a.getFullYear() : a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
  var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
  return time;
}

function sizeFormat(bytes) {
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;
  const tb = gb * 1024;

  if (bytes == null) {
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

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

function Files_table({ files, path, onRowSelectStateChange, onClickFile }) {
  const data = files;

  const [current, setCurrent] = useState();

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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  )

  React.useEffect(() => onRowSelectStateChange?.(selectedRowIds), [
    onRowSelectStateChange,
    selectedRowIds
  ]);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? <IoMdArrowDropdown />
                      : <IoMdArrowDropup />
                    : null}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)

          return (
            <tr className={row.isSelected ? 'selected' : null} onClick={() => { onClickFile(row); }} {...row.getRowProps()}>
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