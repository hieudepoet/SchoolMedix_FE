import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Calendar, Users, GraduationCap, CheckCircle } from 'lucide-react';

const HealthProfile = () => {
  const [childData, setChildData] = useState(null); // Initialize as null for clearer loading state
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const selectedChild = JSON.parse(localStorage.getItem("selectedChild"));
    setChildData(selectedChild);
    setIsLoading(false);
    console.log("CHILD DATA: ", selectedChild);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const [day, month, year] = dateStr.split('/');
    return `${day}/${month}/${year}`;
  };

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const [day, month, year] = dob.split('/');
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">Đang tải thông tin học sinh...</p>
        </div>
      </div>
    );
  }

  if (!childData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Không tìm thấy thông tin học sinh</p>
        </div>
      </div>
    );
  }

  const InfoRow = ({ label, value, status }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-600 font-medium">{label}:</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900 font-medium">{value || "-"}</span>
        {status && (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
            {status}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header with Avatar and Name */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-20 h-24 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {childData.name?.charAt(0).toUpperCase() || "-"}
                </span>
              </div>
              {childData.email_verified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{childData.name || "Không có tên"}</h1>
              <p className="text-blue-600 font-medium">{childData.class_name || "-"}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Personal Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin chung</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                <InfoRow label="Ngày sinh" value={formatDate(childData.dob)} />
                <InfoRow label="Giới tính" value={childData.gender} />
                <InfoRow label="Nơi sinh" value="-" />
                <InfoRow label="Quốc tịch" value="-" />
                <InfoRow label="Dân tộc" value="-" />
                <InfoRow label="Email" value="-" />
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-4 mt-6">Thông tin gia đình</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                <InfoRow label="Họ và tên mẹ" value="Đỗ Thị Thanh Hương" />
                <InfoRow label="Ngày sinh" value="24/07/1990" />
                <InfoRow label="Nghề nghiệp" value="-" />
              </div>
            </div>

            {/* Right Column - School Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin học tập</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                <InfoRow label="Mã học sinh" value={`sn${childData.id}`} />
                <InfoRow label="Khối" value={childData.grade_name} />
                <InfoRow label="Lớp" value={childData.class_name} />
                <InfoRow label="Trạng thái" value="Đang học" status="Đang học" />
                <InfoRow label="Địa chỉ cư trú" value="-" />
                <InfoRow label="Địa chỉ tạm trú" value="-" />
                <InfoRow label="Nhóm máu" value="-" />
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-4 mt-6">Địa chỉ liên hệ</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 leading-relaxed">{childData.address || "-"}</p>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-4 mt-6">Liên hệ khẩn cấp</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                <InfoRow label="Số điện thoại" value={childData.phone_number} />
                <InfoRow label="Email phụ huynh" value="-" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;