import React, {useEffect, useState} from 'react';
import type {Publication} from "../../types/types.ts";
import {URL} from '../../constants/constants.ts'

type SortParams = {
    field: keyof Publication;
    direction: 'asc' | 'desc';
}

const getQueryString = (page = 0, perPage = 10, sort?: SortParams, search?: string): string => {
    let queryString = `${URL}?per-page=${perPage}&page=${page}`;
    if (sort) {
        const {field, direction} = sort;
        queryString += `&sort=${field}:${direction}`
    }
    if (search) {
        queryString += `&title.search=${search.toUpperCase()}`
    }
    return queryString
}

const Table = () => {
    const [data, setData] = useState<Publication[]>(
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
                console.log(response)
            })
    }, [page, perPage, sort, search])

    return (
        <div>

        </div>
    );
};

export default Table;