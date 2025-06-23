import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, FileText, CheckCircle, Calendar, Clock, MapPin, Pill, User, Activity } from 'lucide-react';
import axiosClient from '../../config/axiosClient';

const HealthRecord = () => {

    const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'record_date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [currChild, setCurrChild] = useState(null);

useEffect(() => {
    const selectedChild = JSON.parse(localStorage.getItem("selectedChild"));
    if (selectedChild){
        setCurrChild(selectedChild);
    }
}, [])
    
  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Check if date is today
  const isToday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Fetch records for specific student
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/${currChild?.id}/daily-health-record`);
      const fetchedRecords = response.data; // axiosClient interceptor returns response.data directly
      if (!fetchedRecords.error && fetchedRecords.data) {
        setRecords(fetchedRecords.data);
        setFilteredRecords(fetchedRecords.data);
      } else {
        setError(fetchedRecords.message || 'Không thể tải hồ sơ y tế');
      }
      setLoading(false);
    } catch (error) {
      setError('Không thể tải hồ sơ y tế');
      console.error('Error fetching health records:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currChild) {
      fetchRecords();
    }
  }, [currChild]);

  // Handle date filtering
  useEffect(() => {
    let filtered = records.filter((record) => {
      const matchesDate = !dateFilter || 
        formatDateForInput(record.detect_time) === dateFilter ||
        formatDateForInput(record.record_date) === dateFilter;

      return matchesDate;
    });

    setFilteredRecords(filtered);
    setCurrentPage(1);
  }, [dateFilter, records]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredRecords].sort((a, b) => {
      if (key === 'detect_time' || key === 'record_date') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    setFilteredRecords(sorted);
  };

  // Toggle row expansion
  const toggleRowExpansion = (recordId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(recordId)) {
      newExpandedRows.delete(recordId);
    } else {
      newExpandedRows.add(recordId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Set filter to today's records
  const filterTodayRecords = () => {
    setDateFilter(getTodayDate());
  };

  // Clear all filters
  const clearFilters = () => {
    setDateFilter('');
  };

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  // Get student display name
  const getStudentDisplay = (name) => {
    return name;
  };

  // Get status badge
  const getStatusBadge = (record) => {
    if (record.transferred_to) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Chuyển viện</span>;
    } else if (record.on_site_treatment) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Điều trị tại chỗ</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Bình thường</span>;
  };

  // Get today's records count
  const todayRecordsCount = records.filter(record => 
    isToday(record.detect_time) || isToday(record.record_date)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Sức khỏe hằng ngày </h1>
              <p className="text-gray-600">Theo dõi tình hình sức khỏe của con tại trường</p>
              {currChild && (
                <p className="text-lg font-medium text-blue-600 mt-2">
                  Học sinh: {getStudentDisplay(currChild.name, currChild.id)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border">
                <span className="text-sm text-gray-600">Tổng hồ sơ: </span>
                <span className="font-bold text-blue-600">{records.length}</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border">
                <span className="text-sm text-gray-600">Hôm nay: </span>
                <span className="font-bold text-orange-600">{todayRecordsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              {error}
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Bộ lọc theo ngày</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Date Filter */}
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar size={20} className="absolute left-3 top-3.5 text-gray-400" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={filterTodayRecords}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Clock size={18} />
                  Hôm nay
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort('detect_time')}>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Ngày Phát Hiện {sortConfig.key === 'detect_time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort('record_date')}>
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      Ngày Ghi Nhận {sortConfig.key === 'record_date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Activity size={16} />
                      Chẩn Đoán
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Chi Tiết</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-600">Đang tải dữ liệu...</p>
                    </td>
                  </tr>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center">
                      <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 text-lg">Không tìm thấy hồ sơ nào</p>
                      <p className="text-gray-500 text-sm mt-2">Thử điều chỉnh bộ lọc hoặc liên hệ với nhà trường</p>
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((record) => (
                    <React.Fragment key={record.id}>
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {isToday(record.detect_time) && (
                              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                            )}
                            {formatDate(record.detect_time)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {isToday(record.record_date) && (
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            )}
                            {formatDate(record.record_date)}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-800 font-medium">
                            {record.diagnosis || 'Chưa có chẩn đoán'}
                          </span>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(record)}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => toggleRowExpansion(record.id)}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                          >
                            {expandedRows.has(record.id) ? (
                              <>
                                <ChevronUp size={16} />
                                Ẩn
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} />
                                Xem
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedRows.has(record.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan="5" className="p-0">
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <User size={16} className="text-blue-600" />
                                    Thông tin cơ bản
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium text-gray-600">Mã học sinh:</span> {getStudentDisplay(record.student_id)}</p>
                                    <p><span className="font-medium text-gray-600">Ngày phát hiện:</span> {formatDate(record.detect_time)}</p>
                                    <p><span className="font-medium text-gray-600">Ngày ghi nhận:</span> {formatDate(record.record_date)}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Activity size={16} className="text-green-600" />
                                    Chẩn đoán & Điều trị
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium text-gray-600">Chẩn đoán:</span> {record.diagnosis || 'Chưa có chẩn đoán'}</p>
                                    <p><span className="font-medium text-gray-600">Xử lý tại chỗ:</span> {record.on_site_treatment || 'Không có'}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <MapPin size={16} className="text-red-600" />
                                    Chuyển viện & Vật tư
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium text-gray-600">Chuyển đến:</span> {record.transferred_to || 'Không chuyển viện'}</p>
                                    <p className="flex items-start gap-2">
                                      <Pill size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
                                      <span>
                                        <span className="font-medium text-gray-600">Vật tư sử dụng:</span><br />
                                        {record.items_usage || 'Không sử dụng'}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Hiển thị {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, filteredRecords.length)} của {filteredRecords.length} hồ sơ
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                Trước
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthRecord;