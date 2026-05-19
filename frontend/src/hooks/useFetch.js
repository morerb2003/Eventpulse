import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const EMPTY_PARAMS = [];

export const useFetch = (apiFunc, params = EMPTY_PARAMS) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiFunc(...params);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [apiFunc, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
