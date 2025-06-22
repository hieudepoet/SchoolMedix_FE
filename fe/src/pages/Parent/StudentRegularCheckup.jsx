import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, Shield, Calendar, MapPin, AlertCircle, Loader2 } from "lucide-react";
import axiosClient from "../../config/axiosClient";
import CheckupHistoryInfo from "./CheckupHistoryInfo";

const StudentRegularCheckup = () => {
  const [campaignList, setCampaignList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currChild, setCurrChild] = useState(null);
  const navigate = useNavigate();
  const [historyView, setHistoryView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const child = JSON.parse(localStorage.getItem("selectedChild"));
        if (!child) {
          setError("Không tìm thấy thông tin học sinh");
          setLoading(false);
          return;
        }
        setCurrChild(child);

        const campaignRes = await axiosClient.get("/checkup-campaign");
        const campaigns = campaignRes.data.data || [];
        setCampaignList(campaigns.map(c => ({
          ...c,
          status: c.status || "Chưa xác định"
        })));
        setError(null);
      } catch (error) {
        setError("Failed to fetch data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSurvey = (campaignId) => {
    navigate(`/parent/edit/${currChild.id}/surveyCheckup/${campaignId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return "Chưa xác định";
    }
  };

  const getCampaignStatus = (campaign) => {
    const status = campaign.status?.toUpperCase();

    switch (status) {
      case "PREPARING":
        return {
          status: "Chuẩn bị",
          className: "bg-orange-100 text-orange-900 border-orange-400",
          canSurvey: true,
        };
      case "ACTIVE":
        return {
          status: "Đang diễn ra",
          className: "bg-green-100 text-green-900 border-green-400",
          canSurvey: false,
        };
      case "COMPLETED":
        return {
          status: "Hoàn thành",
          className: "bg-gray-100 text-gray-900 border-gray-400",
          canSurvey: false,
        };
      case "CANCELLED":
        return {
          status: "Đã hủy",
          className: "bg-red-100 text-red-900 border-red-400",
          canSurvey: false,
        };
      default:
        return {
          status: "Chưa xác định",
          className: "bg-gray-100 text-gray-900 border-gray-400",
          canSurvey: false,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Đang tải dữ liệu...</p>
          <p className="text-sm text-gray-700 mt-1">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white border border-red-300 rounded-xl p-8 max-w-lg w-full text-center shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-300 shadow-md">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <Shield className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hệ thống quản lý kiểm tra sức khỏe</h1>
              <p className="text-gray-700 mt-1">Theo dõi và xem lịch sử kiểm tra sức khỏe</p>
            </div>
          </div>

          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            <button
              onClick={() => setHistoryView(false)}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
                !historyView ? "bg-white text-blue-700 shadow-sm border border-blue-200" : "text-gray-800 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Kế hoạch kiểm tra
            </button>
            <button
              onClick={() => setHistoryView(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
                historyView ? "bg-white text-blue-700 shadow-sm border border-blue-200" : "text-gray-800 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <History className="w-4 h-4" />
              Lịch sử kiểm tra
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto pt-10">
        {historyView ? (
          <div className="bg-white rounded-xl border border-gray-300 py-10 text-center shadow-md">
            <CheckupHistoryInfo />
          </div>
        ) : (
          <>
            {campaignList.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-300 p-12 text-center shadow-md">
                <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lịch kiểm tra</h3>
                <p className="text-gray-700">Hiện tại chưa có lịch kiểm tra nào. Vui lòng quay lại sau.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {campaignList.map((campaign) => {
                  const statusInfo = getCampaignStatus(campaign);

                  return (
                    <div
                      key={campaign.id}
                      className="bg-white border border-gray-300 rounded-xl p-8 hover:border-gray-400 hover:shadow-lg transition-all duration-200"
                      onClick={() => handleSurvey(campaign.id)}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                              <Shield className="w-5 h-5 text-blue-700" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{campaign.name || `Kiểm tra sức khỏe #${campaign.id}`}</h3>
                              <p className="text-sm text-gray-600 font-mono">Mã kiểm tra: {campaign.id}</p>
                            </div>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusInfo.className}`}>
                          {statusInfo.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <Calendar className="w-5 h-5 text-gray-700" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Thời gian</p>
                            <p className="text-sm text-gray-700">{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</p>
                          </div>
                        </div>

                        {campaign.location && (
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <MapPin className="w-5 h-5 text-gray-700" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Địa điểm</p>
                              <p className="text-sm text-gray-700">{campaign.location}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {campaign.description && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Mô tả</h4>
                          <p className="text-gray-800 leading-relaxed">{campaign.description}</p>
                        </div>
                      )}

                      <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                          onClick={() => statusInfo.canSurvey && handleSurvey(campaign.id)}
                          disabled={!statusInfo.canSurvey}
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium shadow-sm transition-colors ${
                            !statusInfo.canSurvey
                              ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          Khảo sát
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentRegularCheckup;