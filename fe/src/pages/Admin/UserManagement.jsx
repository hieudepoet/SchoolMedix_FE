import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Users,
  Heart,
  GraduationCap,
  Shield,
  ChevronDown,
  Settings
} from 'lucide-react';
import axiosClient from '../../config/axiosClient';

const UserManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({});
  const [activeTab, setActiveTab] = useState('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState({
    admin: [],
    nurse: [],
    parent: [],
    student: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedImgFile, setSelectedImgFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const [adminRes, nurseRes, parentRes, studentRes] = await Promise.all([
          axiosClient.get("/admin"),
          axiosClient.get("/nurse"),
          axiosClient.get("/parent"),
          axiosClient.get("/student"),
        ]);

        setUsers({
          admin: adminRes.data.data,
          nurse: nurseRes.data.data,
          parent: parentRes.data.data,
          student: studentRes.data.data,
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const tabs = [
    {
      key: 'admin',
      label: 'Admin',
      icon: Heart,
      count: users.admin.length,
      color: 'red',
      description: 'Quản lý admin'
    },
    {
      key: 'nurse',
      label: 'Y tá',
      icon: Heart,
      count: users.nurse.length,
      color: 'blue',
      description: 'Quản lý nhân viên y tế'
    },
    {
      key: 'parent',
      label: 'Phụ huynh',
      icon: Users,
      count: users.parent.length,
      color: 'purple',
      description: 'Quản lý thông tin phụ huynh'
    },
    {
      key: 'student',
      label: 'Học sinh',
      icon: GraduationCap,
      count: users.student.length,
      color: 'green',
      description: 'Quản lý thông tin học sinh'
    }
  ];

  const filteredUsers = users[activeTab]?.filter(user =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.phone?.includes(searchTerm)
  ) || [];

  const handleStatusToggle = (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setUsers(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    }));
  };

  const handleSelectUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(user => user.id)));
    }
  };
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      let profile_img_url = '';

      // Nếu người dùng có chọn file ảnh
      if (selectedImgFile) {
        const formData = new FormData();
        formData.append('image', selectedImgFile); // 🔥 Đúng tên key ở backend

        const imgUploadRes = await axiosClient.post("/profile-img", formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (imgUploadRes.data?.profile_img_url) {
          profile_img_url = imgUploadRes.data.profile_img_url;
        } else {
          return alert("Upload ảnh thất bại");
        }
      }

      const endpointMap = {
        admin: "/admin",
        nurse: "/nurse",
        parent: "/parent",
        student: "/student",
      };

      const endpoint = endpointMap[activeTab];
      if (!endpoint) return alert("Loại người dùng không hợp lệ");

      const payload = {
        ...newUser,
        profile_img_url,
      };

      const response = await axiosClient.post(endpoint, payload);

      if (!response.data.error) {
        alert(response.data.message || "Tạo thành công");

        setUsers(prev => ({
          ...prev,
          [activeTab]: [...prev[activeTab], response.data.data],
        }));

        setNewUser({});
        setSelectedImgFile(null);
        setShowCreateModal(false);
      } else {
        alert(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi tạo người dùng:", error);
      alert("Lỗi tạo người dùng: " + (error.response?.data?.message || error.message));
    }
  };


  const handleViewDetail = async (role, id) => {
    try {
      const { data, error } = await axiosClient.get(`/${role}/${id}`);
      if (!error) {
        setSelectedUserDetail({ role, ...data?.data });
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin chi tiết:', err);
    }
  };




  const getActiveTab = () => tabs.find(tab => tab.key === activeTab);

  const renderUserCard = (user) => {
    const activeTabData = getActiveTab();

    return (
      <div key={user.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar & Selection */}
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedUsers.has(user.id)}
                onChange={() => handleSelectUser(user.id)}
                className="absolute -top-1 -left-1 w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div className="relative">
                <img
                  src={user.profile_img_url}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.email_confirmed === true ? 'bg-green-500' : 'bg-red-500'
                  }`} />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.email_confirmed === true
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {user.email_confirmed === true ? 'Xác thực' : 'Chưa xác thực'}
                    </span>
                    {(activeTab === 'nurse' || activeTab === 'admin') && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Shield className="w-3 h-3 mr-1" />
                        {user.position}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Menu */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleViewDetail(activeTab, user.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleStatusToggle(user.id, user.email_confirmed)}
                    className={`p-2 rounded-lg transition-all ${user.email_confirmed === true
                      ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                  >
                    {user.email_confirmed === true ? <UserX size={16} /> : <UserCheck size={16} />}
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <span className="w-16 font-medium">ID:</span>
                    <span className="text-gray-900 truncate">{user.id}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-16 font-medium">Email:</span>
                    <span className="text-gray-900 truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-16 font-medium">SĐT:</span>
                    <span className="text-gray-900">{user.phone_number || "Không có"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* {activeTab === 'nurse' && (
                    <>
                      <div className="flex items-center text-gray-600">
                        <span className="w-20 font-medium">Khoa:</span>
                        <span className="text-gray-900">{user.department}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="w-20 font-medium">Kinh nghiệm:</span>
                        <span className="text-gray-900">{user.experience}</span>
                      </div>
                    </>
                  )} */}

                  {activeTab === 'parent' && (
                    <>
                      {/* <div className="flex items-center text-gray-600">
                        <span className="w-20 font-medium">Nghề nghiệp:</span>
                        <span className="text-gray-900">{user.occupation}</span>
                      </div> */}
                      <div className="flex items-center text-gray-600">
                        <span className="w-20 font-medium">Số con:</span>
                        <span className="text-gray-900">{user?.students?.length || 0} học sinh</span>
                      </div>
                    </>
                  )}

                  {console.log("user: ", user)}
                  {activeTab === 'student' && (
                    <>
                      <div className="flex items-center text-gray-600">
                        <span className="w-20 font-medium">Mã HS:</span>
                        <span className="text-gray-900">{user.id}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="w-20 font-medium">Lớp:</span>
                        <span className="text-gray-900">{user.class_name}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer Info */}
              {/* <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <span>Tạo: {user.created_at}</span>
                {user.last_login && <span>Đăng nhập: {user.last_login}</span>}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const activeTabData = getActiveTab();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
              <p className="text-gray-600">Quản lý thông tin y tá, phụ huynh và học sinh trong hệ thống tiêm chủng</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={16} />
                Xuất dữ liệu
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload size={16} />
                Nhập dữ liệu
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative p-6 rounded-xl border-2 transition-all text-left ${isActive
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${isActive ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                        {tab.label}
                      </h3>
                      <p className={`text-sm ${isActive ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                        {tab.description}
                      </p>
                    </div>
                    <div className={`text-2xl font-bold ${isActive ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                      {tab.count}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng số</p>
                <p className="text-3xl font-bold text-gray-900">{filteredUsers.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <activeTabData.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã xác thực</p>
                <p className="text-3xl font-bold text-green-600">
                  {filteredUsers.filter(user => user.email_confirmed === true).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mới tháng này</p>
                <p className="text-3xl font-bold text-purple-600">
                  {users[activeTab]?.filter(user =>
                    new Date(user.created_at).getMonth() === new Date().getMonth()
                  ).length || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div> */}
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`Tìm kiếm ${activeTabData.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter size={16} />
                Lọc
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {selectedUsers.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Đã chọn {selectedUsers.size} người dùng
                  </span>
                  <button className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    Xóa đã chọn
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all"
              >
                <Plus size={16} />
                Thêm {activeTabData.label}
              </button>

            </div>
          </div>

          {/* Bulk Actions */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedUsers.size === filteredUsers.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                Chọn tất cả ({filteredUsers.length})
              </label>

              <div className="text-sm text-gray-500">
                Hiển thị {filteredUsers.length} trên tổng số {users[activeTab]?.length} {activeTabData.label.toLowerCase()}
              </div>
            </div>
          )}
        </div>

        {/* User List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <activeTabData.icon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Không tìm thấy kết quả' : `Chưa có ${activeTabData.label.toLowerCase()}`}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                  : `Bắt đầu bằng cách thêm ${activeTabData.label.toLowerCase()} đầu tiên`
                }
              </p>
              {!searchTerm && (
                <button className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={16} />
                  Thêm {activeTabData.label}
                </button>
              )}
            </div>
          ) : (
            filteredUsers.map(user => renderUserCard(user))
          )}
        </div>
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Tạo {activeTabData.label}</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Upload ảnh */}
              <input
                className="w-full border p-2 rounded"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setSelectedImgFile(file);

                  // Preview
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setImagePreview(reader.result);
                    reader.readAsDataURL(file);
                  } else {
                    setImagePreview(null);
                  }
                }}
              />

              {/* Hiển thị ảnh xem trước nếu có */}
              {imagePreview && (
                <div className="flex justify-center mb-4">
                  <img
                    src={imagePreview}
                    alt="Avatar Preview"
                    className="w-28 h-28 rounded-full object-cover shadow"
                  />
                </div>
              )}

              {/* Tên */}
              <input
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Họ và tên"
                required
                value={newUser.name || ''}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              />

              {/* Email - bắt buộc với admin, nurse, parent */}
              {(activeTab !== 'student') && (
                <input
                  className="w-full border p-2 rounded"
                  type="email"
                  placeholder="Email"
                  required
                  value={newUser.email || ''}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                />
              )}

              {/* Ngày sinh */}
              <input
                className="w-full border p-2 rounded"
                type="date"
                placeholder="Ngày sinh"
                required
                value={newUser.dob || ''}
                onChange={(e) => setNewUser(prev => ({ ...prev, dob: e.target.value }))}
              />

              {/* Giới tính */}
              <select
                className="w-full border p-2 rounded"
                required
                value={newUser.gender || ''}
                onChange={(e) => setNewUser(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>

              {/* Địa chỉ */}
              <input
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Địa chỉ"
                required
                value={newUser.address || ''}
                onChange={(e) => setNewUser(prev => ({ ...prev, address: e.target.value }))}
              />

              {/* Số điện thoại */}
              <input
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Số điện thoại"
                value={newUser.phone_number || ''}
                onChange={(e) => setNewUser(prev => ({ ...prev, phone_number: e.target.value }))}
              />

              {activeTab === 'student' && (
                <>
                  {/* Email cho học sinh */}
                  <input
                    className="w-full border p-2 rounded"
                    type="email"
                    placeholder="Email"
                    required
                    value={newUser.email || ''}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  />

                  <input
                    className="w-full border p-2 rounded"
                    type="text"
                    placeholder="ID lớp học"
                    required
                    value={newUser.class_id || ''}
                    onChange={(e) => setNewUser(prev => ({ ...prev, class_id: e.target.value }))}
                  />
                  <input
                    className="w-full border p-2 rounded"
                    type="number"
                    placeholder="Năm nhập học"
                    required
                    value={newUser.year_of_enrollment || ''}
                    onChange={(e) => setNewUser(prev => ({ ...prev, year_of_enrollment: e.target.value }))}
                  />
                  <input
                    className="w-full border p-2 rounded"
                    type="text"
                    placeholder="ID mẹ (nếu có)"
                    value={newUser.mom_id || ''}
                    onChange={(e) => setNewUser(prev => ({ ...prev, mom_id: e.target.value }))}
                  />
                  <input
                    className="w-full border p-2 rounded"
                    type="text"
                    placeholder="ID bố (nếu có)"
                    value={newUser.dad_id || ''}
                    onChange={(e) => setNewUser(prev => ({ ...prev, dad_id: e.target.value }))}
                  />
                </>
              )}

              {/* Nút tạo */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Tạo mới
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {showDetailModal && selectedUserDetail && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Thông tin chi tiết ({selectedUserDetail.role})</h2>
            <div className="space-y-2">
              {selectedUserDetail.profile_img_url && (
                <div className="flex justify-center mb-4">
                  <img
                    src={selectedUserDetail.profile_img_url}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover shadow"
                  />
                </div>
              )}
              <p><b>Họ tên:</b> {selectedUserDetail.name}</p>
              <p><b>Email:</b> {selectedUserDetail.email}</p>
              <p><b>Giới tính:</b> {selectedUserDetail.gender}</p>
              <p><b>Ngày sinh:</b> {new Date(selectedUserDetail.dob).toLocaleDateString()}</p>
              <p><b>Địa chỉ:</b> {selectedUserDetail.address}</p>
              <p><b>SĐT:</b> {selectedUserDetail.phone_number}</p>
              <p><b>Email đã xác nhận:</b> {selectedUserDetail.email_confirmed ? '✅' : '❌'}</p>
              {selectedUserDetail.year_of_enrollment && (
                <p><b>Năm nhập học:</b> {selectedUserDetail.year_of_enrollment}</p>
              )}
              {selectedUserDetail.class_name && (
                <p><b>Lớp:</b> {selectedUserDetail.class_name}</p>
              )}

              {/* Nếu là phụ huynh */}
              {selectedUserDetail.role === 'parent' && (
                <>
                  <h3 className="font-semibold mt-4">Danh sách con:</h3>
                  <ul className="list-disc pl-5">
                    {selectedUserDetail.children.map(child => (
                      <li key={child.id}>{child.name} - {child.class_name}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Nếu là học sinh */}
              {selectedUserDetail.role === 'student' && (
                <>
                  <h3 className="font-semibold mt-4">Thông tin phụ huynh:</h3>
                  <div className="text-sm">
                    {selectedUserDetail.mom_profile && (
                      <p><b>Mẹ:</b> {selectedUserDetail.mom_profile.name}</p>
                    )}
                    {selectedUserDetail.dad_profile && (
                      <p><b>Bố:</b> {selectedUserDetail.dad_profile.name}</p>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default UserManagement;