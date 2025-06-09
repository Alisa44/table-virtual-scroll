import React, {useCallback, useEffect, useState} from 'react';
import type {ColumnSort, ITablePublication, PublicationApiResponse} from "../../types/types.ts";
import {Table} from "@chakra-ui/react"
import {getQueryString, mapDataForTable} from "../../utils/utils.ts";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable,} from '@tanstack/react-table'
import {useVirtualizer} from "@tanstack/react-virtual";
import {keepPreviousData, useInfiniteQuery,} from '@tanstack/react-query'

const fetchSize = 50

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

const PublicationsTable = () => {
    const [tableData, setTableData] = useState<ITablePublication[]>(
        []);
    const [sorting, setSorting] = useState<ColumnSort[]>([]);
    const [totalDBRowCount, setTotalDBRowCount] = useState<number>(0);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
        },
        enableSorting: true,
        onSortingChange: setSorting,
    })

    const { rows } = table.getRowModel()
    const parentRef = React.useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 34,
        overscan: 20,
    })

    const fetchData = useCallback((page = 1, perPage = 10, sorting?: ColumnSort[], search?: string): any => {
        const queryString = getQueryString(page, perPage, sorting, search ?? undefined)
        fetch(queryString)
            .then(res => res.json())
            .then(response => {
                const mapedData = mapDataForTable(response.results);
                const dataWithAuthors = mapedData.map(publication => ({
                    ...publication,
                    authors: publication.authors.slice(0, 2).map(({display_name}) => display_name).join(', ')
                }))
                setTotalDBRowCount(response.meta.count);
                setTableData(dataWithAuthors)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const { data, fetchNextPage, isFetching, isLoading } =
        useInfiniteQuery<PublicationApiResponse>({
            queryKey: [
                'people',
                sorting, //refetch when sorting changes
            ],
            queryFn: async ({ pageParam = 1 }) => {
                const start = (pageParam as number) * fetchSize
                return await fetchData(start, fetchSize, sorting)
            },
            initialPageParam: 1,
            getNextPageParam: (_lastGroup, groups) => groups.meta?.count,
            refetchOnWindowFocus: false,
            placeholderData: keepPreviousData,
        })

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } = containerRefElement
                //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
                if (
                    scrollHeight - scrollTop - clientHeight < 500 &&
                    !isFetching &&
                    tableData.length < totalDBRowCount
                ) {
                    fetchNextPage()
                }
            }
        },
        [fetchNextPage, isFetching, data, totalDBRowCount])

    useEffect(() => {
        fetchMoreOnBottomReached(parentRef.current)
    }, [fetchMoreOnBottomReached])

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
        getScrollElement: () => parentRef.current,
        //measure dynamic row height, except in firefox because it measures table border height incorrectly
        measureElement:
            typeof window !== 'undefined' &&
            navigator.userAgent.indexOf('Firefox') === -1
                ? element => element?.getBoundingClientRect().height
                : undefined,
        overscan: 5,
    })

    return (
        <div
            ref={parentRef}
            className="p-2"
            style={{
                overflow: 'auto', //our scrollable table container
                position: 'relative', //needed for sticky header
                height: '600px', //should be a fixed height
            }}
             onScroll={e => fetchMoreOnBottomReached(e.currentTarget)}
        >
            {isLoading ? <h1>Loading...</h1>
                : <>
                    <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
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
                            <Table.Body
                                style={{
                                    display: 'grid',
                                    height: `${rowVirtualizer.getTotalSize()}px`,
                                    position: 'relative',
                                }}>
                                {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                                    const row = rows[virtualRow.index]
                                    return (
                                        <Table.Row
                                            key={row.id}
                                            style={{
                                                height: `${virtualRow.size}px`,
                                                transform: `translateY(${
                                                    virtualRow.start - index * virtualRow.size
                                                }px)`,
                                            }}
                                        >
                                            {row.getVisibleCells().map((cell) => {
                                                return (
                                                    <Table.Cell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </Table.Cell>
                                                )
                                            })}
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table.Root>
                    </div>
                </>
            }
        </div>
    );
};

export default PublicationsTable;