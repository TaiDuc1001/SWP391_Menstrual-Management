import {useCallback, useMemo, useState} from 'react';

export interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

export interface UseTableStateOptions {
    initialPage?: number;
    initialPageSize?: number;
    initialSortConfig?: SortConfig | null;
    initialSearchTerm?: string;
}

export const useTableState = <T extends Record<string, any>>(
    data: T[],
    options: UseTableStateOptions = {}
) => {
    const {
        initialPage = 1,
        initialPageSize = 10,
        initialSortConfig = null,
        initialSearchTerm = ''
    } = options;

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialSortConfig);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [selected, setSelected] = useState<(string | number)[]>([]);

    const handleSort = useCallback((key: string) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return current.direction === 'asc'
                    ? {key, direction: 'desc'}
                    : null;
            }
            return {key, direction: 'asc'};
        });
        setCurrentPage(1);
    }, []);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handlePageSizeChange = useCallback((size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    }, []);

    const handleSelectChange = useCallback((newSelected: (string | number)[]) => {
        setSelected(newSelected);
    }, []);

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            const allIds = data.map(item => item.id || item.key);
            setSelected(allIds);
        } else {
            setSelected([]);
        }
    }, [data]);

    const clearSelection = useCallback(() => {
        setSelected([]);
    }, []);

    const isAllSelected = useMemo(() => {
        return data.length > 0 && selected.length === data.length;
    }, [data.length, selected.length]);

    const isIndeterminate = useMemo(() => {
        return selected.length > 0 && selected.length < data.length;
    }, [data.length, selected.length]);

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter(item =>
            Object.values(item).some(value =>
                value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Handle Date objects specifically
            if (aValue instanceof Date && bValue instanceof Date) {
                const timeDiff = aValue.getTime() - bValue.getTime();
                return sortConfig.direction === 'asc' ? timeDiff : -timeDiff;
            }

            // Handle null/undefined values
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            // Handle regular comparisons
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

    const totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    return {
        data: paginatedData,
        totalItems: sortedData.length,
        currentPage,
        totalPages,
        pageSize,
        sortConfig,
        searchTerm,
        selected,
        isAllSelected,
        isIndeterminate,
        setCurrentPage,
        setPageSize,
        setSortConfig,
        setSearchTerm,
        setSelected,
        handleSort,
        handleSearch,
        handlePageChange,
        handlePageSizeChange,
        handleSelectChange,
        handleSelectAll,
        clearSelection
    };
};
