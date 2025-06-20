import {ReactElement} from 'react';

export interface RouteConfig {
    path: string;
    element: ReactElement;
    label?: string;
    icon?: ReactElement;
    showInNavbar?: boolean;
    showInSidebar?: boolean;
}

export interface ComponentRouteConfig {
    path: string;
    component: React.ComponentType<any>;
    label?: string;
    icon?: ReactElement;
    showInNavbar?: boolean;
    showInSidebar?: boolean;
}
