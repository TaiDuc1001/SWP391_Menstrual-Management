import {useCallback, useState} from 'react';

export const useBulkActions = <T extends Record<string, any>>(
  selected: (string | number)[],
  onSuccess?: () => void
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeBulkAction = useCallback(async (
    action: (ids: (string | number)[]) => Promise<void>,
    actionName: string
  ) => {
    if (selected.length === 0) {
      setError(`No items selected for ${actionName}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await action(selected);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${actionName}`);
    } finally {
      setLoading(false);
    }
  }, [selected, onSuccess]);

  const bulkDelete = useCallback(async (
    deleteAction: (ids: (string | number)[]) => Promise<void>
  ) => {
    await executeBulkAction(deleteAction, 'delete selected items');
  }, [executeBulkAction]);

  const bulkUpdate = useCallback(async (
    updateAction: (ids: (string | number)[]) => Promise<void>
  ) => {
    await executeBulkAction(updateAction, 'update selected items');
  }, [executeBulkAction]);

  const bulkExport = useCallback(async (
    exportAction: (ids: (string | number)[]) => Promise<void>
  ) => {
    await executeBulkAction(exportAction, 'export selected items');
  }, [executeBulkAction]);

  return {
    loading,
    error,
    bulkDelete,
    bulkUpdate,
    bulkExport,
    setError
  };
};
