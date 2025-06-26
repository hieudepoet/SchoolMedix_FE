import { useState, useEffect } from "react";
import axiosClient from "../config/axiosClient";

const useSpecialistExams = () => {
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/special-exam", {
        params: { search: searchTerm || undefined },
      });
      setExams(response.data.data.filter(exam => !exam.is_deleted)); // Filter out deleted exams
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải danh sách chuyên khoa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [searchTerm]);

  return {
    exams,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    refetch: fetchExams,
  };
};

export default useSpecialistExams;