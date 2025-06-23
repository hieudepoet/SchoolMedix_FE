import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Thêm import motion
import {
  Search,
  Filter,
  TicketCheck,
  Eye,
  EyeOff,
  PenBoxIcon,
  Trash2,
  CheckIcon,
  Plus,
} from "lucide-react";
import axiosClient from "../../config/axiosClient";
import { getUser } from "../../service/authService";
import { getChildClass } from "../../service/childenService";
import { Link, useNavigate } from "react-router-dom";

const DrugTable = () => {
  const [drugs, setDrugs] = useState([]);
  const [filteredDrugs, setFilteredDrugs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currChild, setCurrChild] = useState({});
  const [childClass, setChildClass] = useState(null);

  // Trạng thái để theo dõi nhiều đơn thuốc đang được mở rộng
  const [expandedRows, setExpandedRows] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrugHistory = async () => {
      const user = getUser();
      if (!user?.id) {
        setError("Vui lòng đăng nhập để xem lịch sử gửi thuốc");
        return;
      }

      const selectedChild = localStorage.getItem("selectedChild");
      if (!selectedChild) {
        setError("Vui lòng chọn một đứa trẻ để xem lịch sử gửi thuốc.");
        return;
      }

      const child = JSON.parse(selectedChild);
      setCurrChild(child);

      setIsLoading(true);
      try {
        // const clas = await getChildClass(child?.class_id);
        console.log("Child class fetched:", child.class_name); // Debug log
        setChildClass(child.class_name || "Chưa có thông tin");
        const res = await axiosClient.get(`/student/${child.id}/send-drug-request`);
        setDrugs(res.data.data || []);
        console.log("DRUGS: ", res.data.data)
        setFilteredDrugs(res.data.data || []);
      } catch (error) {
        console.error("Error fetching drug history or class:", error);
        setError("Không thể tải lịch sử gửi thuốc hoặc thông tin lớp. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrugHistory();
  }, []);

  useEffect(() => {
    let result = [...drugs];

    if (searchTerm) {
      result = result.filter((drug) =>
        drug.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) || ""
      );
    }

    if (statusFilter !== "Tất cả trạng thái") {
      result = result.filter((drug) => drug.status === statusFilter);
    }

    setFilteredDrugs(result);
  }, [searchTerm, statusFilter, drugs]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Hàm xử lý khi nhấn nút "Eye" để mở rộng/thu gọn chi tiết
  const handleView = (drug) => {
    if (expandedRows.includes(drug.id)) {
      setExpandedRows(expandedRows.filter((id) => id !== drug.id)); // Thu gọn
    } else {
      setExpandedRows([...expandedRows, drug.id]); // Mở rộng
    }
  };

  const handleEdit = (drug) => {
    alert(`Sửa đơn thuốc ${drug.id}`);
    // Thêm logic chỉnh sửa
  };

  const statusColors = {
    PROCESSING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REFUSED: "bg-red-100 text-red-800",
    DONE: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    RECEIVED: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm theo mô tả bệnh"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Tất cả trạng thái</option>
                <option>PROCESSING</option>
                <option>ACCEPTED</option>
                <option>REFUSED</option>
                <option>DONE</option>
                <option>CANCELLED</option>
                <option>RECEIVED</option>
              </select>
            </div>
            <button
              onClick={() => navigate(`/parent/edit/${currChild?.id}/send-drug-form`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Gửi thêm thuốc
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Đang tải lịch sử gửi thuốc...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredDrugs.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Mã đơn
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Tên học sinh
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Lớp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Tên thuốc
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Mô tả bệnh
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDrugs.map((drug) => (
                    <React.Fragment key={drug.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {drug.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {currChild?.name || "Không xác định"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {currChild?.class_name || "Chưa có thông tin"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[150px] truncate">
                          {drug?.request_items?.[0]?.name || "Không có dữ liệu"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[150px] truncate">
                          {drug?.diagnosis || "Không có mô tả"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[drug.status] || "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {drug.status || "Chưa xác định"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              onClick={() => handleView(drug)}
                              title={expandedRows.includes(drug.id) ? "Ẩn chi tiết" : "Xem chi tiết"}
                            >
                              {expandedRows.includes(drug.id) ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                              onClick={() => handleEdit(drug)}
                              title="Chỉnh sửa"
                            >
                              <PenBoxIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <AnimatePresence>
                        {expandedRows.includes(drug.id) && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <td colSpan="7" className="px-6 py-4 bg-gray-50">
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm"
                              >
                                <h3 className="text-xl font-bold text-blue-600 mb-6">
                                  Chi tiết đơn thuốc #{drug.id}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <p className="text-sm">
                                      <span className="font-semibold text-gray-700">Tên học sinh:</span>{" "}
                                      <span className="text-gray-900">{currChild?.name || "Không xác định"}</span>
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-semibold text-gray-700">Lớp:</span>{" "}
                                      <span className="text-gray-900">{currChild?.class_name || "Chưa có thông tin"}</span>
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-semibold text-gray-700">Mô tả bệnh:</span>{" "}
                                      <span className="text-gray-900">{drug?.diagnosis || "Không có mô tả"}</span>
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-semibold text-gray-700">Trạng thái:</span>{" "}
                                      <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[drug.status] || "bg-gray-100 text-gray-800"
                                          }`}
                                      >
                                        {drug.status || "Chưa xác định"}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="space-y-4">
                                    <p className="text-sm">
                                      <span className="font-semibold text-gray-700">Danh sách thuốc:</span>
                                    </p>
                                    {drug?.request_items?.length > 0 ? (
                                      <ul className="list-disc pl-5 text-sm text-gray-900 space-y-2">
                                        {drug.request_items.map((item, index) => (
                                          <li key={index} className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            {item.name} - <span className="font-medium">Số lượng: {item.dosage_usage}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-gray-500">Không có thuốc trong đơn.</p>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {drugs.length === 0
                  ? "Không có dữ liệu đơn thuốc."
                  : "Không tìm thấy đơn thuốc phù hợp."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugTable;