import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Filter,
  Download,
  Upload,
  Shield,
  Users,
  GraduationCap
} from 'lucide-react';
import axiosClient from '../../config/axiosClient';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { getUserRole } from '../../service/authService';

// Thành phần hiển thị thông tin người dùng (tái sử dụng)
const UserInfo = ({ user, role, isDetailModal = false }) => (
  <div className="space-y-2 text-sm">
    {user.profile_img_url && (
      <img
        src={user.profile_img_url}
        alt="Avatar"
        className="w-20 h-20 rounded-full mx-auto mb-4"
      />
    )}
    <p><b>Họ tên:</b> {user.name}</p>
    <p><b>Email:</b> {user.email || 'Không có'}</p>
    <p><b>Giới tính:</b> {user.isMale ? 'Nam' : 'Nữ'}</p>
    <p><b>Ngày sinh:</b> {new Date(user.dob).toLocaleDateString()}</p>
    <p><b>Địa chỉ:</b> {user.address}</p>
    <p><b>SĐT:</b> {user.phone_number || 'Không có'}</p>
    <p><b>Email xác nhận:</b> {user.email_confirmed ? 'Có' : 'Không'}</p>
    {role === 'student' && (
      <>
        <p><b>Năm nhập học:</b> {user.year_of_enrollment}</p>
        <p><b>Lớp:</b> {user.class_name}</p>
        {isDetailModal && (
          <>
            <h3 className="font-medium mt-4">Phụ huynh:</h3>
            <div>
              {user.mom_profile && <p><b>Mẹ:</b> {user.mom_profile.name}</p>}
              {user.dad_profile && <p><b>Bố:</b> {user.dad_profile.name}</p>}
            </div>
          </>
        )}
      </>
    )}
    {role === 'parent' && isDetailModal && (
      <>
        <h3 className="font-medium mt-4">Danh sách con:</h3>
        <ul className="list-disc pl-5">
          {user.students?.map(child => (
            <li key={child.id}>{child.name} - {child.class_name}</li>
          ))}
        </ul>
      </>
    )}
  </div>
);

