import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, FileText, Plus, Check, ArrowLeft } from 'lucide-react';
import axiosClient from '../../config/axiosClient';

const AddRegularCheckupCampaign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    specialist_exam_ids: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Specialist exam types from your data
  const specialistExams = [
    { id: 1, name: "Khám sinh dục", description: "Đánh giá sức khỏe sinh dục, đặc biệt ở lứa tuổi dậy thì." },
    { id: 2, name: "Khám tâm lý", description: "Tư vấn tâm lý học đường, hỗ trợ điều chỉnh cảm xúc, hành vi." },
    { id: 3, name: "Khám tâm thần", description: "Phát hiện các rối loạn tâm thần, cần bác sĩ chuyên khoa can thiệp." },
    { id: 4, name: "Khám xâm lấn", description: "Các thủ thuật có can thiệp trực tiếp vào cơ thể như lấy máu xét nghiệm, tiêm phòng, sinh thiết." }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExamToggle = (examId) => {
    setFormData(prev => ({
      ...prev,
      specialist_exam_ids: prev.specialist_exam_ids.includes(examId)
        ? prev.specialist_exam_ids.filter(id => id !== examId)
        : [...prev.specialist_exam_ids, examId]
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Tên chiến dịch không được để trống";
    if (!formData.description.trim()) return "Mô tả không được để trống";
    if (!formData.location.trim()) return "Địa điểm không được để trống";
    if (!formData.start_date) return "Ngày bắt đầu không được để trống";
    if (!formData.end_date) return "Ngày kết thúc không được để trống";
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      return "Ngày kết thúc phải sau ngày bắt đầu";
    }
    if (formData.specialist_exam_ids.length === 0) {
      return "Vui lòng chọn ít nhất một loại khám chuyên khoa";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axiosClient.post('/checkup-campaign', formData);

      if (response.error) {
        setMessage({ type: 'error', text: response.message });
      } else {
        setMessage({ type: 'success', text: 'Tạo chiến dịch khám sức khỏe thành công!' });
        // Reset form
        setFormData({
          name: '',
          description: '',
          location: '',
          start_date: '',
          end_date: '',
          specialist_exam_ids: []
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi tạo chiến dịch. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div class Centennial="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <button
          type="button"
          className="mb-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          onClick={() => navigate('/admin/regular-checkup')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay Lại
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tạo Chiến Dịch Khám Sức Khỏe
        </h1>
        <p className="text-gray-600">
          Tạo chiến dịch khám sức khỏe định kỳ cho học sinh
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <FileText className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Thông Tin Cơ Bản
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Chiến Dịch *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên chiến dịch khám sức khỏe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Địa Điểm *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập địa điểm tổ chức"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô Tả *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mô tả chi tiết về chiến dịch khám sức khỏe"
            />
          </div>
        </div>

        {/* Date Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Thời Gian Tổ Chức
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày Bắt Đầu *
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.start_date && (
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(formData.start_date)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày Kết Thúc *
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.end_date && (
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(formData.end_date)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Specialist Exams */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Loại Khám Chuyên Khoa *
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Chọn các loại khám chuyên khoa sẽ được thực hiện trong chiến dịch này
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialistExams.map((exam) => (
              <div
                key={exam.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  formData.specialist_exam_ids.includes(exam.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleExamToggle(exam.id)}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 flex items-center justify-center ${
                    formData.specialist_exam_ids.includes(exam.id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {formData.specialist_exam_ids.includes(exam.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {exam.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {exam.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formData.specialist_exam_ids.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                Đã chọn {formData.specialist_exam_ids.length} loại khám chuyên khoa
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              setFormData({
                name: '',
                description: '',
                location: '',
                start_date: '',
                end_date: '',
                specialist_exam_ids: []
              });
              setMessage({ type: '', text: '' });
            }}
          >
            Đặt Lại
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang Tạo...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Tạo Chiến Dịch
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRegularCheckupCampaign;