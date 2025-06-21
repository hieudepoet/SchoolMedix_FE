import React, { useState } from 'react';

const DiseaseRecordIdList = ({ records }) => {
  const [expanded, setExpanded] = useState({});

  const toggleDetails = (index) => {
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getStatusBadge = (category) => {
    return category === 'Bệnh truyền nhiễm' 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-amber-100 text-amber-800 border-amber-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">
          <div className="col-span-2">Mã Học Sinh</div>
          <div className="col-span-2">Ngày Phát Hiện</div>
          <div className="col-span-2">Ngày Ghi Nhận</div>
          <div className="col-span-3">Chẩn Đoán</div>
          <div className="col-span-2">Phân Loại</div>
          <div className="col-span-1 text-center">Thao Tác</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-200">
        {records.map((record, index) => (
          <div key={index} className="hover:bg-slate-50 transition-colors">
            {/* Main Row */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2">
                  <span className="font-bold text-blue-600 text-lg">
                    #{record.student_id}
                  </span>
                </div>
                
                <div className="col-span-2 text-slate-700 font-medium">
                  {new Date(record.detect_date).toLocaleDateString('vi-VN')}
                </div>
                
                <div className="col-span-2 text-slate-700 font-medium">
                  {new Date(record.created_at).toLocaleDateString('vi-VN')}
                </div>
                
                <div className="col-span-3">
                  <span className="text-slate-900 font-medium">
                    {record.diagnosis || 'Chưa có chẩn đoán'}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(record.disease_category)}`}>
                    {record.disease_category === 'Bệnh truyền nhiễm' ? 'Truyền Nhiễm' : 'Mãn Tính'}
                  </span>
                </div>
                
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => toggleDetails(index)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors flex items-center space-x-1 mx-auto"
                  >
                    <span>{expanded[index] ? 'Thu Gọn' : 'Chi Tiết'}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${expanded[index] ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expanded[index] && (
              <div className="px-6 pb-6 bg-slate-50">
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
                    Thông Tin Chi Tiết
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Tên Bệnh</label>
                        <p className="text-slate-900 font-medium">{record.disease_name || 'Không có thông tin'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Mô Tả Bệnh</label>
                        <p className="text-slate-700">{record.description || 'Không có mô tả'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Yêu Cầu Vaccine</label>
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          record.vaccine_need 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {record.vaccine_need ? 'Cần Thiết' : 'Không Cần'}
                        </span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Số Liều Vaccine</label>
                        <p className="text-slate-900 font-medium">{record.dose_quantity || 'Chưa xác định'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Ngày Điều Trị</label>
                        <p className="text-slate-900 font-medium">
                          {record.cure_date ? new Date(record.cure_date).toLocaleDateString('vi-VN') : 'Chưa điều trị'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Nơi Điều Trị</label>
                        <p className="text-slate-900 font-medium">{record.location_cure || 'Chưa xác định'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Ngày Tạo Hồ Sơ</label>
                        <p className="text-slate-700 text-sm">
                          {new Date(record.created_at).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Lần Cập Nhật Cuối</label>
                        <p className="text-slate-700 text-sm">
                          {new Date(record.updated_at).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {records.length === 0 && (
        <div className="px-6 py-12 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Không có hồ sơ bệnh án</h3>
          <p className="text-slate-600">Hiện tại chưa có hồ sơ bệnh án nào trong hệ thống.</p>
        </div>
      )}
    </div>
  );
};

export default DiseaseRecordIdList;