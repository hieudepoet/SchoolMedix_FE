import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, Calendar, MapPin, AlertCircle, Loader2 } from "lucide-react";
import axiosClient from "../../config/axiosClient";

const RegularCheckupSurvey = () => {
  const { student_id, campaign_id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExams, setSelectedExams] = useState([]);
  const [reason, setReason] = useState("");
  const [registerId, setRegisterId] = useState(null);
  const navigate = useNavigate();

  // Lấy parent_id từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const parent_id = user ? user.id : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!campaign_id || isNaN(campaign_id) || !student_id || isNaN(student_id)) {
        setError("ID chiến dịch hoặc học sinh không hợp lệ.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const registerResponse = await axiosClient.get(
          `/checkup/campaign_id/${campaign_id}/student_id/${student_id}`
        );
        console.log("register response:", registerResponse)
        if (registerResponse.data.error === true) {
          setError(registerResponse.data.message || "Không tìm thấy Register ID.");
        } else if (registerResponse.data.data && registerResponse.data.data.id) {
          setRegisterId(registerResponse.data.data.id);
        } else {
          setError("Không nhận được Register ID từ server.");
        }

        const campaignResponse = await axiosClient.get(`/checkup-campaign-detail/${campaign_id}`);
        if (campaignResponse.data.error) {
          setError(campaignResponse.data.message);
        } else {
          setCampaign(campaignResponse.data.data);
          const initialExams = campaignResponse.data.data.specialist_exams.map((exam) => ({
            spe_exam_id: exam.id,
            status: "CANNOT_ATTACH",
          }));
          setSelectedExams(initialExams);
        }
      } catch (err) {
        {err && setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối.")};
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaign_id, student_id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleExamSelection = (speExamId) => {
    setSelectedExams((prev) =>
      prev.map((exam) =>
        exam.spe_exam_id === speExamId
          ? { ...exam, status: exam.status === "CANNOT_ATTACH" ? "WAITING" : "CANNOT_ATTACH" }
          : exam
      )
    );
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = async () => {
    if (!registerId) {
      setError("Không tìm thấy Register ID. Vui lòng kiểm tra lại.");
      return;
    }
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do để tiếp tục.");
      return;
    }

    const submitData = {
      parent_id,
      student_id,
      campaign_id,
      submit_time: new Date().toISOString(),
      reason,
      exams: selectedExams,
    };

    try {
      const response = await axiosClient.patch(`/checkup-register/${registerId}/submit`, submitData);
      if (response.data.error) {
        setError(response.data.message);
      } else {
        alert("Đăng ký kiểm tra sức khỏe thành công!");
        navigate(`/parent/edit/${student_id}/regular-checkup`);
      }
    } catch (err) {
      {err && setError("Không thể gửi đăng ký.")};
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white border border-red-300 rounded-xl p-8 max-w-lg w-full text-center shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/parent/edit/${student_id}/regular-checkup`)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <Shield className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết chiến dịch</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 pt-10">
        <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-md">
          <div className="flex items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <Shield className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {campaign.campaign_name || `Kiểm tra #${campaign.campaign_id}`}
                  </h3>
                  <p className="text-sm text-gray-600">Mã: {campaign.campaign_id}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Calendar className="w-5 h-5 text-gray-700" />
              <div>
                <p className="text-sm font-medium text-gray-900">Thời gian</p>
                <p className="text-sm text-gray-700">
                  {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                </p>
              </div>
            </div>
            {campaign.campaign_location && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <MapPin className="w-5 h-5 text-gray-700" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Địa điểm</p>
                  <p className="text-sm text-gray-700">{campaign.campaign_location}</p>
                </div>
              </div>
            )}
          </div>

          {campaign.campaign_des && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Mô tả</h4>
              <p className="text-gray-800">{campaign.campaign_des}</p>
            </div>
          )}

          {campaign.specialist_exams?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Chọn khám</h4>
              <ul className="list-disc list-inside text-gray-800">
                {campaign.specialist_exams.map((exam) => {
                  const selectedExam = selectedExams.find((e) => e.spe_exam_id === exam.id);
                  return (
                    <li key={exam.id} className="mb-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedExam?.status === "WAITING"}
                        onChange={() => handleExamSelection(exam.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="font-medium">{exam.name}</span>
                      {exam.description && `: ${exam.description}`}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-900 mb-2">
              Lý do
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={handleReasonChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập lý do..."
              rows="4"
              required
            />
          </div>

          <div className="flex justify-end border-t border-gray-200 pt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Gửi
            </button>
            <button
              onClick={() => navigate(`/parent/edit/${student_id}/regular-checkup`)}
              className="ml-4 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegularCheckupSurvey;