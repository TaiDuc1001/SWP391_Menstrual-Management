import {BaseEntity, BaseFilters, createBaseService} from '../../utils/serviceUtils';

export interface User extends BaseEntity {
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin?: string;
}

export interface UserFilters extends BaseFilters {
    role?: string;
    status?: string;
}

export const userService = createBaseService<User, UserFilters>('/users');
