// Base components
export { default as BaseTable } from './BaseTable';
export { default as Pagination } from '../../common/Pagination/Pagination';

// Table variants
export { default as AdminTable } from './variants/AdminTable';
export { default as CustomerTable } from './variants/CustomerTable';

// Specialized tables for Customer views
export { default as AppointmentTable } from './variants/AppointmentTable';
export { default as TestTable } from './variants/TestTable';

// Specialized tables for Admin views  
export { default as UserManagementTable } from './variants/UserManagementTable';
export { default as ApproveResultTable } from './variants/ApproveResultTable';
export { default as ServiceManagementTable } from './variants/ServiceManagementTable';
export { default as ContentManagementTable } from './variants/ContentManagementTable';

// Types and utils
export * from './types';
export * from './utils';
