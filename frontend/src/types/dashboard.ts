export interface RecentActivityDTO {
    time: string;
    action: string;
    type: string;
    timestamp: string;
}

export interface SystemNotificationDTO {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error';
    priority: 'low' | 'medium' | 'high';
    isRead: boolean;
}

