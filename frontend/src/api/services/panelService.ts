export type PanelType = 'COMPREHENSIVE' | 'SPECIALIZED' | 'PREVENTIVE';
export type PanelTag = 'RECOMMENDED' | 'BEST_VALUE' | 'BUDGET_FRIENDLY' | 'POPULAR' | 'EXPRESS' | 'NEW';

export interface Panel {
    id: string;
    panelName: string;
    description: string;
    duration: number;
    responseTime: number;
    price: number;
    panelType: PanelType;
    panelTag: PanelTag;
    testTypeIds: number[];
    status: string;
}

export interface CreatePanelRequest {
    panelName: string;
    description: string;
    duration: number;
    responseTime: number;
    price: number;
    panelType: PanelType;
    panelTag: PanelTag;
    testTypeIds: number[];
}

export interface UpdatePanelRequest extends CreatePanelRequest {}

export interface CreateTestTypeRequest {
    name: string;
    description: string;
}