const UserManagement = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    activeTab: 'admin',
    searchTerm: '',
    emailConfirmedFilter: '',
    users: { admin: [], nurse: [], parent: [], student: [] },
    loading: false,
    showDeleteModal: false,
    showDetailModal: false,
    selectedUserDetail: null,
  });

  // Hàm tiện ích để cập nhật trạng thái
  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

  const tabs = [
    { key: 'admin', label: 'Quản trị viên', icon: Shield, count: state.users.admin.length },
    { key: 'nurse', label: 'Y tá', icon: null, count: state.users.nurse.length },
    { key: 'parent', label: 'Phụ huynh', icon: Users, count: state.users.parent.length },
    { key: 'student', label: 'Học sinh', icon: GraduationCap, count: state.users.student.length },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      updateState({ loading: true });
      try {
        const [adminRes, nurseRes, parentRes, studentRes] = await Promise.all([
          axiosClient.get('/admin'),
          axiosClient.get('/nurse'),
          axiosClient.get('/parent'),
          axiosClient.get('/student'),
        ]);
        updateState({
          users: {
            admin: adminRes.data.data,
            nurse: nurseRes.data.data,
            parent: parentRes.data.data,
            student: studentRes.data.data,
          },
        });
      } catch (error) {
        alert('Lỗi tải dữ liệu: ' + (error.response?.data?.message || error.message));
      } finally {
        updateState({ loading: false });
      }
    };
    fetchUsers();
  }, []);

  const applyFilters = (users) =>
    users.filter(user => {
      const matchesSearch =
        user?.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        user?.phone_number?.includes(state.searchTerm);
      const matchesEmailConfirmed =
        state.emailConfirmedFilter === '' ||
        String(user.email_confirmed) === state.emailConfirmedFilter;
      return matchesSearch && matchesEmailConfirmed;
    });

  const filteredUsers = applyFilters(state.users[state.activeTab] || []);

  console.log("Filtered Users: ", filteredUsers);

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const endpoint = currentStatus
        ? `/role/${state.activeTab}/user/${userId}/unconfirm-email`
        : `/role/${state.activeTab}/user/${userId}/confirm-email`;
      await axiosClient.patch(endpoint);
      updateState({
        users: {
          ...state.users,
          [state.activeTab]: state.users[state.activeTab].map(user =>
            user.id === userId ? { ...user, email_confirmed: !currentStatus } : user
          ),
        },
      });
      alert(`Đã ${currentStatus ? 'hủy xác thực' : 'xác thực'} email`);
    } catch (error) {
      alert('Lỗi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleViewDetail = async (role, id) => {
    try {
      const { data } = await axiosClient.get(`/${role}/${id}`);
      if (!data.error) {
        updateState({ selectedUserDetail: { role, ...data.data }, showDetailModal: true });
      }
    } catch (error) {
      alert('Lỗi lấy chi tiết: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditUser = (user) => navigate(`/${getUserRole()}/edit/${state.activeTab}/${user.id}`);

  const handleDeleteUsers = deletedUserIds => {
    updateState({
      users: {
        ...state.users,
        [state.activeTab]: state.users[state.activeTab].filter(user => !deletedUserIds.includes(user.id)),
      },
      showDeleteModal: false,
    });
  };

  const handleExportCSV = () => {
    const csvData = filteredUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email || 'Không có',
      phone_number: user.phone_number || 'Không có',
      dob: user.dob,
      isMale: user.isMale ? 'Nam' : 'Nữ',
      address: user.address,
      email_confirmed: user.email_confirmed ? 'Có' : 'Không',
      ...(state.activeTab === 'student' && {
        class_name: user.class_name,
        year_of_enrollment: user.year_of_enrollment,
      }),
    }));
    const csv = Papa.unparse(csvData);
    saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `${state.activeTab}_users.csv`);
  };

  const handleImportCSV = async event => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async result => {
        try {
          const endpoint = { admin: '/admin', nurse: '/nurse', parent: '/parent', student: '/student' }[
            state.activeTab
          ];
          for (const user of result.data) {
            await axiosClient.post(endpoint, {
              ...user,
              isMale: user.isMale === 'Nam',
              dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : undefined,
            });
          }
          const response = await axiosClient.get(`/${state.activeTab}`);
          updateState({
            users: { ...state.users, [state.activeTab]: response.data.data },
          });
          alert('Nhập dữ liệu thành công');
        } catch (error) {
          alert('Lỗi nhập dữ liệu: ' + (error.response?.data?.message || error.message));
        }
      },
    });
  };

  const renderUserCard = user => (
    <div
      key={user.id}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={user.profile_img_url}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              user.email_confirmed ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-800">{user.name}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  user.email_confirmed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {user.email_confirmed ? 'Xác thực' : 'Chưa xác thực'}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleViewDetail(state.activeTab, user.id)}
                className="p-1 text-gray-500 hover:text-blue-600 rounded"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => handleEditUser(user)}
                className="p-1 text-gray-500 hover:text-green-600 rounded"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleStatusToggle(user.id, user.email_confirmed)}
                className="p-1 text-gray-500 hover:text-blue-600 rounded"
              >
                {user.email_confirmed ? <UserX size={16} /> : <UserCheck size={16} />}
              </button>
              <button
                onClick={() => updateState({ showDeleteModal: [user] })}
                className="p-1 text-gray-500 hover:text-red-600 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
            <div>
              <p className="text-gray-600"><span className="font-medium">ID:</span> {user.id}</p>
              <p className="text-gray-600"><span className="font-medium">Email:</span> {user.email || 'Không có'}</p>
              <p className="text-gray-600"><span className="font-medium">SĐT:</span> {user.phone_number || 'Không có'}</p>
            </div>
            <div>
              {state.activeTab === 'parent' && (
                <p className="text-gray-600"><span className="font-medium">Số con:</span> {user.students?.length || 0}</p>
              )}
              {state.activeTab === 'student' && (
                <>
                  <p className="text-gray-600"><span className="font-medium">Mã HS:</span> {user.id}</p>
                  <p className="text-gray-600"><span className="font-medium">Lớp:</span> {user.class_name}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const activeTabData = tabs.find(tab => tab.key === state.activeTab);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Quản Lý Người Dùng</h1>
          <p className="text-gray-600 text-sm">Quản lý thông tin người dùng trong hệ thống tiêm chủng</p>
        </div>

        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <Download size={16} /> Xuất CSV
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer">
            <Upload size={16} /> Nhập CSV
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => updateState({ activeTab: tab.key })}
              className={`p-4 bg-white border rounded-lg text-left ${
                state.activeTab === tab.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-600">{tab.icon && <tab.icon size={20} />}</div>
                <div>
                  <h3 className="text-base font-medium text-gray-800">{tab.label}</h3>
                  <p className="text-sm text-gray-500">{tab.count} người dùng</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Tổng số</p>
            <p className="text-xl font-semibold text-gray-800">{filteredUsers.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Đã xác thực</p>
            <p className="text-xl font-semibold text-gray-800">
              {filteredUsers.filter(user => user.email_confirmed).length}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Tìm kiếm ${activeTabData.label.toLowerCase()}...`}
              value={state.searchTerm}
              onChange={e => updateState({ searchTerm: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <select
                value={state.emailConfirmedFilter}
                onChange={e => updateState({ emailConfirmedFilter: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đã xác thực</option>
                <option value="false">Chưa xác thực</option>
              </select>
            </div>
            <button
              onClick={() => navigate(`/${getUserRole()}/create/${state.activeTab}`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} /> Thêm {activeTabData.label}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {state.loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600"></div>
              <p className="mt-2">Đang tải...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>
                {state.searchTerm || state.emailConfirmedFilter
                  ? 'Không tìm thấy kết quả'
                  : `Chưa có ${activeTabData.label.toLowerCase()}`}
              </p>
              <button
                onClick={() => navigate(`/${getUserRole()}/create/${state.activeTab}`)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thêm {activeTabData.label}
              </button>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {filteredUsers.map(renderUserCard)}
            </div>
          )}
        </div>

        {state.showDeleteModal && (
          <DeleteConfirmModal
            users={state.showDeleteModal}
            role={state.activeTab}
            onClose={() => updateState({ showDeleteModal: false })}
            onDelete={handleDeleteUsers}
          />
        )}
        {state.showDetailModal && state.selectedUserDetail && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Chi tiết {state.selectedUserDetail.role}</h2>
              <UserInfo user={state.selectedUserDetail} role={state.selectedUserDetail.role} isDetailModal={true} />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => updateState({ showDetailModal: false })}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
