import { useState, useEffect } from 'react';
import { accountService, AccountForUI, CreateAccountRequest, UpdateAccountRequest, Account } from '../services/accountService';

export const useAccounts = () => {
    const [accounts, setAccounts] = useState<AccountForUI[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState(0);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await accountService.getAllAccounts();
            setAccounts(result);
            setTotalItems(result.length);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch accounts');
            console.error('Error fetching accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    const createAccount = async (request: CreateAccountRequest): Promise<{ success: boolean; data?: Account; error?: string }> => {
        try {
            setLoading(true);
            setError(null);
            const newAccount = await accountService.createAccount(request);
            await fetchAccounts(); // Refresh list
            return { success: true, data: newAccount };
        } catch (err: any) {
            const errorMessage = err.message || err.response?.data?.message || 'Failed to create account';
            setError(errorMessage);
            console.error('Error creating account:', err);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const updateAccount = async (id: number, request: UpdateAccountRequest): Promise<{ success: boolean; data?: Account; error?: string }> => {
        try {
            setLoading(true);
            setError(null);
            const updatedAccount = await accountService.updateAccount(id, request);
            await fetchAccounts(); // Refresh list
            return { success: true, data: updatedAccount };
        } catch (err: any) {
            const errorMessage = err.message || err.response?.data?.message || 'Failed to update account';
            setError(errorMessage);
            console.error('Error updating account:', err);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        accounts,
        loading,
        error,
        totalItems,
        fetchAccounts,
        createAccount,
        updateAccount,
        setError
    };
};

