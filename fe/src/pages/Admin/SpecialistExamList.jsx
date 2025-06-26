import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import axiosClient from "../../config/axiosClient";

const SpecialistExamList = ({ exams, onEdit }) => {

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chuyên khoa này?")) return;
    try {
      await axiosClient.delete(`/special-exam/${id}`);
      window.location.reload(); // Refresh to refetch data
    } catch (error) {
      alert("Lỗi khi xóa chuyên khoa: " + (error.response?.data?.message || error.message));
      console.log(error.response?.data?.message)
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 grid grid-cols-12 gap-4 text-xs font-medium text-slate-500 uppercase">
        <div className="col-span-2">Mã chuyên khoa</div>
        <div className="col-span-3">Tên chuyên khoa</div>
        <div className="col-span-4">Chi tiết</div>
        <div className="col-span-3 text-center">Thao tác</div>
      </div>

      <div className="divide-y divide-slate-200">
        {exams.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-10 w-10 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có chuyên khoa</h3>
            <p className="text-slate-600">Hệ thống sẽ hiển thị khi có chuyên khoa mới</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="hover:bg-slate-50 transition-colors">
              <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2 font-semibold text-indigo-600">#{exam.id}</div>
                <div className="col-span-3 text-slate-900">{exam.name}</div>
                <div className="col-span-4 text-slate-900">{exam.description}</div>
                <div className="col-span-3 text-center flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(exam)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SpecialistExamList;