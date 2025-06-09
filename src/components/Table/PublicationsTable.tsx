import React, {useEffect, useState} from 'react';
import type {SortParams, ITablePublication} from "../../types/types.ts";
import { Table } from "@chakra-ui/react"
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

type ColumnSort = {
    id: string
    desc: boolean
}

const PublicationsTable = () => {
    const [data, setData] = useState<ITablePublication[]>(
        []);
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [sorting, setSorting] = useState<ColumnSort[]>([]);
    const [search, setSearch] = useState<string>('');

    const rerender = React.useReducer(() => ({}), {})[1]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
        },
        enableSorting: true,
        onSortingChange: setSorting,
    })

    useEffect(() => {
        const queryString = getQueryString(page, perPage, sorting, search ?? undefined)
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
    }, [page, perPage, sorting, search])

    return (
        <div className="p-2">
            <Table.Root>
                <Table.Header>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Table.Row key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <Table.ColumnHeader key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </Table.ColumnHeader>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Header>
                <Table.Body>
                    {table.getRowModel().rows.map(row => (
                        <Table.Row key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <Table.Cell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
            <div className="h-4" />
            <button onClick={() => rerender()} className="border p-2">
                Rerender
            </button>
        </div>
    );
};

export default PublicationsTable;