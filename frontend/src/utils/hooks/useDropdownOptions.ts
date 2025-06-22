import {useEffect, useState} from 'react';
import {api} from '../../api';
import {createPanelOptions, createSlotOptions, createStatusOptions, DropdownOption} from '../dropdownUtils';

export const useSlotOptions = () => {
    const [slotOptions, setSlotOptions] = useState<DropdownOption[]>([{value: '', label: 'All slots'}]);
    const [slotMap, setSlotMap] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        api.get('/enumerators/slots')
            .then(res => {
                const options = createSlotOptions(res.data);
                setSlotOptions(options);

                const map: { [key: string]: string } = {};
                res.data.forEach((slot: { timeRange: string }) => {
                    if (slot.timeRange !== 'Filler slot, not used') {
                        map[slot.timeRange] = slot.timeRange;
                    }
                });
                setSlotMap(map);
            })
            .catch(() => {
                setSlotOptions([{value: '', label: 'All slots'}]);
                setSlotMap({});
            });
    }, []);

    return {slotOptions, slotMap};
};

export const useStatusOptions = (endpoint: string = '/enumerators/examination-status') => {
    const [statusOptions, setStatusOptions] = useState<DropdownOption[]>([{value: '', label: 'All status'}]);

    useEffect(() => {
        api.get(endpoint)
            .then(res => {
                const options = createStatusOptions(res.data);
                setStatusOptions(options);
            })
            .catch(() => {
                setStatusOptions([{value: '', label: 'All status'}]);
            });
    }, [endpoint]);

    return statusOptions;
};

export const usePanelOptions = () => {
    const [panelOptions, setPanelOptions] = useState<DropdownOption[]>([{value: '', label: 'All panels'}]);

    useEffect(() => {
        api.get('/panels')
            .then(res => {
                const options = createPanelOptions(res.data);
                setPanelOptions(options);
            })
            .catch(() => {
                setPanelOptions([{value: '', label: 'All panels'}]);
            });
    }, []);

    return panelOptions;
};
