import { useEffect } from "react";
import { Loader2, Calendar, MapPin, FileText, CheckCircle, Syringe } from "lucide-react";

const VaccineDetailsDropdown = ({ diseaseId, details, loading }) => {
  useEffect(() => {
    console.log(`Details for disease ${diseaseId}:`, details);
  }, [diseaseId, details]);

  if (loading) return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
        <span className="text-sm text-gray-600">Đang tải chi tiết...</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full">
      <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 rounded-t-lg">
        <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Chi tiết lịch sử tiêm chủng
        </h4>
      </div>
      <div className="p-4 overflow-x-auto">
        {details?.length > 0 ? (
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 w-1/6">Mũi tiêm</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 w-1/6">Ngày tiêm</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 w-1/6">Địa điểm</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 w-1/3">Mô tả</th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 w-1/6">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">
                    <Syringe className="w-4 h-4 text-blue-500" />
                    {`Mũi tiêm #${index + 1}`}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {detail.vaccination_date ? new Date(detail.vaccination_date).toLocaleDateString('vi-VN') : "Chưa xác định"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-green-500" />
                    {detail.location || "Chưa xác định"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span className="truncate max-w-xs">{detail.description || "Không có mô tả"}</span>
                  </td>
                  <td className="px-4 py-2 text-sm ">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      detail.status === 'COMPLETED' || detail.status === 'Đã tiêm' ? 'bg-green-100 text-green-800' :
                      detail.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {detail.status || "Chưa xác định"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Không có chi tiết nào được ghi nhận.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccineDetailsDropdown;