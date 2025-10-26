import { useState, useEffect } from "react";

export const useFetch = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchFn();
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

export const useSubmit = (submitFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await submitFn(...args);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, success };
};
