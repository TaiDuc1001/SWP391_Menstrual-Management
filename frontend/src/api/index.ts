/**
 * Centralized API exports for the entire application
 * Import all API functionality from this single entry point
 */

// Axios instance
export {default as api} from './axios';

// All services
export {
    userService,
    appointmentService,
    serviceManagementService,
    stiTestService,
    contentManagementService,
    approvalService,
    doctorService
} from './services';

// All service types
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
    DoctorFilters
} from './services';

// All hooks
export {
    useTableState,
    useBulkActions
} from './hooks';

// Hook types
export type {
    SortConfig,
    UseTableStateOptions
} from './hooks';

// Common API response types
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

// Common filter types
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

// Common API utility functions
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
