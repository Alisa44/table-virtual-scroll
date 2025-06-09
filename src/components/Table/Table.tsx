import React, {useEffect, useState} from 'react';
import type {Publication} from "../../types/types.ts";

const Table = () => {
    const [data, setData] = useState<Publication[]>([]);
    const [page, setPage] = useState<number>(0);

    useEffect(() => {

    }, [])

    return (
        <div>
            
        </div>
    );
};

export default Table;