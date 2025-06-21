import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VaccineCampaignsInfo from "./VaccineCampaignsInfo";
import VaccineRecordsInfo from "./VaccineRecordsInfo";

const VaccineInfo = () => {
  const [currChild, setCurrChild] = useState(null);
  const [activeTab, setActiveTab] = useState("campaigns");
  const navigate = useNavigate();

  useEffect(() => {
    const child = JSON.parse(localStorage.getItem('selectedChild'));
    if (child) setCurrChild(child);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "campaigns"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("campaigns")}
          >
            Chiến dịch tiêm chủng
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "records"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("records")}
          >
            Lịch sử tiêm chủng
          </button>
        </div>
      </div>

      {activeTab === "campaigns" && <VaccineCampaignsInfo currChild={currChild} navigate={navigate} />}
      {activeTab === "records" && <VaccineRecordsInfo currChild={currChild}/>}
    </div>
  );
};

export default VaccineInfo;