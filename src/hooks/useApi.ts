import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  autoFetch?: boolean;
}

export function useApi<T>(
  apiCall: () => Promise<{ success: boolean; data?: T; message: string }>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { onSuccess, onError, autoFetch = true } = options;

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        onSuccess?.(response.data);
      } else {
        const errorMsg = response.message || 'An error occurred';
        setState({
          data: null,
          loading: false,
          error: errorMsg,
        });
        onError?.(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Network error';
      setState({
        data: null,
        loading: false,
        error: errorMsg,
      });
      onError?.(errorMsg);
      toast.error(errorMsg);
    }
  };

  const mutate = (newData: T) => {
    setState(prev => ({ ...prev, data: newData }));
  };

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  };

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, []);

  return {
    ...state,
    execute,
    mutate,
    reset,
    refetch: execute,
  };
}

export const useApiMutation = <TData, TArgs extends any[]>(
  mutationFn: (...args: TArgs) => Promise<ApiResponse<TData>>
) => {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = async (...args: TArgs) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await mutationFn(...args);
      
      if (result.success) {
        setState({
          data: result.data || null,
          loading: false,
          error: null,
        });
        toast.success(result.message || 'Operation successful');
        return result;
      } else {
        const errorMsg = result.message || 'An error occurred';
        setState({
          data: null,
          loading: false,
          error: errorMsg,
        });
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Network error';
      setState({
        data: null,
        loading: false,
        error: errorMsg,
      });
      toast.error(errorMsg);
      throw error;
    }
  };

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  };

  return {
    ...state,
    mutate,
    reset,
  };
};