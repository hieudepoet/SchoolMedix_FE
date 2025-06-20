import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, MapPin, CheckCircle, Clock, AlertCircle, Plus, XCircle, FileText, Edit, Activity, Users } from 'lucide-react';

const DiseaseRecordIdList = ({ records }) => {
  const [expanded, setExpanded] = useState({});

  const toggleDetails = (index) => {
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getDiseaseTypeColor = (category) => {
    switch (category) {
      case 'Bệnh truyền nhiễm':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Bệnh mãn tính':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDiseaseTypeIcon = (category) => {
    switch (category) {
      case 'Bệnh truyền nhiễm':
        return '🦠';
      case 'Bệnh mãn tính':
        return '💊';
      default:
        return '📋';
    }
  };

  if (records.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Không có hồ sơ bệnh nào
        </h3>
        <p className="text-gray-500">
          Chưa có dữ liệu hồ sơ bệnh để hiển thị
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>📊</span>
          Danh sách hồ sơ bệnh ({records.length} hồ sơ)
        </h3>
      </div> */}

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-b-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 grid grid-cols-8 gap-4 p-4 text-sm font-semibold text-gray-700 border-b border-gray-200" style={{gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr'}}>
          <span className="flex items-center gap-1">
            {/* 👤 Mã HS */}

            Mã HS
          </span>
          <span className="flex items-center gap-1">
            {/* 📝 Tên Học Sinh */}
            Tên Học Sinh
          </span>
          <span className="flex items-center gap-1">
            {/* 🏫 Lớp */}
            Lớp
          </span>
          <span className="flex items-center gap-1">
            {/* 📅 Ngày Phát Hiện */}
            Ngày Phát Hiện
          </span>
          <span className="flex items-center gap-1">
            {/* 📝 Ngày Ghi Nhận */}
            Ngày Ghi Nhận
          </span>
          <span className="flex items-center gap-1">
            {/* 🔍 Chẩn Đoán */}
            Chẩn Đoán
          </span>
          <span className="flex items-center gap-1">
            {/* 🏷️ Loại Bệnh */}
            Loại Bệnh
          </span>
          <span className="text-center">Thao tác</span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {records.map((record, index) => (
            <div key={index}>
              {/* Main Row */}
              <div className="grid grid-cols-8 gap-4 p-4 hover:bg-blue-50 transition-colors duration-200" style={{gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr'}}>
                <span className="font-semibold text-blue-600">
                  HS{record.student_id}
                </span>
                {/* Tên không xuống dòng */}
                <span className="font-medium text-gray-900 whitespace-nowrap">
                  {record.profile.name}
                </span>
                <span className="text-gray-700">
                  {record.class_name}
                </span>
                <span className="text-gray-700">
                  {new Date(record.detect_date).toLocaleDateString('vi-VN')}
                </span>
                <span className="text-gray-700">
                  {new Date(record.created_at).toLocaleDateString('vi-VN')}
                </span>
                <span className="text-gray-700">
                  {record.diagnosis || 'Chưa có'}
                </span>
                <div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getDiseaseTypeColor(record.disease_category)}`}>
                    {/* {getDiseaseTypeIcon(record.disease_category)} */}
                    {record.disease_category === 'Bệnh truyền nhiễm' ? 'Truyền nhiễm' : 'Mãn tính'}
                  </span>
                </div>
            
                <div className="text-center">
                <button
                  onClick={() => toggleDetails(index)}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 px-2 py-1 rounded text-sm font-medium transition-colors duration-200"
                >
                  {expanded[index] ? (
                    <>
                      <ChevronUp size={14} />
                      Ẩn
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} />
                      Xem
                    </>
                  )}
                </button>
                {/* <button
                  onClick={() => toggleDetails(index)}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    expanded[index]
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {expanded[index] ? 'Xem' : 'Ẩn'}
                </button> */}
                </div>
              </div>

              {/* Expanded Details */}
              {expanded[index] && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200">
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span>📋</span>
                      Thông tin chi tiết
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Tên Bệnh</div>
                        <div className="font-semibold text-gray-900">
                          {record.disease_name || 'Chưa có thông tin'}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Mô Tả</div>
                        <div className="font-semibold text-gray-900">
                          {record.description || 'Chưa có mô tả'}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Cần Vaccine</div>
                        <div className={`font-semibold ${record.vaccine_need ? 'text-red-600' : 'text-green-600'}`}>
                          {record.vaccine_need ? 'Có' : 'Không'}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Số Liều</div>
                        <div className="font-semibold text-gray-900">
                          {record.dose_quantity || 'Chưa xác định'}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Ngày Điều Trị</div>
                        <div className="font-semibold text-gray-900">
                          {record.cure_date ? new Date(record.cure_date).toLocaleDateString('vi-VN') : 'Chưa điều trị'}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Nơi Điều Trị</div>
                        <div className="font-semibold text-gray-900">
                          {record.location_cure || 'Chưa xác định'}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Ngày Tạo</div>
                        <div className="font-semibold text-gray-900">
                          {new Date(record.created_at).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Ngày Cập Nhật</div>
                        <div className="font-semibold text-gray-900">
                          {new Date(record.updated_at).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {records.map((record, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">#{record.student_id}</h4>
                  <p className="text-blue-100">{record.profile.name}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white`}>
                  {getDiseaseTypeIcon(record.disease_category)}
                  {record.disease_category === 'Bệnh truyền nhiễm' ? 'Truyền nhiễm' : 'Mãn tính'}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Lớp:</span>
                  <div className="font-semibold">{record.class_name}</div>
                </div>
                <div>
                  <span className="text-gray-600">Ngày phát hiện:</span>
                  <div className="font-semibold">{new Date(record.detect_date).toLocaleDateString('vi-VN')}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Chẩn đoán:</span>
                  <div className="font-semibold">{record.diagnosis || 'Chưa có'}</div>
                </div>
              </div>

              <button
                onClick={() => toggleDetails(index)}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  expanded[index]
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {expanded[index] ? '🔼 Ẩn chi tiết' : '🔽 Xem chi tiết'}
              </button>

              {/* Mobile Expanded Details */}
              {expanded[index] && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Tên Bệnh</div>
                      <div className="font-semibold text-gray-900">
                        {record.disease_name || 'Chưa có thông tin'}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Mô Tả</div>
                      <div className="font-semibold text-gray-900">
                        {record.description || 'Chưa có mô tả'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Cần Vaccine</div>
                        <div className={`font-semibold ${record.vaccine_need ? 'text-red-600' : 'text-green-600'}`}>
                          {record.vaccine_need ? '✅ Có' : '❌ Không'}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Số Liều</div>
                        <div className="font-semibold text-gray-900">
                          {record.dose_quantity || 'Chưa xác định'}
                        </div>
                      </div>
                    </div>
                    {record.cure_date && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Thông tin điều trị</div>
                        <div className="font-semibold text-gray-900">
                          {new Date(record.cure_date).toLocaleDateString('vi-VN')} - {record.location_cure || 'Chưa xác định'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseaseRecordIdList;