import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const DiseaseRecordList = ({ records }) => {
  const [expanded, setExpanded] = useState({});

  const toggleDetails = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getStatusBadge = (category) =>
    category === "Bệnh truyền nhiễm"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-amber-100 text-amber-700 border-amber-200";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 grid grid-cols-12 gap-4 text-xs font-medium text-slate-500 uppercase">
        <div className="col-span-2">Mã học sinh</div>
        <div className="col-span-2">Ngày phát hiện</div>
        <div className="col-span-2">Ngày ghi nhận</div>
        <div className="col-span-3">Chẩn đoán</div>
        <div className="col-span-2">Phân loại</div>
        <div className="col-span-1 text-center">Thao tác</div>
      </div>

      <div className="divide-y divide-slate-200">
        {records.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-10 w-10 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có hồ sơ bệnh án</h3>
            <p className="text-slate-600">Hệ thống sẽ hiển thị khi có hồ sơ mới</p>
          </div>
        ) : (
          records.map((record, index) => (
            <div key={index} className="hover:bg-slate-50 transition-colors">
              <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2 font-semibold text-indigo-600">#{record.student_id}</div>
                <div className="col-span-2 text-slate-700">{new Date(record.detect_date).toLocaleDateString("vi-VN")}</div>
                <div className="col-span-2 text-slate-700">{new Date(record.created_at).toLocaleDateString("vi-VN")}</div>
                <div className="col-span-3 text-slate-900">{record.diagnosis || "Chưa có chẩn đoán"}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(record.disease_category)}`}>
                    {record.disease_category === "Bệnh truyền nhiễm" ? "Truyền nhiễm" : "Mãn tính"}
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => toggleDetails(index)}
                    className="flex items-center gap-1 mx-auto text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    {expanded[index] ? "Thu gọn" : "Chi tiết"}
                    {expanded[index] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {expanded[index] && (
                <div className="px-6 pb-6 bg-slate-50/50">
                  <div className="bg-white rounded-lg border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Tên bệnh</p>
                        <p className="text-slate-900">{record.disease_name || "Không có thông tin"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Mô tả bệnh</p>
                        <p className="text-slate-700">{record.description || "Không có mô tả"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Yêu cầu vaccine</p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium border ${
                            record.vaccine_need ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {record.vaccine_need ? "Cần thiết" : "Không cần"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Số liều vaccine</p>
                        <p className="text-slate-900">{record.dose_quantity || "Chưa xác định"}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Ngày điều trị</p>
                        <p className="text-slate-900">{record.cure_date ? new Date(record.cure_date).toLocaleDateString("vi-VN") : "Chưa điều trị"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Nơi điều trị</p>
                        <p className="text-slate-900">{record.location_cure || "Chưa xác định"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Ngày tạo</p>
                        <p className="text-slate-700 text-sm">{new Date(record.created_at).toLocaleString("vi-VN")}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Cập nhật cuối</p>
                        <p className="text-slate-700 text-sm">{new Date(record.updated_at).toLocaleString("vi-VN")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiseaseRecordList;