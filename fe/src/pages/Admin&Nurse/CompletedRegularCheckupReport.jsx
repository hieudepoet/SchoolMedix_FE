import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../config/axiosClient";
import { ArrowLeft } from "lucide-react";

const CompletedRegularCheckupReport = () => {
  const [generalHealthList, setGeneralHealthList] = useState([]);
  const [specialistList, setSpecialistList] = useState([]);
  const [activeTab, setActiveTab] = useState("Khám tổng quát");
  const { checkup_id } = useParams();
  const navigate = useNavigate();

  const tabs = [
    "Khám tổng quát",
    "Khám sinh dục",
    "Khám tâm lý",
    "Khám tâm thần",
    "Khám xâm lấn",
  ];

  const fetchGeneralList = async () => {
    try {
      const res = await axiosClient.get(`/health-record/campaign/${checkup_id}`);
      console.log("GENERAL LIST: ", res.data.data);
      setGeneralHealthList(res.data.data);
    } catch (error) {
      console.error("Error fetching general list:", error);
    }
  };

  const fetchSpecialist = async () => {
    try {
      const res = await axiosClient.get(`/campaign/${checkup_id}/specialist-exam/record`);
      console.log("SPECIALIST: ", res.data.data);
      setSpecialistList(res.data.data);
    } catch (error) {
      console.error("Error fetching specialist:", error);
    }
  };

  useEffect(() => {
    fetchGeneralList();
    fetchSpecialist();
  }, [checkup_id]);

  const getStatusBadge = (status) => {
    return status === "DONE" ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Hoàn thành
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Không khám
      </span>
    );
  };

  const renderHealthTable = (records) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã đăng ký
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên học sinh
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lớp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((item) => (
            <tr key={item.register_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{item.register_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.student_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.class_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(item.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {records.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Không có dữ liệu</p>
        </div>
      )}
    </div>
  );

  const getTabData = (tabName) => {
    if (tabName === "Khám tổng quát") {
      return { records: generalHealthList };
    }
    const specialistData = specialistList.find((item) => item.name === tabName) || {
      records: [],
    };
    return { records: specialistData.records };
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => navigate("/nurse/regular-checkup")}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </button>
      </div>

      {/* Tab Header */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{activeTab}</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tổng số: {getTabData(activeTab).records.length} học sinh
          </p>
        </div>
        {renderHealthTable(getTabData(activeTab).records)}
      </div>
    </div>
  );
};

export default CompletedRegularCheckupReport;