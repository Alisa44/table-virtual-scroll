export type Author = {
    display_name: string;
}

export interface Publication {
    title: string;
    publicationYear: number;
    citedByCount: number;
}

export interface RawPublication extends Publication {
    authors: Author[];
}

export interface ITablePublication extends Publication {
    authors: string;
}

export type SortParams = {
    id: keyof RawPublication;
    desc: boolean;
}

export type ColumnSort = {
    id: string
    desc: boolean
}

export interface PublicationApiResponse {
    group_by: [];
    meta: any;
    results: RawPublication[];
}