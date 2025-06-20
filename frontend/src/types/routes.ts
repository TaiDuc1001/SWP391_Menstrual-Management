import {ReactNode} from 'react';

export interface RouteConfig {
    path: string;
    element?: ReactNode;
    label?: string;
    iconName?: string;
    showInNavbar?: boolean;
    showInSidebar?: boolean;
}

export interface ComponentRouteConfig {
    path: string;
    component: React.ComponentType<any>;
    label?: string;
    iconName?: string;
    showInNavbar?: boolean;
    showInSidebar?: boolean;
}
