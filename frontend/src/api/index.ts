/**
 * Centralized API exports for the entire application
 * Import all API functionality from this single entry point
 */


export {default as api} from './axios';


export {
    userService,
    appointmentService,
    serviceManagementService,
    stiTestService,
    contentManagementService,
    approvalService,
    doctorService,
    accountService,
    blogService
} from './services';


export type {
    User,
    UserFilters,
    Appointment,
    AppointmentFilters,
    Service,
    ServiceFilters,
    STITest,
    STITestFilters,
    Content,
    ContentFilters,
    ApprovalRequest,
    ApprovalFilters,
    Doctor,
    DoctorFilters,
    Account,
    AccountForUI,
    CreateAccountRequest,
    UpdateAccountRequest,
    SimpleBlogDTO,
    BlogDTO,
    BlogCreateRequest,
    BlogUpdateRequest,
    BlogFilterRequest,
    BlogPaginatedResponse,
    BlogCategory
} from './services';


export {
    useTableState,
    useBulkActions
} from './hooks';


export type {
    SortConfig,
    UseTableStateOptions
} from './hooks';


export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
}


export interface BaseFilters {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface DateRangeFilters {
    startDate?: string;
    endDate?: string;
}

export interface StatusFilters {
    status?: string;
    statuses?: string[];
}


export const createQueryString = (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                value.forEach((item) => searchParams.append(key, item.toString()));
            } else {
                searchParams.append(key, value.toString());
            }
        }
    });

    return searchParams.toString();
};

export const handleApiError = (error: any): ApiError => {
    if (error.response) {
        return {
            message: error.response.data?.message || 'An error occurred',
            status: error.response.status,
            code: error.response.data?.code
        };
    } else if (error.request) {
        return {
            message: 'Network error - please check your connection',
            status: 0
        };
    } else {
        return {
            message: error.message || 'An unexpected error occurred',
            status: 500
        };
    }
};

export const formatApiResponse = <T>(data: T, message?: string): ApiResponse<T> => {
    return {
        data,
        message,
        success: true
    };
};
