import React, { useState, useEffect } from 'react';
import { FileText, Plus, X } from 'lucide-react';
import axiosClient from '../../config/axiosClient';

const VaccineAdd = ({ vaccine, onClose }) => {
  const [formData, setFormData] = useState({
    name: vaccine ? vaccine.name : '',
    description: vaccine ? vaccine.description : '',
    disease_name: vaccine ? vaccine.disease_name : '',
  });
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [diseaseLoading, setDiseaseLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch diseases for dropdown
  useEffect(() => {
    const fetchDiseases = async () => {
      setDiseaseLoading(true);
      try {
        const response = await axiosClient.get('/diseases');
        setDiseases(response.data); // Backend returns array of { id, name, ... }
      } catch (error) {
        {error &&setMessage({ type: 'error', text: 'Lỗi khi lấy danh sách bệnh.' })};
      } finally {
        setDiseaseLoading(false);
      }
    };
    fetchDiseases();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Tên vaccine không được để trống';
    if (!formData.description.trim()) return 'Mô tả không được để trống';
    if (!formData.disease_name) return 'Vui lòng chọn một bệnh';
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
      const response = await axiosClient.post('/vaccine', formData);
      if (response.data.error) {
        setMessage({ type: 'error', text: response.data.message });
      } else {
        setMessage({ type: 'success', text: 'Tạo vaccine thành công!' });
        setFormData({ name: '', description: '', disease_name: '' });
        setTimeout(onClose, 1500); // Close form after success
      }
    } catch (error) {
      {error && setMessage({ type: 'error', text: 'Có lỗi xảy ra khi tạo vaccine. Vui lòng thử lại.' })};
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          {vaccine ? 'Chỉnh sửa Vaccine' : 'Thêm Vaccine Mới'}
        </h2>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            {message.text}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tên Vaccine *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
            placeholder="Nhập tên vaccine"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mô Tả *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
            placeholder="Nhập mô tả chi tiết về vaccine"
          />
        </div>

        {/* Disease Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bệnh *
          </label>
          {diseaseLoading ? (
            <div className="flex items-center p-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-slate-600">Đang tải danh sách bệnh...</span>
            </div>
          ) : diseases.length === 0 ? (
            <div className="text-red-700">Không có bệnh nào được tìm thấy.</div>
          ) : (
            <select
              name="disease_name"
              value={formData.disease_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
            >
              <option value="">Chọn một bệnh</option>
              {diseases.map((disease) => (
                <option key={disease.id} value={disease.name}>
                  {disease.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={loading || diseaseLoading}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                {vaccine ? 'Cập nhật Vaccine' : 'Thêm Vaccine'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaccineAdd;