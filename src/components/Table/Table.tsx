import React, {useEffect, useState} from 'react';
import type {SortParams, ITablePublication} from "../../types/types.ts";
import {getQueryString, mapDataForTable} from "../../utils/utils.ts";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
// import {columns} from './utils.tsx';

export const columnHelper = createColumnHelper<ITablePublication>()

export const columns = [
    columnHelper.accessor('title', {
        cell: info => info.getValue(),
        header: "Titulo",
        id: 'titulo',
        enableSorting: true,
    }),
    columnHelper.accessor('publicationYear', {
        cell:info => info.getValue(),
        header: () => <span>Año</span>,
        id: 'publicationYear',
        enableSorting: true,
    }),
    columnHelper.accessor('citedByCount', {
        cell:info => info.getValue(),
        header: () => <span>Citaciones</span>,
        id: 'citedByCount',
        enableSorting: true,
    }),
    columnHelper.accessor('authors', {
        cell:info => info.getValue(),
        header: () => <span>Autores</span>,
        id: 'authors',
        enableSorting: true,
    }),
]

const Table = () => {
    const [data, setData] = useState<ITablePublication[]>(
        []);
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [sort, setSort] = useState<SortParams|null>(null);
    const [search, setSearch] = useState<string>('');

    const rerender = React.useReducer(() => ({}), {})[1]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    useEffect(() => {
        const queryString = getQueryString(page, perPage, sort ?? undefined, search ?? undefined)
        fetch(queryString)
            .then(res => res.json())
            .then(response => {
                const mapedData = mapDataForTable(response.results);
                const dataWithAuthors = mapedData.map(publication => ({
                    ...publication,
                    authors: publication.authors.slice(0, 2).map(({display_name}) => display_name).join(', ')
                }))
                setData(dataWithAuthors)
            })
    }, [page, perPage, sort, search])

    return (
        <div className="p-2">
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
                <tfoot>
                {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </tfoot>
            </table>
            <div className="h-4" />
            <button onClick={() => rerender()} className="border p-2">
                Rerender
            </button>
        </div>
    );
};

export default Table;