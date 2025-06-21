import { useState, useEffect } from "react";
import axiosClient from "../config/axiosClient";
import { getUser } from "../service/authService";
import { getChildClass } from "../service/childenService";
import {
  handleAccept,
  handleRefuse,
  handleCancel,
  handleReceive,
  handleDone,
} from "../utils/statusUpdateHandler";
import { useSnackbar } from "notistack";

const useSendDrugManagement = () => {
  const [drugs, setDrugs] = useState([]);
  const [filteredDrugs, setFilteredDrugs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [error, setError] = useState(null);
  const [classMap, setClassMap] = useState({}); // Lưu thông tin lớp theo class_id
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchDrugHistory = async () => {
      try {
        setError(null);
        const user = getUser();
        if (!user?.id) {
          setError("Vui lòng đăng nhập để xem danh sách đơn thuốc");
          return;
        }

        // Gọi endpoint lấy tất cả drug requests
        const res = await axiosClient.get("/send-drug-request");
        const drugData = res.data.data || [];

        // Lấy danh sách class_id duy nhất từ drug requests
        const classIds = [...new Set(drugData.map((drug) => drug.student?.class_id).filter(Boolean))];

        // Lấy thông tin lớp học cho các class_id
        const classPromises = classIds.map((class_id) => getChildClass(class_id));
        const classResults = await Promise.all(classPromises);
        const classMap = classResults.reduce((acc, classInfo, index) => {
          if (classInfo) acc[classIds[index]] = classInfo;
          return acc;
        }, {});

        setClassMap(classMap);
        setDrugs(drugData);
        setFilteredDrugs(drugData);
      } catch (error) {
        console.error("Error fetching drug history or classes:", error);
        setError("Không thể tải danh sách đơn thuốc. Vui lòng thử lại sau.");
      }
    };
    fetchDrugHistory();
  }, []);

  useEffect(() => {
    let result = [...drugs];
    if (statusFilter !== "Tất cả trạng thái") {
      result = result.filter((drug) => drug.status === statusFilter);
    }
    if (searchTerm) {
      result = result.filter((drug) =>
        drug.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredDrugs(result);
  }, [searchTerm, statusFilter, drugs]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  return {
    drugs,
    filteredDrugs,
    searchTerm,
    statusFilter,
    error,
    classMap, // Trả về classMap thay vì childClass
    handleSearch,
    handleFilterChange,
    handleAccept: (id) =>
      handleAccept(id, setError, setDrugs, setFilteredDrugs, () => {}, enqueueSnackbar),
    handleRefuse: (id) =>
      handleRefuse(id, setError, setDrugs, setFilteredDrugs, () => {}, enqueueSnackbar),
    handleCancel: (id) =>
      handleCancel(id, setError, setDrugs, setFilteredDrugs, () => {}, enqueueSnackbar),
    handleReceive: (id) =>
      handleReceive(id, setError, setDrugs, setFilteredDrugs, () => {}, enqueueSnackbar),
    handleDone: (id) =>
      handleDone(id, setError, setDrugs, setFilteredDrugs, () => {}, enqueueSnackbar),
  };
};

export default useSendDrugManagement;