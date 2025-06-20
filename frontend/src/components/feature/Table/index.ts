// BaseTable components
export { default as BaseTable } from './BaseTable';
export { default as Pagination } from '../../common/Pagination/Pagination';

// BaseTable variants
export { default as AdminTable } from './Admin/BaseTable';
export { default as CustomerTable } from './Customer/BaseTable';

// Specialized tables for Customer views
export { default as AppointmentTable } from './Customer/Appointments';
export { default as TestTable } from './Customer/Examinations';

// Specialized tables for Admin views  
export { default as UserManagementTable } from './Admin/Accounts';
export { default as ApproveResultTable } from './Admin/Examinations';
export { default as ServiceManagementTable } from './Admin/TestPanels';
export { default as ContentManagementTable } from './Admin/Blogs';

// Types and utils
export * from './types';
export * from './utils';
