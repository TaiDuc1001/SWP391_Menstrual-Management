import React, { useState, useEffect } from 'react';
import { Panel, CreatePanelRequest, UpdatePanelRequest } from '../../../api/services/panelService';
import '../../../styles/modal/panelModal.module.css';
import clsx from 'clsx';

type PanelModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePanelRequest | UpdatePanelRequest) => Promise<void>;
    panel: Panel | null;
    mode: 'create' | 'edit';
};

const defaultForm: CreatePanelRequest = {
    panelName: '',
    description: '',
    duration: 0,
    responseTime: 0,
    price: 0,
    panelType: 'COMPREHENSIVE',
    panelTag: 'RECOMMENDED',
    testTypeIds: [],
};

const PanelModal: React.FC<PanelModalProps> = ({ isOpen, onClose, onSubmit, panel, mode }) => {
    const [form, setForm] = useState<CreatePanelRequest>(defaultForm);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (panel && mode === 'edit') {
            setForm({
                panelName: panel.panelName || '',
                description: panel.description || '',
                duration: panel.duration || 0,
                responseTime: panel.responseTime || 0,
                price: panel.price || 0,
                panelType: panel.panelType || 'COMPREHENSIVE',
                panelTag: panel.panelTag || 'RECOMMENDED',
                testTypeIds: panel.testTypeIds || [],
            });
        } else {
            setForm(defaultForm);
        }
    }, [panel, mode, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name === 'duration' || name === 'responseTime' || name === 'price' ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(form);
        setLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <button className="closeButton" onClick={onClose}>&times;</button>
                <div className="modalTitle">{mode === 'edit' ? 'Edit Panel' : 'Create Panel'}</div>
                <form onSubmit={handleSubmit}>
                    <label className="label">Panel Name</label>
                    <input className="inputField" name="panelName" value={form.panelName} onChange={handleChange} required />
                    <label className="label">Description</label>
                    <textarea className="inputField" name="description" value={form.description} onChange={handleChange} required />
                    <label className="label">Duration (min)</label>
                    <input className="inputField" name="duration" type="number" value={form.duration} onChange={handleChange} min={0} required />
                    <label className="label">Response Time (h)</label>
                    <input className="inputField" name="responseTime" type="number" value={form.responseTime} onChange={handleChange} min={0} required />
                    <label className="label">Price (VND)</label>
                    <input className="inputField" name="price" type="number" value={form.price} onChange={handleChange} min={0} required />
                    <label className="label">Panel Type</label>
                    <select className="inputField" name="panelType" value={form.panelType} onChange={handleChange} required>
                        <option value="COMPREHENSIVE">Comprehensive</option>
                        <option value="SPECIALIZED">Specialized</option>
                        <option value="PREVENTIVE">Preventive</option>
                    </select>
                    <label className="label">Panel Tag</label>
                    <select className="inputField" name="panelTag" value={form.panelTag} onChange={handleChange} required>
                        <option value="RECOMMENDED">Recommended</option>
                        <option value="BEST_VALUE">Best Value</option>
                        <option value="BUDGET_FRIENDLY">Budget Friendly</option>
                        <option value="POPULAR">Popular</option>
                        <option value="EXPRESS">Express</option>
                        <option value="NEW">New</option>
                    </select>
                    <div className="modalActions">
                        <button type="button" onClick={onClose} disabled={loading} className={clsx('bg-gray-200 px-4 py-2 rounded')}>Cancel</button>
                        <button type="submit" disabled={loading} className={clsx('bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700')}>{mode === 'edit' ? 'Save' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PanelModal;
