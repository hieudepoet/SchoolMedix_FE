import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axiosClient from '../../config/axiosClient';
import DiseaseRecordIdList from './DiseaseRecordIdList';
import SendDiseaseReport from './SendDiseaseReport';

const DiseaseRecordOfChildrenManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  const [showAddForm, setShowAddForm] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { student_id } = useParams();

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        if (!categoryFilter) {
          setRecords([]);
          setLoading(false);
          return;
        }
        
        let endpoint = '';
        if (categoryFilter === 'Bệnh truyền nhiễm') {
          endpoint = `${student_id}/infectious-record`;
        } else if (categoryFilter === 'Bệnh mãn tính') {
          endpoint = `${student_id}/chronic-record`;
        } else if (categoryFilter === 'Tất cả') {
          endpoint = `${student_id}/disease-record`;
        }

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

  const clearFilter = () => {
    setSearchTerm('');
    setCategoryFilter('Tất cả');
  };

  const filteredRecords = records.filter(record =>
    (searchTerm === '' || record.student_id.toString().includes(searchTerm) ||
     record.disease_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categoryOptions = [
    { value: 'Tất cả', label: 'Tất cả', icon: '📋', color: 'bg-indigo-500 hover:bg-indigo-600' },
    { value: 'Bệnh truyền nhiễm', label: 'Bệnh Truyền Nhiễm', icon: '🦠', color: 'bg-red-500 hover:bg-red-600' },
    { value: 'Bệnh mãn tính', label: 'Bệnh Mãn Tính', icon: '💊', color: 'bg-orange-500 hover:bg-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  🏥
                </div>
                Quản lý hồ sơ bệnh
              </h1>
              <p className="mt-2 text-gray-600 text-lg">
                Quản lý và theo dõi sức khỏe học sinh một cách hiệu quả
              </p>
            </div>
            {!showAddForm && (
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <span className="text-blue-700 font-semibold">
                    Tổng hồ sơ: {records.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <span className="text-lg">+</span>
                  Khai báo Bệnh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> Tao là Hiếu, tao sửa chỗ này nè mấy tml FE*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Controls */}
        {!showAddForm && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tìm kiếm hồ sơ
                </label>
                <div className="relative">
                  {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🔍</span>
                  </div> */}
                  <input
                    type="text"
                    placeholder="Tìm theo mã học sinh, tên bệnh, chẩn đoán..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Phân loại bệnh
                </label>
                <div className="flex flex-wrap gap-3">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCategoryFilter(option.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                        categoryFilter === option.value
                          ? `${option.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {/* <span className="text-lg">{option.icon}</span> */}
                      {option.label}
                    </button>
                  ))}
                  <button
                    onClick={clearFilter}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200"
                  >
                    {/* <span className="text-lg">🗑️</span> */}
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">⚠️</span>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : showAddForm ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <SendDiseaseReport
              onClose={() => setShowAddForm(false)} 
              categoryFilter={categoryFilter} 
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            {filteredRecords.length > 0 ? (
              <DiseaseRecordIdList records={filteredRecords} />
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Không tìm thấy hồ sơ nào
                </h3>
                <p className="text-gray-500">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseRecordOfChildrenManagement;