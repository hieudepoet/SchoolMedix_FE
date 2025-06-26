import React, { useState, useEffect } from 'react';
import axiosClient from '../../config/axiosClient';

const AddDiseaseRecord = ({ onClose }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    disease_id: '',
    diagnosis: '',
    detect_date: '',
    cure_date: '',
    location_cure: '',
    transferred_to: '',
    status: ''
  });
  const [diseases, setDiseases] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await axiosClient.get('/diseases');
        if (response.data && response.data.length > 0) {
          setDiseases(response.data);
        } else {
          setError('Không thể tải danh sách bệnh: Không có dữ liệu');
        }
      } catch (err) {
        setError('Lỗi server khi tải danh sách bệnh: ' + err.message);
      }
    };
    fetchDiseases();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_id || !formData.disease_id || !formData.detect_date) {
      setError('Vui lòng điền đầy đủ mã học sinh, mã bệnh và ngày phát hiện');
      return;
    }
    try {
      const response = await axiosClient.post(`student/${formData.student_id}/disease-record`, {
        disease_id: formData.disease_id,
        diagnosis: formData.diagnosis,
        detect_date: formData.detect_date,
        cure_date: formData.cure_date,
        location_cure: formData.location_cure,
        transferred_to: formData.transferred_to,
        status: formData.status
      });
      console.log(response);
      if (!response.data.error) {
        setSuccess('Thêm hồ sơ bệnh thành công');
        setFormData({
          student_id: '',
          disease_id: '',
          diagnosis: '',
          detect_date: '',
          cure_date: '',
          location_cure: '',
          transferred_to: '',
          status: ''
        });
        setTimeout(onClose, 2000); // Close after 2 seconds
      } else {
        setError('Không thể thêm hồ sơ bệnh: ' + (response.data.message || ''));
      }
    } catch (err) {
      setError('Lỗi server khi thêm hồ sơ bệnh: ' + err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Thêm Hồ Sơ Bệnh</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="student_id"
          value={formData.student_id}
          onChange={handleInputChange}
          placeholder="Mã Học Sinh"
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          name="disease_id"
          value={formData.disease_id}
          onChange={handleInputChange}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Chọn bệnh</option>
          {diseases.map(disease => (
            <option key={disease.id} value={disease.id}>{disease.name}</option>
          ))}
        </select>
        <input
          type="text"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleInputChange}
          placeholder="Chẩn Đoán"
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          name="detect_date"
          value={formData.detect_date}
          onChange={handleInputChange}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="date"
          name="cure_date"
          value={formData.cure_date}
          onChange={handleInputChange}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="location_cure"
          value={formData.location_cure}
          onChange={handleInputChange}
          placeholder="Nơi Điều Trị"
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="transferred_to"
          value={formData.transferred_to}
          onChange={handleInputChange}
          placeholder="Chuyển Đến"
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Chọn trạng thái</option>
          <option value="UNDER_TREATMENT">Đang điều trị</option>
          <option value="RECOVERED">Đã khỏi</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Lưu Hồ Sơ
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Hủy
        </button>
      </form>
      {success && <div className="mt-4 text-green-500">{success}</div>}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
};

export default AddDiseaseRecord;