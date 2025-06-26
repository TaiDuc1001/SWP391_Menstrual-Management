// Status mappings for consistent display across the application
export const appointmentStatusMapping: { [key: string]: string } = {
    'BOOKED': 'Booked',
    'CONFIRMED': 'Confirmed',
    'WAITING_FOR_CUSTOMER': 'Waiting for Customer',
    'WAITING_FOR_DOCTOR': 'Waiting for Doctor',
    'WAITING': 'Waiting',
    'IN_PROGRESS': 'In Progress',
    'FINISHED': 'Completed',
    'CANCELLED': 'Cancelled',
};

export const examinationStatusMapping: { [key: string]: string } = {
    'PENDING': 'Pending',
    'BOOKED': 'Booked',
    'IN_PROGRESS': 'In Progress',
    'EXAMINED': 'Examined',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled',
};

export const formatAppointmentStatus = (status: string): string => {
    return appointmentStatusMapping[status] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, ' ');
};

export const formatExaminationStatus = (status: string): string => {
    return examinationStatusMapping[status] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, ' ');
};

export const formatGenericStatus = (status: string): string => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, ' ');
};

// Enhanced search function for multi-field searching
export const createMultiFieldSearch = (searchTerm: string, fields: string[]) => {
    return (item: any): boolean => {
        if (!searchTerm) return true;
        
        const lowerSearchTerm = searchTerm.toLowerCase();
        return fields.some(field => {
            const value = item[field];
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(lowerSearchTerm);
        });
    };
};

// Enhanced date comparison function
export const createDateFilter = (fromDate: Date | null, toDate: Date | null, dateField: string) => {
    return (item: any): boolean => {
        if (!fromDate && !toDate) return true;
        
        try {
            const itemDate = new Date(item[dateField]);
            if (isNaN(itemDate.getTime())) return true; // Invalid date, include item
            
            const fromMatch = fromDate ? itemDate >= fromDate : true;
            const toMatch = toDate ? itemDate <= toDate : true;
            
            return fromMatch && toMatch;
        } catch {
            return true; // On error, include item
        }
    };
};
