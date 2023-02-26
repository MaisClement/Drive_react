import React from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useTable, useSortBy, useRowSelect } from 'react-table';
import { sizeFormat, timeConverter } from './function';
import { useCookies } from 'react-cookie';

const IndeterminateCheckbox = React.forwardRef(
	({ indeterminate, ...rest }, ref) => {
		const defaultRef = React.useRef();
		const resolvedRef = ref || defaultRef;

		React.useEffect(() => {
			resolvedRef.current.indeterminate = indeterminate;
		}, [resolvedRef, indeterminate]);

		return (
			<>
				<input type='checkbox' ref={resolvedRef} {...rest} />
			</>
		);
	}
);

function Files_table({ files, setSelectedRowIds, onClickFiles }) {
	const data = files;
	const [cookies] = useCookies(['show_ext']);
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
				Cell: ({ row }) => cookies['show_ext'] === 'true' && row.original.type !== 'directory'
					? String(`${row.original.name}.${row.original.type}`)
					: String(row.original.name)
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
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state: { selectedRowIds },
	} = useTable(
		{
			columns,
			data,
			autoResetSelectedRows: true,
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
			]);
		}
	);

	React.useEffect(() => setSelectedRowIds(selectedRowIds), [
		setSelectedRowIds,
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
					prepareRow(row);
					return (
						<tr className={row.isSelected ? 'selected' : null} {...row.getRowProps()}>
							{row.cells.map(cell => {

								return (
									<td
										onClick={cell.column.id === 'selection' ? () => { } : () => { onClickFiles(row); }}
										{...cell.getCellProps()}
									>
										{
											cell.render('Cell')
										}
									</td>
								);
							})}
						</tr>
					);

				})}
			</tbody>
		</table>
	);
}

export default Files_table;