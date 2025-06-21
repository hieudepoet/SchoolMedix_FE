import { useEffect, useState } from "react";
import { Syringe, Loader2, AlertCircle } from "lucide-react";
import axiosClient from "../../config/axiosClient";

const VaccineRecordsInfo = ({currChild}) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currChild?.id) {
      setError("Không tìm thấy thông tin học sinh");
      setLoading(false);
      return;
    }

    const fetchRecords = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/student/${currChild.id}/vaccination-record`);
        const recordData = res.data.data || [];
        setRecords(recordData);
        setError(null);
      } catch (error) {
        console.error("Error fetching vaccination records:", error);
        setError(error.response?.data?.message || "Không thể tải lịch sử tiêm chủng");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [currChild.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return "Chưa xác định";
    }
  };

  const getStatusDisplay = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Hoàn thành</span>;
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Đang chờ</span>;
      case 'CANCELLED':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Đã hủy</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Chưa xác định</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Đang tải lịch sử tiêm chủng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Syringe className="w-8 h-8 text-blue-600" />
          Lịch sử tiêm chủng
        </h1>
        <p className="text-gray-600">
          Thông tin lịch sử tiêm chủng của {currChild?.name || "học sinh"}
        </p>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12">
          <Syringe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có lịch sử tiêm chủng
          </h3>
          <p className="text-gray-500">
            Hiện tại chưa có thông tin tiêm chủng nào được ghi nhận
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-center">
                <th className="px-3 py-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-3 py-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Mã học sinh</th>
                <th className="px-3 py-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Mã vaccine</th>
                <th className="px-3 py-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tên vaccine</th>
                <th className="px-3 py-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-3 py-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tiêm</th>
                <th className="px-3 py-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Địa điểm</th>
                <th className="px-3 py-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((record, index) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-3 py-6 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-3 py-6 whitespace-nowrap text-sm text-gray-600">{record.student_id || "Chưa xác định"}</td>
                  <td className="px-3 py-6 whitespace-nowrap text-sm text-gray-600">{record.vaccine_id || "Chưa xác định"}</td>
                  <td className="px-3 py-6 text-sm text-gray-600">{record.name || "Vaccine"}</td>
                  <td className="px-3 py-6 text-sm text-gray-600">{record.description || "Không có mô tả"}</td>
                  <td className="px-3 py-6 whitespace-nowrap text-sm text-gray-600">{formatDate(record.vaccination_date)}</td>
                  <td className="px-3 py-6 text-sm text-gray-600">{record.location || "Chưa xác định"}</td>
                  <td className="px-3 py-6 whitespace-nowrap text-sm">{getStatusDisplay(record.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VaccineRecordsInfo;