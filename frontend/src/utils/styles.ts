/**
 * Common utility functions to reduce code duplication
 */

// CSS class utilities
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const conditionalClass = (condition: boolean, trueClass: string, falseClass = ''): string => {
  return condition ? trueClass : falseClass;
};

// Button variant utilities
export const getButtonClasses = (variant: string = 'primary', size: string = 'medium'): string => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    outline: 'btn-outline'
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-6 py-2 text-base',
    large: 'px-8 py-3 text-lg'
  };

  return cn(
    baseClasses,
    variantClasses[variant as keyof typeof variantClasses] || variantClasses.primary,
    sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium
  );
};

// Status utilities
export const getStatusVariant = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'active':
    case 'confirmed':
    case 'completed':
    case 'success':
      return 'success';
    case 'pending':
    case 'processing':
    case 'waiting':
      return 'warning';
    case 'cancelled':
    case 'failed':
    case 'rejected':
      return 'danger';
    case 'scheduled':
    case 'booked':
      return 'info';
    default:
      return 'default';
  }
};

// Common repeated style patterns
export const cardClasses = {
  base: 'card-base',
  hover: 'card-hover',
  shadow: 'bg-white rounded-2xl shadow-lg p-6',
  border: 'bg-white rounded-2xl border border-gray-200 p-6'
};

export const inputClasses = {
  base: 'form-input',
  error: 'form-input border-red-500 focus:ring-red-500 focus:border-red-500',
  success: 'form-input border-green-500 focus:ring-green-500 focus:border-green-500'
};

export const gradientClasses = {
  primary: 'gradient-primary',
  secondary: 'gradient-secondary',
  success: 'gradient-success',
  background: 'gradient-background'
};

// Navigation utilities
export const getNavLinkClasses = (isActive: boolean): string => {
  return isActive ? 'nav-link-active' : 'nav-link';
};

// Common layout classes
export const layoutClasses = {
  pageContainer: 'page-container',
  pageContent: 'page-content',
  sectionHeader: 'section-header',
  sectionTitle: 'section-title',
  sectionSubtitle: 'section-subtitle'
};

// Common animation classes
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideIn: 'transform transition-transform duration-300',
  hover: 'hover:scale-105 transition-transform duration-200',
  bounce: 'animate-bounce'
};

// Responsive grid utilities
export const gridClasses = {
  responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  twoColumn: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  threeColumn: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  fourColumn: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
};

// Common flex utilities
export const flexClasses = {
  center: 'flex items-center justify-center',
  between: 'flex items-center justify-between',
  start: 'flex items-center justify-start',
  end: 'flex items-center justify-end',
  column: 'flex flex-col',
  columnCenter: 'flex flex-col items-center justify-center'
};

// Common spacing utilities
export const spacingClasses = {
  sectionPadding: 'py-12 px-4 sm:px-6 lg:px-8',
  cardPadding: 'p-6',
  buttonPadding: 'px-6 py-2',
  inputPadding: 'px-4 py-2'
};

// Text utilities
export const textClasses = {
  heading: 'text-3xl font-bold text-gray-900',
  subheading: 'text-xl font-semibold text-gray-800',
  body: 'text-base text-gray-700',
  caption: 'text-sm text-gray-500',
  error: 'text-red-500',
  success: 'text-green-500'
};
