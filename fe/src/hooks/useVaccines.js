import { useState, useEffect } from "react";
import axiosClient from "../config/axiosClient";

const useVaccines = () => {
  const [vaccines, setVaccines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVaccines = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/vaccine");
      const allVaccines = response.data.data || [];
      // Filter by searchTerm locally
      const filteredVaccines = allVaccines.filter(vaccine =>
        vaccine.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setVaccines(filteredVaccines);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải danh sách vaccine");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, [searchTerm]);

  return {
    vaccines,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    refetch: fetchVaccines,
  };
};

export default useVaccines;