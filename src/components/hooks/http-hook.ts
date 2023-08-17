import { useState, useCallback, useEffect, useRef } from 'react';
const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  const activeHttpError = useRef<any>([]);

  const sendRequest = useCallback(
    async (
      url: string,
      method = 'GET',
      body: string | null = null,
      headers = {}
    ) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpError.current.push(httpAbortCtrl);
      try {
        const res = await fetch(url, {
          method,
          body,
          headers,
        });

        const data = await res.json();
        setIsLoading(false);

        activeHttpError.current = activeHttpError.current.filter(
          (reqCtrl: any) => reqCtrl !== httpAbortCtrl
        );

        if (!res.ok) {
          setError(data.msg);
          throw new Error(data.msg);
        }
        return data;
      } catch (err: any) {
        setIsLoading(false);
        throw new Error(err.msg);
      }
    },
    []
  );

  const clearError = () => setError(null);

  useEffect(() => {
    return () => {
      activeHttpError.current.forEach((abortCtrl: any) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};

export default useHttpClient;
