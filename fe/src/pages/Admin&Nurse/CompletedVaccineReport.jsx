import React, { useEffect, useState } from "react";
import axiosClient from "../../config/axiosClient";
import { getUserRole } from "../../service/authService";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

const CompletedVaccineReport = () => {
  const { campaign_id } = useParams();
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingRecords, setUpdatingRecords] = useState(new Set());
  const [vaccinationStatus, setVaccinationStatus] = useState("");

  const navigate = useNavigate();

  const fetchStudentList = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(
        `/vaccination-campaign/${campaign_id}/registered-record`
      );
      console.log(res);
      console.log("REGISTERED LIST: ", res.data.data);
      
      setTimeout(() => {
        setStudentList(res.data.data);
        setLoading(false);
      }, 500);

      const res2 = await axiosClient.get(
        `/vaccination-campaign/${campaign_id}`
      );
      console.log("CAMPAIGN DETAILS: ", res2.data);
      setVaccinationStatus(res2.data.data.status);
    } catch (error) {
      console.error("Error fetching student list:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaign_id) {
      fetchStudentList();
    }
  }, [campaign_id]);

  const handleVaccinationUpdate = async (recordId, studentName) => {
    const record = studentList.find((s) => s.id === recordId);
    if (updatingRecords.has(recordId) || record?.is_vaccinated) {
      return;
    }

    try {
      setUpdatingRecords((prev) => new Set([...prev, recordId]));

      const response = await axiosClient.patch(
        `/vaccination-record/${recordId}/complete`,
        {
          is_vaccinated: true,
          vaccination_date: new Date().toISOString(),
        }
      );

      console.log(
        `Updating vaccination record ${recordId} for student: ${studentName}`
      );

      fetchStudentList();

      console.log(`Successfully updated vaccination record for ${studentName}`);
    } catch (error) {
      console.error("Error updating vaccination record:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái tiêm chủng!");
    } finally {
      setUpdatingRecords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recordId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Đang tải danh sách học sinh...</div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20 bg-white relative">
      <div
        onClick={() => {
          navigate(`/${getUserRole()}/vaccine-campaign`);
        }}
        className="flex items-center justify-center absolute top-4 cursor-pointer"
      >
        <IoChevronBackOutline /> Back
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Báo cáo tiêm chủng - Chiến dịch {campaign_id}
      </h2>

      {studentList.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Không có học sinh nào đăng ký trong chiến dịch này
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  ID Học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Tên học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Giới tính
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Đã tiêm chủng
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentList.map((student, index) => (
                <tr
                  key={student.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.student_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.student_profile?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.student_profile?.gender || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      {/* Chỉ hiển thị checkbox khi campaign chưa completed */}
                      {student.status === "PENDING" && vaccinationStatus !== "COMPLETED" && (
                        <input
                          type="checkbox"
                          checked={student.is_vaccinated}
                          disabled={
                            student.is_vaccinated ||
                            updatingRecords.has(student.id)
                          }
                          className={`h-4 w-4 rounded border-gray-300 ${
                            student.is_vaccinated
                              ? "text-green-600 bg-green-50 border-green-300 cursor-not-allowed"
                              : updatingRecords.has(student.id)
                              ? "text-blue-400 cursor-not-allowed animate-pulse"
                              : "text-blue-600 focus:ring-blue-500 cursor-pointer hover:border-blue-400"
                          }`}
                          onChange={() =>
                            handleVaccinationUpdate(
                              student.record_id,
                              student.student_profile?.name
                            )
                          }
                          title={
                            student.is_vaccinated
                              ? "Đã tiêm chủng"
                              : "Click để xác nhận tiêm chủng"
                          }
                        />
                      )}

                      {(student.status === "COMPLETED" &&
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Đã tiêm
                        </span>
                      )}

                      {/* Hiển thị trạng thái chưa tiêm khi campaign đã completed nhưng student chưa tiêm */}
                      {student.status === "PENDING" && 
                       vaccinationStatus === "COMPLETED" && 
                       !student.is_vaccinated && (
                        <span className="text-xs text-red-600 font-medium">
                          ✗ Chưa tiêm
                        </span>
                      )}

                      {updatingRecords.has(student.id) && (
                        <span className="ml-2 text-xs text-blue-600">
                          Đang cập nhật...
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-sm text-gray-600">
            Tổng số học sinh: {studentList.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedVaccineReport;