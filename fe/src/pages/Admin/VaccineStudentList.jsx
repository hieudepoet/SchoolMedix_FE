import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import axiosClient from "../../config/axiosClient";

const VaccineStudentList = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const [id] = useState(path.split("/")[4]);
  const [studentList, setStudentList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(
          "/vaccination-campaign/" + id + "/student-eligible"
        );
        console.log("STUDENT LIST: ", res.data.data);
        setStudentList(res.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Không thể tải danh sách học sinh");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [id]);

  const getVaccinationStatus = (completedDoses, totalDoses) => {
    const completed = parseInt(completedDoses);
    const total = parseInt(totalDoses);

    if (completed === 0) {
      return {
        status: "Chưa tiêm",
        icon: <Clock className="w-4 h-4" />,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        progressColor: "bg-red-500",
      };
    } else if (completed < total) {
      return {
        status: `Đã tiêm ${completed}/${total} liều`,
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        progressColor: "bg-yellow-500",
      };
    } else {
      return {
        status: "Hoàn thành",
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        progressColor: "bg-green-500",
      };
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Đang tải danh sách học sinh...</p>
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

  const completedStudents = studentList.filter(
    (s) => parseInt(s.completed_doses) >= parseInt(s.dose_quantity)
  ).length;

  const getRegisterStatus = (isRegistered) => {
    if (isRegistered === null)
      return {
        label: "Không có đơn",
        color: "text-gray-500 bg-gray-100",
      };
    if (isRegistered === false)
      return {
        label: "Chờ duyệt",
        color: "text-yellow-800 bg-yellow-100",
      };
    return {
      label: "Đã duyệt",
      color: "text-green-800 bg-green-100",
    };
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/vaccine-campaign/" + id)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>

      {/* Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Danh sách học sinh tiêm chủng
        </h2>

        <div className="flex flex-wrap gap-4">
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Tổng số: {studentList.length} học sinh
          </div>
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Hoàn thành: {completedStudents} học sinh
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tình trạng tiêm chủng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiến độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái đơn
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentList.map((student) => {
                const vaccinationInfo = getVaccinationStatus(
                  student.completed_doses,
                  student.dose_quantity
                );
                const progress =
                  (parseInt(student.completed_doses) /
                    parseInt(student.dose_quantity)) *
                  100;

                return (
                  <tr
                    key={student.student_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.student_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${vaccinationInfo.bgColor} ${vaccinationInfo.textColor}`}
                      >
                        {vaccinationInfo.icon}
                        {vaccinationInfo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-24">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${vaccinationInfo.progressColor}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600 min-w-fit">
                          {student.completed_doses}/{student.dose_quantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                          getRegisterStatus(student.is_registered).color
                        }`}
                      >
                        {getRegisterStatus(student.is_registered).label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state */}
      {studentList.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Không có học sinh nào đủ điều kiện tiêm chủng
          </p>
        </div>
      )}
    </div>
  );
};

export default VaccineStudentList;