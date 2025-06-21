// DiseaseRecordManagement.js
import React, { useState, useEffect } from 'react';
import axiosClient from '../../config/axiosClient';
import DiseaseRecordIdList from './DiseaseRecordIdList';
import AddDiseaseRecord from './AddDiseaseRecord';

const DiseaseRecordManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Bệnh truyền nhiễm');
  const [showAddForm, setShowAddForm] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        if (!categoryFilter) {
          setRecords([]);
          setLoading(false);
          return;
        }
        const endpoint = categoryFilter === 'Bệnh truyền nhiễm' ? '/infectious-record' : '/chronic-record';
        const response = await axiosClient.get(`${endpoint}`);
        if (response.data.error === false || (response.data.error === undefined && response.data.data)) {
          setRecords(response.data.data || []);
        } else {
          setError('Không thể tải hồ sơ bệnh: ' + (response.data.message || 'Không có thông báo'));
        }
      } catch (err) {
        setError('Lỗi server khi tải hồ sơ bệnh: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [categoryFilter]);
  const filteredRecords = records.filter(record =>
    (searchTerm === '' || record.student_id.toString().includes(searchTerm) ||
     record.disease_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Hệ Thống Quản Lý Hồ Sơ Bệnh Án
              </h1>
              <p className="text-slate-600 mt-2 font-medium">
                Theo dõi và quản lý tình trạng sức khỏe học sinh một cách chuyên nghiệp
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-500">Tổng số hồ sơ</div>
                <div className="text-2xl font-bold text-slate-900">{records.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Control Panel */}
        {!showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo mã học sinh hoặc tên bệnh..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-80 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-slate-700 placeholder-slate-400"
                    />
                    <svg className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCategoryFilter('Bệnh truyền nhiễm')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        categoryFilter === 'Bệnh truyền nhiễm' 
                          ? 'bg-red-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Bệnh Truyền Nhiễm
                    </button>
                    <button
                      onClick={() => setCategoryFilter('Bệnh mãn tính')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        categoryFilter === 'Bệnh mãn tính' 
                          ? 'bg-amber-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Bệnh Mãn Tính
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Thêm Hồ Sơ Mới</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Content Area */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-slate-600 font-medium">Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : showAddForm ? (
          <AddDiseaseRecord onClose={() => setShowAddForm(false)} categoryFilter={categoryFilter} />
        ) : (
          <DiseaseRecordIdList records={filteredRecords} />
        )}
      </div>
    </div>
  );
};

export default DiseaseRecordManagement;