import { useState, useEffect } from 'react';
import { panelService, Panel, CreatePanelRequest, UpdatePanelRequest, PanelFilters } from '../services/panelService';

export const usePanels = () => {
    const [panels, setPanels] = useState<Panel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchPanels = async (filters?: PanelFilters) => {
        try {
            setLoading(true);
            setError(null);
            
            let result;
            if (filters && (filters.keyword || filters.panelType || filters.panelTag)) {
                result = await panelService.searchPanels(filters);
            } else if (filters && (filters.page !== undefined || filters.size !== undefined)) {
                result = await panelService.getPanelsWithPagination(filters);
            } else {
                const allPanels = await panelService.getAllPanels();
                result = {
                    panels: allPanels,
                    totalItems: allPanels.length,
                    totalPages: 1,
                    currentPage: 0
                };
            }
            
            setPanels(result.panels);
            setTotalItems(result.totalItems);
            setTotalPages(result.totalPages);
            setCurrentPage(result.currentPage);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch panels');
            console.error('Error fetching panels:', err);
        } finally {
            setLoading(false);
        }
    };

    const createPanel = async (request: CreatePanelRequest): Promise<Panel | null> => {
        try {
            setLoading(true);
            setError(null);
            const newPanel = await panelService.createPanel(request);
            await fetchPanels(); // Refresh list
            return newPanel;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create panel');
            console.error('Error creating panel:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updatePanel = async (id: number, request: UpdatePanelRequest): Promise<Panel | null> => {
        try {
            setLoading(true);
            setError(null);
            const updatedPanel = await panelService.updatePanel(id, request);
            await fetchPanels(); // Refresh list
            return updatedPanel;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update panel');
            console.error('Error updating panel:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deletePanel = async (id: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await panelService.deletePanel(id);
            await fetchPanels(); // Refresh list
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete panel');
            console.error('Error deleting panel:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getPanelById = async (id: number): Promise<Panel | null> => {
        try {
            setLoading(true);
            setError(null);
            const panel = await panelService.getPanelById(id);
            return panel;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch panel details');
            console.error('Error fetching panel details:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        panels,
        loading,
        error,
        totalItems,
        totalPages,
        currentPage,
        fetchPanels,
        createPanel,
        updatePanel,
        deletePanel,
        getPanelById,
        setError
    };
};

