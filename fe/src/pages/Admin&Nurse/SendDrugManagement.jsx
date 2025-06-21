import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useSendDrugManagement from "../../hooks/SendDrugManagementLogic";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  CheckIcon,
  Trash2,
  XCircle,
  TicketCheck,
  Plus,
} from "lucide-react";

const SendDrugManagement = () => {
  const navigate = useNavigate();
  const {
    drugs,
    filteredDrugs,
    searchTerm,
    statusFilter,
    error,
    classMap,
    handleSearch,
    handleFilterChange,
    handleAccept,
    handleRefuse,
    handleCancel,
    handleReceive,
    handleDone,
  } = useSendDrugManagement();

  const [expandedRows, setExpandedRows] = useState([]);

  const handleView = (drug) => {
    if (expandedRows.includes(drug.id)) {
      setExpandedRows(expandedRows.filter((id) => id !== drug.id));
    } else {
      setExpandedRows([...expandedRows, drug.id]);
    }
  };

  useEffect(() => {
    console.log("THUOC: ", filteredDrugs);
  }, [filteredDrugs])

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
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredDrugs.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên học sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lớp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên thuốc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả bệnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hoàn thành
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        {drug.student?.name || "Không xác định"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {classMap[drug.student?.class_id]?.class_name ||
                          "Chưa có thông tin"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[150px] truncate">
                        {drug?.request_items?.[0]?.name || "Không có dữ liệu"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[150px] truncate">
                        {drug?.diagnosis || "Không có mô tả"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            {
                              PROCESSING: "bg-yellow-100 text-yellow-800",
                              ACCEPTED: "bg-green-100 text-green-800",
                              REFUSED: "bg-red-100 text-red-800",
                              DONE: "bg-blue-100 text-blue-800",
                              CANCELLED: "bg-gray-100 text-gray-800",
                              RECEIVED: "bg-purple-100 text-purple-800",
                            }[drug.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {drug.status || "Chưa xác định"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {drug.status === "RECEIVED" && (
                          <input
                            type="checkbox"
                            onChange={() => handleDone(drug.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                            title="Đánh dấu hoàn thành"
                          />
                        )}
                        {drug.status === "DONE" && (
                          <div className="flex justify-center">
                            <CheckIcon
                              className="w-5 h-5 text-green-600"
                              title="Đã hoàn thành"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                            onClick={() => handleView(drug)}
                            title={
                              expandedRows.includes(drug.id)
                                ? "Ẩn chi tiết"
                                : "Xem chi tiết"
                            }
                          >
                            {expandedRows.includes(drug.id) ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                          {drug.status === "PROCESSING" && (
                            <>
                              <button
                                className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                                onClick={() => handleAccept(drug.id)}
                                title="Chấp nhận"
                              >
                                <CheckIcon className="w-5 h-5" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                onClick={() => handleRefuse(drug.id)}
                                title="Từ chối"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {drug.status === "ACCEPTED" && (
                            <button
                              className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50"
                              onClick={() => handleReceive(drug.id)}
                              title="Nhận thuốc"
                            >
                              <TicketCheck className="w-5 h-5" />
                            </button>
                          )}
                          {![
                            "RECEIVED",
                            "DONE",
                            "CANCELLED",
                            "REFUSED",
                          ].includes(drug.status) && (
                            <button
                              className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50"
                              onClick={() => handleCancel(drug.id)}
                              title="Hủy đơn"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          )}
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
                          <td colSpan="8" className="px-6 py-4 bg-gray-50">
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
                                    <span className="font-semibold text-gray-700">
                                      Tên học sinh:
                                    </span>{" "}
                                    <span className="text-gray-900">
                                      {drug.student?.name || "Không xác định"}
                                    </span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-semibold text-gray-700">
                                      Lớp:
                                    </span>{" "}
                                    <span className="text-gray-900">
                                      {classMap[drug.student?.class_id]
                                        ?.class_name || "Chưa có thông tin"}
                                    </span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-semibold text-gray-700">
                                      Mô tả bệnh:
                                    </span>{" "}
                                    <span className="text-gray-900">
                                      {drug?.diagnosis || "Không có mô tả"}
                                    </span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-semibold text-gray-700">
                                      Trạng thái:
                                    </span>{" "}
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        {
                                          PROCESSING:
                                            "bg-yellow-100 text-yellow-800",
                                          ACCEPTED:
                                            "bg-green-100 text-green-800",
                                          REFUSED: "bg-red-100 text-red-800",
                                          DONE: "bg-blue-100 text-blue-800",
                                          CANCELLED:
                                            "bg-gray-100 text-gray-800",
                                          RECEIVED:
                                            "bg-purple-100 text-purple-800",
                                        }[drug.status] ||
                                        "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {drug.status || "Chưa xác định"}
                                    </span>
                                  </p>
                                </div>
                                <div className="space-y-4">
                                  <p className="text-sm">
                                    <span className="font-semibold text-gray-700">
                                      Danh sách thuốc:
                                    </span>
                                  </p>
                                  {drug?.request_items?.length > 0 ? (
                                    <ul className="list-disc pl-5 text-sm text-gray-900 space-y-2">
                                      {drug.request_items.map((item, index) => (
                                        <li
                                          key={index}
                                          className="flex items-center gap-2"
                                        >
                                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                          {item.name} -{" "}
                                          <span className="font-medium">
                                            Số lượng: {item.quantity}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-gray-500">
                                      Không có thuốc trong đơn.
                                    </p>
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
      </div>
    </div>
  );
};

export default SendDrugManagement;
