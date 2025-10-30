import { useState, useEffect, useCallback } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

const useApi = (url, method = "GET", body = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (requestBody = null) => {
      setLoading(true);
      setError(null);

      const dataToSend = requestBody || body;

      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const response = await axios({ url, method, data: dataToSend, headers });
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [url, method, body] 
  );

  useEffect(() => {
    if (method === "GET") {
      fetchData(); 
    }
  }, [fetchData, method]); 

  return { data, loading, error, fetchData };
};

export default useApi;
