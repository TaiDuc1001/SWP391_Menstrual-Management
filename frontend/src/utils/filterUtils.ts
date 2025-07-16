export interface FilterOptions {
    search?: string;
    type?: string;
    tag?: string[];
    status?: string;
    slot?: string;
    dateFrom?: Date | null;
    dateTo?: Date | null;
}

export interface FilterableItem {
    [key: string]: any;
}

export const createSearchFilter = (searchTerm: string, searchFields: string[]) =>
    (item: FilterableItem): boolean => {
        if (!searchTerm) return true;

        return searchFields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

export const createTypeFilter = (selectedType: string, typeField: string) =>
    (item: FilterableItem): boolean => {
        if (!selectedType) return true;
        return item[typeField] === selectedType;
    };

export const createTagFilter = (selectedTags: string[], tagField: string) =>
    (item: FilterableItem): boolean => {
        if (selectedTags.length === 0) return true;
        return selectedTags.includes(item[tagField]);
    };

export const createStatusFilter = (selectedStatus: string, statusField: string) =>
    (item: FilterableItem): boolean => {
        if (!selectedStatus) return true;
        return item[statusField] === selectedStatus;
    };

export const createPackageFilter = (searchTerm: string, type: string, tags: string[]) =>
    (pkg: any): boolean => {
        const matchesSearch = !searchTerm ||
            pkg.panelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = !type || pkg.panelType === type;
        const matchesTag = tags.length === 0 || tags.includes(pkg.panelTag);

        return matchesSearch && matchesType && matchesTag;
    };

export interface PaginationOptions {
    currentPage: number;
    itemsPerPage: number;
}

export const applyPagination = <T>(items: T[], options: PaginationOptions) => {
    const {currentPage, itemsPerPage} = options;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginatedItems = items.slice(startIdx, endIdx);

    return {
        items: paginatedItems,
        totalPages,
        totalItems: items.length,
        startIdx,
        endIdx
    };
};

