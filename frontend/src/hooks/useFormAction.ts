import { useCallback, useState } from 'react';

interface UseFormActionOptions {
  /** Simulated save delay in ms for visible loading feedback. */
  delayMs?: number;
}

export function useFormAction(options: UseFormActionOptions = {}) {
  const { delayMs = 450 } = options;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setLoading(false);
    setSuccess(false);
    setError(null);
  }, []);

  const run = useCallback(
    async (action: () => void | Promise<void>) => {
      setLoading(true);
      setSuccess(false);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        await action();
        setSuccess(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'error');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [delayMs]
  );

  return { loading, success, error, run, reset };
}
