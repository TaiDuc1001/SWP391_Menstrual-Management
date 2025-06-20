/**
 * Centralized type exports for the entire application
 * Import all types from this single entry point
 */

// Route types
export * from './routes';

// Table types
export * from './table';

// Common UI component types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showCloseButton?: boolean;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  className?: string;
}

export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

// Status types
export type Status = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'active' | 'inactive';

export interface StatusBadgeProps {
  status: Status;
  className?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'select' | 'textarea' | 'date' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export interface FormData {
  [key: string]: string | number | boolean | Date | string[];
}

export interface FormErrors {
  [key: string]: string;
}

// Navigation types
export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  children?: NavigationItem[];
  roles?: string[];
}

// User types
export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'doctor' | 'staff' | 'customer';

// Staff types
export interface StaffProfile {
  id: number;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
}

// Common data types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimestampedEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
}

// Filter types
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
  status?: Status;
  statuses?: Status[];
}

// API response types
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

// Theme types
export interface ThemeConfig {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// Layout types
export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
  roles?: UserRole[];
}

// Utility types
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Partial<T> = { [P in keyof T]?: T[P] };
export type Required<T> = { [P in keyof T]-?: T[P] };

// Generic component props
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}
