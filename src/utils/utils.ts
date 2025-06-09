import {URL} from "../constants/constants.ts";
import type {RawPublication, SortParams} from "../types/types.ts";

export const getQueryString = (page = 0, perPage = 10, sort?: SortParams[], search?: string): string => {
    let queryString = `${URL}?per-page=${perPage}&page=${page}`;
    if (sort?.length) {
        const {id, desc} = sort[0];
        queryString += `&sort=${id}:${desc ? 'desc' : 'ansc'}`
    }
    if (search) {
        queryString += `&title.search=${search.toUpperCase()}`
    }
    return queryString
}

export const mapDataForTable = (data: any): RawPublication[] => {
    return data.map(publication => ({
        title: publication.title,
        publicationYear: publication['publication_year'],
        citedByCount: publication['cited_by_count'],
        authors: publication['authorships']?.map(item => item.author)
    }))
}