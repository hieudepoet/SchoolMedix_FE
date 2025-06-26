import React, { useState } from "react";
import axiosClient from "../../config/axiosClient";

const SpecialistExamAdd = ({ exam, onClose }) => {
  const [name, setName] = useState(exam?.name || "");
  const [description, setDescription] = useState(exam?.description || "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (exam) {
        // Update existing exam
        await axiosClient.patch(`/special-exam/${exam.id}`, { name, description });
      } else {
        // Create new exam
        await axiosClient.post("/special-exam", { name, description });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi lưu chuyên khoa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">
        {exam ? "Sửa Chuyên khoa" : "Thêm Chuyên khoa Mới"}
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Tên chuyên khoa</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-900"
              placeholder="Nhập tên chuyên khoa"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-900"
              placeholder="Nhập mô tả chuyên khoa"
              rows="4"
              required
            ></textarea>
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Đang lưu..." : exam ? "Cập nhật" : "Thêm mới"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpecialistExamAdd;