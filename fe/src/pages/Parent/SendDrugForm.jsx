import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import axiosClient from "../../config/axiosClient";
import { getUser } from "../../service/authService";
import { useNavigate } from "react-router-dom";
import { getChildClass } from "../../service/childenService";

const SendDrugForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: "",
    create_by: "",
    diagnosis: "",
    schedule_send_date: "",
    intake_date: "",
    note: "",
    status: "PROCESSING",
    request_items: [{ name: "", intake_template_time: "", dosage_usage: "" }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currChild, setCurrChild] = useState({});
  const [currUser, setCurrUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const user = getUser();
      if (!user?.id) {
        setError("Vui lòng đăng nhập để gửi đơn thuốc.");
        return;
      }
      setCurrUser(user);

      const selectedChild = localStorage.getItem("selectedChild");
      if (!selectedChild) {
        setError("Vui lòng chọn một đứa trẻ để gửi đơn thuốc.");
        return;
      }
      const child = JSON.parse(selectedChild);
      setCurrChild(child);

      setFormData((prev) => ({
        ...prev,
        student_id: child.id || "",
        create_by: user?.id || "",
      }));
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestItemChange = (index, e) => {
    const { name, value } = e.target;
    const newRequestItems = [...formData.request_items];
    newRequestItems[index][name] = value;
    setFormData((prev) => ({ ...prev, request_items: newRequestItems }));
  };

  const handleAddRequestItem = () => {
    setFormData((prev) => ({
      ...prev,
      request_items: [
        ...prev.request_items,
        { name: "", intake_template_time: "", dosage_usage: "Chưa nhập" },
      ],
    }));
  };

  const handleRemoveRequestItem = (index) => {
    if (formData.request_items.length > 1) {
      const newRequestItems = formData.request_items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, request_items: newRequestItems }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.student_id || !formData.create_by) {
      setError("Thông tin học sinh hoặc người gửi không hợp lệ.");
      setIsLoading(false);
      return;
    }

    if (!formData.schedule_send_date || !formData.intake_date) {
      setError("Vui lòng nhập đầy đủ ngày hẹn gửi và ngày uống thuốc.");
      setIsLoading(false);
      return;
    }

    // Validate request items
    const validRequestItems = formData.request_items
      .filter((item) => item.name.trim())
      .map((item) => ({
        name: item.name.trim(),
        intake_template_time: item.intake_template_time,
        dosage_usage: item.dosage_usage.trim() || "Chưa nhập",
      }));

    if (validRequestItems.length === 0) {
      setError("Vui lòng nhập ít nhất một loại thuốc hợp lệ.");
      setIsLoading(false);
      return;
    }

    const dataToSend = {
      student_id: formData.student_id,
      create_by: formData.create_by,
      diagnosis: formData.diagnosis || "Chưa nhập",
      schedule_send_date: formData.schedule_send_date,
      intake_date: formData.intake_date,
      note: formData.note || null,
      request_items: validRequestItems,
    };

    try {
      const response = await axiosClient.post("/send-drug-request", dataToSend);
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      alert("Gửi đơn thuốc thành công!");
      navigate(`/parent/edit/${currChild.id}/drug-table`);
    } catch (error) {
      console.error("Error submitting drug request:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Không thể gửi đơn thuốc. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [childClass, setChildClass] = useState();

  useEffect(() => {
    const fetchClass = async () => {
      const clas = await getChildClass();
      setChildClass(clas);
      console.log("CLASS: ", clas);
    }
    fetchClass();
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Đơn Thuốc Học Sinh</h1>
            <p className="text-gray-600 mt-1">Vui lòng điền đầy đủ thông tin dưới đây</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
            {/* Thông tin học sinh */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Thông tin học sinh</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="hidden">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID học sinh
                  </label>
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên học sinh
                    </label>
                    <input
                      type="text"
                      value={currChild?.name || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lớp
                    </label>
                    <input
                      type="text"
                      value={childClass?.class_name || "Chưa có thông tin"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Thông tin người gửi */}
            <section className="hidden">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Thông tin người gửi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID người gửi
                  </label>
                  <input
                    type="text"
                    name="create_by"
                    value={formData.create_by}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên người gửi
                  </label>
                  <input
                    type="text"
                    value={currUser?.name || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    disabled
                  />
                </div>
              </div>
            </section>

            {/* Thông tin đơn thuốc */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Thông tin đơn thuốc</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chẩn đoán bệnh
                  </label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    placeholder="Nhập chẩn đoán bệnh..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày hẹn gửi thuốc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="schedule_send_date"
                      value={formData.schedule_send_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày cho uống thuốc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="intake_date"
                      value={formData.intake_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú
                    </label>
                    <input
                      type="text"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Ghi chú thêm..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <input
                      type="text"
                      value={formData.status}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Danh sách thuốc */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Danh sách thuốc</h2>
                <button
                  type="button"
                  onClick={handleAddRequestItem}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm thuốc
                </button>
              </div>

              <div className="space-y-4">
                {formData.request_items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900">Thuốc #{index + 1}</h3>
                      {formData.request_items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRequestItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên thuốc <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={item.name}
                          onChange={(e) => handleRequestItemChange(index, e)}
                          placeholder="Nhập tên thuốc"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cách sử dụng <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="dosage_usage"
                            value={item.dosage_usage}
                            onChange={(e) => handleRequestItemChange(index, e)}
                            placeholder="VD: Uống 1 viên/lần"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thời gian uống <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="intake_template_time"
                            value={item.intake_template_time}
                            onChange={(e) => handleRequestItemChange(index, e)}
                            placeholder="VD: 8h, 12h, 18h"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/drug-table")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang gửi..." : "Gửi đơn thuốc"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendDrugForm;