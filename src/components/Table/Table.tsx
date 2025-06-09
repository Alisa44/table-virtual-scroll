import React, {useEffect, useState} from 'react';
import type {RawPublication, SortParams, TablePublication} from "../../types/types.ts";
import {getQueryString, mapDataForTable} from "../../utils/utils.ts";

const Table = () => {
    const [data, setData] = useState<TablePublication[]>(
        []);
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [sort, setSort] = useState<SortParams|null>(null);
    const [search, setSearch] = useState<string>('');

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
        <div>

        </div>
    );
};

export default Table;