import React, { useState, useEffect } from 'react';
import axiosClient from '../../config/axiosClient';
import { useParams } from 'react-router-dom';

const SendVaccineRecord = ({ onClose }) => {
  const { student_id } = useParams();
  const [formData, setFormData] = useState({
    student_id: student_id || "",
    register_id: "",
    disease_id: "",
    vaccine_id: "",
    vaccination_date: "",
    description: "",
    location: "",
    status: ""
  });
  const [vaccines, setVaccines] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await axiosClient.get('/vaccines');
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setVaccines(response.data.data);
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          setVaccines(response.data);
        } else {
          setError('Không thể tải danh sách vaccine: Không có dữ liệu');
        }
      } catch (err) {
        setError('Lỗi server khi tải danh sách vaccine: ' + err.message);
      }
    };
    const fetchDiseases = async () => {
      try {
        const response = await axiosClient.get('/diseases');
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setDiseases(response.data.data);
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          setDiseases(response.data);
        } else {
          setError('Không thể tải danh sách bệnh: Không có dữ liệu');
        }
      } catch (err) {
        setError('Lỗi server khi tải danh sách bệnh: ' + err.message);
      }
    };
    fetchVaccines();
    fetchDiseases();
  }, []);

  // Lọc vaccine theo disease_id đã chọn
  const filteredVaccines = formData.disease_id
    ? vaccines.filter(v => String(v.disease_id) === String(formData.disease_id))
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Nếu chọn lại disease_id thì reset vaccine_id
    if (name === "disease_id") {
      setFormData(prev => ({ ...prev, disease_id: value, vaccine_id: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.student_id ||
      !formData.vaccine_id ||
      !formData.disease_id ||
      !formData.vaccination_date ||
      !formData.status
    ) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    try {
      const payload = {
        student_id: formData.student_id,
        register_id: formData.register_id || null,
        disease_id: formData.disease_id,
        vaccine_id: formData.vaccine_id,
        vaccination_date: formData.vaccination_date,
        description: formData.description,
        location: formData.location,
        status: formData.status
      };
      const response = await axiosClient.post(`vaccination-record`, payload);
      if (!response.data.error) {
        setSuccess('Thêm lịch sử tiêm chủng thành công');
        setFormData({
          student_id: student_id || "",
          register_id: "",
          disease_id: "",
          vaccine_id: "",
          vaccination_date: "",
          description: "",
          location: "",
          status: ""
        });
        setTimeout(onClose, 2000);
      } else {
        setError('Không thể thêm lịch sử tiêm chủng: ' + (response.data.message || ''));
      }
    } catch (err) {
      setError('Lỗi server khi thêm lịch sử tiêm chủng: ' + err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Thêm Lịch Sử Tiêm Chủng</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="student_id"
          value={formData.student_id}
          disabled
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
          required
        />
        <input
          type="number"
          name="register_id"
          value={formData.register_id}
          onChange={handleInputChange}
          placeholder="Mã đăng ký (nếu có)"
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <select
          name="vaccine_id"
          value={formData.vaccine_id}
          onChange={handleInputChange}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={!formData.disease_id}
        >
          <option value="">Chọn vaccine</option>
          {filteredVaccines.map(vaccine => (
            <option key={vaccine.id} value={vaccine.id}>{vaccine.name}</option>
          ))}
        </select>
        <input
          type="date"
          name="vaccination_date"
          value={formData.vaccination_date}
          onChange={handleInputChange}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Địa điểm tiêm"
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Ghi chú"
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
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="MISSED">MISSED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Lưu Lịch Sử
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

export default SendVaccineRecord;