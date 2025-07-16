export interface DropdownOption {
    value: string;
    label: string;
}

export const createAllOption = (label: string): DropdownOption => ({
    value: '',
    label
});

export const createSlotOptions = (slots: { timeRange: string }[]): DropdownOption[] => {
    const options = [createAllOption('All slots')];
    const slotMap: { [key: string]: string } = {};

    slots.forEach(slot => {
        if (slot.timeRange !== 'Filler slot, not used') {
            options.push({value: slot.timeRange, label: slot.timeRange});
            slotMap[slot.timeRange] = slot.timeRange;
        }
    });

    return options;
};

export const createStatusOptions = (statuses: string[]): DropdownOption[] => {
    const options = [createAllOption('All status')];

    statuses.forEach(status => {
        options.push({
            value: status,
            label: status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')
        });
    });

    return options;
};

export const createTypeOptions = (types: string[]): DropdownOption[] => {
    const options = [createAllOption('All types')];

    types.forEach(type => {
        options.push({
            value: type,
            label: type?.charAt(0) + type?.slice(1).toLowerCase()
        });
    });

    return options;
};

export const createPanelOptions = (panels: { panelName: string }[]): DropdownOption[] => {
    const options = [createAllOption('All panels')];

    panels.forEach(panel => {
        options.push({value: panel.panelName, label: panel.panelName});
    });

    return options;
};

