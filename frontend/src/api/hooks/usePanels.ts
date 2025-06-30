import { useState } from 'react';
import api from '../axios';
import { Panel, CreatePanelRequest, UpdatePanelRequest } from '../services/panelService';

export const usePanels = () => {
    const [panels, setPanels] = useState<Panel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPanels = async (filters: any = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/panels');
            let data = res.data || [];
            if (filters.keyword) {
                const keyword = filters.keyword.toLowerCase();
                data = data.filter((panel: Panel) =>
                    panel.panelName.toLowerCase().includes(keyword) ||
                    panel.description.toLowerCase().includes(keyword) ||
                    (panel.panelType && panel.panelType.toLowerCase().includes(keyword)) ||
                    (panel.panelTag && panel.panelTag.toLowerCase().includes(keyword))
                );
            }
            setTotalItems(data.length);
            const page = filters.page || 0;
            const size = filters.size || 10;
            setTotalPages(Math.max(1, Math.ceil(data.length / size)));
            const paged = data.slice(page * size, (page + 1) * size);
            setPanels(paged);
        } catch (err: any) {
            setError('Failed to fetch panels');
            setPanels([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const createPanel = async (data: CreatePanelRequest) => {
        await api.post('/admin/panels', data);
        await fetchPanels();
    };

    const updatePanel = async (id: number, data: UpdatePanelRequest) => {
        await api.put(`/panels/${id}`, data);
        await fetchPanels();
    };

    const deletePanel = async (id: string) => {
        await api.delete(`/admin/panels/${id}`);
        await fetchPanels();
        return true;
    };

    return {
        panels,
        loading,
        error,
        totalItems,
        totalPages,
        fetchPanels,
        createPanel,
        updatePanel,
        deletePanel
    };
};
