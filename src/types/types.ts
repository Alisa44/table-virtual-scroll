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

export interface TablePublication extends Publication {
    authors: string;
}

export type SortParams = {
    field: keyof RawPublication;
    direction: 'asc' | 'desc';
}