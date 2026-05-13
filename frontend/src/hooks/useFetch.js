import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const useFetch = (apiFunc, params = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, params);

  return { data, loading, error, refetch: fetchData };
};
