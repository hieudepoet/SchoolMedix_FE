import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Syringe,
  UserCheck,
  Send,
  Loader2,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../config/axiosClient";
import { getUserRole } from "../../../service/authService";
import { enqueueSnackbar } from "notistack";
import {
  calculateDuration,
  formatDate,
  getStatusColor,
  getStatusText,
} from "../../../utils/campaignUtils";
import Modal from 'react-modal';

// Set app element for react-modal (for accessibility)
Modal.setAppElement('#root');

const VaccineCampaignInfo = ({ details, setDetails }) => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const [loadingAction, setLoadingAction] = useState(false);
  const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false);

  // Modal styles (consistent with RegularCheckup)
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '500px',
      width: '90%',
      borderRadius: '0.5rem',
      border: 'none',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '0',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
  };

  const openCancelModal = () => {
    console.log("Opening cancel modal for campaignId:", details.campaign_id);
    setCancelModalIsOpen(true);
  };

  const closeCancelModal = () => {
    console.log("Closing cancel modal");
    setCancelModalIsOpen(false);
  };

  const handleCampaignAction = async (action) => {
    if (userRole !== "admin") return;
    if (action === "cancel" && !cancelModalIsOpen) {
      openCancelModal();
      return;
    }

    setLoadingAction(true);
    try {
      const endpoint =
        action === "send-register"
          ? `/vaccination-campaign/${details.campaign_id}/send-register`
          : `/vaccination-campaign/${details.campaign_id}/${action}`;
      const response = await (action === "send-register"
        ? axiosClient.post(endpoint)
        : axiosClient.patch(endpoint, { reason: "User requested cancellation" }));
      setDetails((prev) => ({
        ...prev,
        status:
          action === "send-register"
            ? "PREPARING"
            : action === "close-register"
            ? "UPCOMING"
            : action === "start"
            ? "ONGOING"
            : action === "complete"
            ? "COMPLETED"
            : action === "cancel"
            ? "CANCELLED"
            : prev.status,
      }));
      enqueueSnackbar(response?.data.message || "Thành công!", { variant: "info" });
    } catch (error) {
      console.error(`Error performing ${action} on campaign ${details.campaign_id}:`, error);
      enqueueSnackbar(error.response?.data?.message || "Có lỗi xảy ra!", { variant: "error" });
    } finally {
      setLoadingAction(false);
      if (action === "cancel") {
        closeCancelModal();
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "DRAFTED":
        return <FileText className="w-4 h-4" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "ONGOING":
        return <Syringe className="w-4 h-4" />;
      case "PREPARING":
        return <Clock className="w-4 h-4" />;
      case "UPCOMING":
        return <AlertCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPrimaryActionConfig = (status, campaignId) => {
    if (userRole === "nurse") {
      if (["PREPARING", "UPCOMING", "ONGOING"].includes(status)) {
        return {
          text: "Xem danh sách học sinh",
          action: "view-register-list",
          className: "bg-blue-600 hover:bg-blue-700 text-white",
          disabled: false,
          onClick: () => navigate(`/nurse/vaccine-campaign/${campaignId}/register-list`),
        };
      }
      if (status === "ONGOING") {
        return {
          text: "Chỉnh sửa báo cáo",
          action: "edit-report",
          className: "bg-indigo-700 hover:bg-indigo-800 text-white",
          disabled: false,
          onClick: () => navigate(`/nurse/vaccination-report/${campaignId}`),
        };
      }
      if (status === "COMPLETED") {
        return {
          text: "Xem báo cáo",
          action: "view-report",
          className: "bg-blue-600 hover:bg-blue-700 text-white",
          disabled: false,
          onClick: () => navigate(`/nurse/completed-vaccine-campaign-report/${campaignId}`),
        };
      }
      return null;
    }

    switch (status) {
      case "DRAFTED":
        return {
          text: "Gửi đơn",
          action: "send-register",
          className: "bg-blue-600 hover:bg-blue-700 text-white",
          disabled: false,
        };
      case "PREPARING":
        return {
          text: "Đóng đơn đăng ký",
          action: "close-register",
          className: "bg-amber-700 hover:bg-amber-800 text-white",
          disabled: false,
        };
      case "UPCOMING":
        return {
          text: "Khởi động chiến dịch",
          action: "start",
          className: "bg-indigo-700 hover:bg-indigo-800 text-white",
          disabled: false,
        };
      case "ONGOING":
        return {
          text: "Hoàn thành chiến dịch",
          action: "complete",
          className: "bg-emerald-700 hover:bg-emerald-800 text-white",
          disabled: false,
        };
      case "COMPLETED":
        return {
          text: "Xem báo cáo",
          action: "view-report",
          className: "bg-blue-600 hover:bg-blue-700 text-white",
          disabled: false,
          onClick: () => navigate(`/admin/completed-vaccine-campaign-report/${campaignId}`),
        };
      case "CANCELLED":
        return {
          text: "Đã hủy bỏ",
          action: null,
          className: "bg-slate-400 text-white cursor-not-allowed",
          disabled: true,
        };
      default:
        return null;
    }
  };

  const primaryAction = getPrimaryActionConfig(details.status, details.campaign_id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalIsOpen}
        onRequestClose={closeCancelModal}
        style={customStyles}
        contentLabel="Xác nhận hủy chiến dịch"
      >
        <div className="bg-white rounded-lg">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-slate-900">Xác nhận hủy chiến dịch</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Bạn có chắc chắn muốn hủy chiến dịch này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeCancelModal}
                className="px-4 cursor-pointer py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={() => handleCampaignAction("cancel")}
                disabled={loadingAction}
                className={`px-4 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 ${
                  loadingAction ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loadingAction ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Xác nhận hủy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Main Information */}
      <div className="lg:col-span-2 space-y-6">
        {/* Campaign Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{details.title || "Chiến dịch tiêm chủng"}</h2>
              <div className="flex items-center gap-2 mb-4">
                {getStatusIcon(details.status)}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(details.status)}`}
                >
                  {getStatusText(details.status)}
                </span>
              </div>
              {(userRole === "admin" || userRole === "nurse") && (
                <div className="flex flex-wrap gap-3">
                  {userRole === "admin" && details.status === "DRAFTED" && (
                    <>
                      <button
                        onClick={() => handleCampaignAction("send-register")}
                        disabled={loadingAction}
                        className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loadingAction ? "opacity-75 cursor-not-allowed" : ""}`}
                      >
                        {loadingAction ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Gửi đơn
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`/admin/vaccine-campaign/${details.campaign_id}/edit`)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </button>
                    </>
                  )}
                  {userRole === "admin" && ["DRAFTED", "PREPARING", "UPCOMING"].includes(details.status) && (
                    <button
                      onClick={() => handleCampaignAction("cancel")}
                      disabled={loadingAction}
                      className={`flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${loadingAction ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Hủy chiến dịch
                    </button>
                  )}
                  {primaryAction && (
                    <button
                      onClick={primaryAction.onClick || (() => handleCampaignAction(primaryAction.action))}
                      disabled={primaryAction.disabled || loadingAction}
                      className={`flex items-center px-4 py-2 font-medium rounded-lg transition-colors ${primaryAction.className} ${loadingAction ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      {loadingAction ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          {primaryAction.action === "view-register-list" && <UserCheck className="w-4 h-4 mr-2" />}
                          <span>{primaryAction.text}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
              {details.status === "DRAFTED" && userRole === "admin" && (
                <p className="text-sm text-gray-500 mt-2">
                  Chiến dịch đang ở trạng thái nháp. Vui lòng gửi đơn để bắt đầu quá trình chuẩn bị.
                </p>
              )}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <Syringe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-600 font-medium text-center">
                Chiến dịch tiêm chủng
              </p>
            </div>
          </div>
        </div>

        {/* Vaccine Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Syringe className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Thông tin vaccine</h2>
          </div>
          <div className="space-y-4">
            {details.vaccine_name ? (
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <Syringe className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{details.vaccine_name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Vaccine #{details.vaccine_id} - Phòng ngừa {details.disease_name || "Chưa xác định"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Syringe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có thông tin về vaccine</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Lịch trình chiến dịch</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Thời gian bắt đầu</p>
                <p className="text-gray-900 font-semibold">
                  {details.start_date ? formatDate(details.start_date) : "Chưa xác định"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Thời gian kết thúc</p>
                <p className="text-gray-900 font-semibold">
                  {details.end_date ? formatDate(details.end_date) : "Chưa xác định"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Địa điểm</p>
                <p className="text-gray-900 font-semibold capitalize">
                  {details.location || "Chưa xác định"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Information */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-gray-700" />
            Thống kê nhanh
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">ID Chiến dịch</span>
              <span className="font-semibold text-gray-900">#{details.campaign_id}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Tên vaccine</span>
              <span className="font-semibold text-gray-900">{details.vaccine_name || "Chưa xác định"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Phòng bệnh</span>
              <span className="font-semibold text-gray-900">{details.disease_name || "Chưa xác định"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Thời gian</span>
              <span className="font-semibold text-gray-900">
                {calculateDuration(details.start_date, details.end_date)} ngày
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Trạng thái</span>
              <span className="font-semibold text-gray-900">{getStatusText(details.status)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccineCampaignInfo;