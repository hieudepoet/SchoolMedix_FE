import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../config/axiosClient";
import { ArrowLeft } from "lucide-react";

const RegularCheckupRegisterList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { checkup_id } = useParams();
  const navigate = useNavigate();

  console.log("ID: ", checkup_id);

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/checkup-register/" + checkup_id);
        console.log("LIST: ", res.data.data);
        setList(res.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải danh sách đăng ký");
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [checkup_id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "text-blue-600 bg-blue-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      case "APPROVED":
        return "text-green-600 bg-green-100";
      case "REJECTED":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCampaignStatusColor = (status) => {
    switch (status) {
      case "UPCOMING":
        return "text-orange-600 bg-orange-100";
      case "ONGOING":
        return "text-green-600 bg-green-100";
      case "COMPLETED":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "Đã gửi";
      case "CANCELLED":
        return "Đã hủy";
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Từ chối";
      case "UPCOMING":
        return "Sắp tới";
      case "ONGOING":
        return "Đang diễn ra";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => navigate("/nurse/regular-checkup")}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </button>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Danh sách đăng ký khám sức khỏe
        </h1>
        <p className="text-gray-600">Tổng số đăng ký: {list.length}</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lớp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái chiến dịch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lý do
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Không có dữ liệu đăng ký
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.register_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{item.register_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.student_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {item.student_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.class_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCampaignStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          item.register_status
                        )}`}
                      >
                        {getStatusText(item.register_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={item.reason}>
                        {item.reason}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {list.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Hiển thị {list.length} kết quả
        </div>
      )}
    </div>
  );
};

export default RegularCheckupRegisterList;
