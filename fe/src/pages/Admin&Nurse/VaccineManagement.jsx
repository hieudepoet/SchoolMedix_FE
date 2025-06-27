import React, { useState } from "react";
import { Plus } from "lucide-react";
import useVaccines from "../../hooks/useVaccines";
import VaccineList from "./VaccineList";
import VaccineAdd from "./VaccineAdd";

const VaccineManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editVaccine, setEditVaccine] = useState(null);
  const { vaccines, searchTerm, setSearchTerm, loading, error, refetch } = useVaccines();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">Quản lý Vaccine</h1>
              <p className="text-slate-600 text-base">Theo dõi và quản lý danh sách vaccine</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500">Tổng vaccine</p>
              <p className="text-2xl font-semibold text-slate-900">{vaccines.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Tìm theo tên vaccine"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={() => {
                  setEditVaccine(null);
                  setShowAddForm(true);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium"
              >
                <Plus className="w-5 h-5" />
                Thêm vaccine mới
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center p-12 bg-white rounded-lg border border-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
          </div>
        ) : showAddForm ? (
          <VaccineAdd
            vaccine={editVaccine}
            onClose={() => {
              setShowAddForm(false);
              setEditVaccine(null);
              refetch();
            }}
          />
        ) : (
          <VaccineList
            vaccines={vaccines}
            onEdit={(vaccine) => {
              setEditVaccine(vaccine);
              setShowAddForm(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VaccineManagement;