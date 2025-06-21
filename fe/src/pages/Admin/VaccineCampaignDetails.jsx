import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  PlayCircle,
  ArrowLeft,
  Edit,
  Users,
  Syringe,
  Building,
  FileText
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../config/axiosClient';
import { getCardBorderColor, calculateDuration, formatDate, getStatusColor } from '../../utils/campaignUtils.js';

const VaccineCampaignDetails = () => {
  // Mock path and navigation for demo
  const mockPath = useLocation().pathname;
  const [id] = useState(mockPath.split('/')[3]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

  console.log("ID: ", id);
  

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace with actual axiosClient call
        const res = await axiosClient('/vaccination-campaign/' + id)
        console.log("Campaign details: ", res.data.data);
                
        setTimeout(() => {
          setDetails(res.data.data);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);



  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5" />;
      case 'ONGOING': return <PlayCircle className="w-5 h-5" />;
      case 'PREPARING': return <Clock className="w-5 h-5" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5" />;
      case 'UPCOMING': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };



  if (loading) {
    return (
      <div className="w-full mx-auto p-10 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded mb-6"></div>
          <div className="h-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-10 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/admin/vaccine-campaign')
          }}
          className="flex cursor-pointer items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại danh sách</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Chi tiết Chiến dịch Tiêm chủng</h1>
            <p className="text-gray-600 text-lg">Thông tin chi tiết về chiến dịch #{details.campaign_id}</p>
          </div>
          {/* <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
              <Edit className="w-5 h-5" />
              <span>Chỉnh sửa</span>
            </button>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Overview */}
          <div className={`bg-white rounded-xl shadow-lg border-l-4 ${getCardBorderColor(details.status)} p-8`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{details.description}</h2>
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border font-semibold ${getStatusColor(details.status)}`}>
                  {getStatusIcon(details.status)}
                  <span>{getStatusText(details.status)}</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Thời gian diễn ra</p>
                    <p className="text-lg font-bold text-blue-800">
                      {calculateDuration(details.start_date, details.end_date)} ngày
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <Syringe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Vaccine sử dụng</p>
                    <p className="text-lg font-bold text-green-800">{details.vaccine_name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Địa điểm</p>
                    <p className="text-lg font-bold text-purple-800">1 địa điểm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <Clock className="w-6 h-6 text-blue-500" />
              <span>Lịch trình Chiến dịch</span>
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 p-2 rounded-full">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">Bắt đầu chiến dịch</h4>
                    <span className="text-sm text-gray-500">Ngày bắt đầu</span>
                  </div>
                  <p className="text-gray-600 mt-1">{formatDate(details.start_date)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-500 p-2 rounded-full">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">Kết thúc chiến dịch</h4>
                    <span className="text-sm text-gray-500">Ngày kết thúc</span>
                  </div>
                  <p className="text-gray-600 mt-1">{formatDate(details.end_date)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Location Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-500" />
              <span>Địa điểm thực hiện</span>
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="font-semibold text-green-800">{details.location}</p>
                <p className="text-sm text-green-600 mt-1">Địa điểm chính</p>
              </div>
            </div>
          </div>

          {/* Vaccine Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Syringe className="w-5 h-5 text-purple-500" />
              <span>Thông tin Vaccine</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Tên vaccine:</span>
                <span className="font-semibold text-gray-800">{details.vaccine_name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Mã vaccine:</span>
                <span className="font-semibold text-gray-800">#{details.vaccine_id}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Loại bệnh:</span>
                <span className="font-semibold text-gray-800">Sởi</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>Thao tác nhanh</span>
            </h3>
            <div className="space-y-3">

              <button
              onClick={() => {navigate('/admin/vaccine-campaign/student-list/' + id)}} 
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Danh sách tiêm chủng</span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccineCampaignDetails;