import React from "react";
import {ITablePublication} from "../../types/types.ts";
import {createColumnHelper} from "@tanstack/react-table";

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