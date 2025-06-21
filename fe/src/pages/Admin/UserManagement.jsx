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

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('nurse');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState({
    nurse: [],
    parent: [],
    student: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Mock data với nhiều thông tin hơn
  const mockUsers = {
    nurse: [
      { 
        id: 1, 
        name: 'BS. Nguyễn Thị Lan', 
        email: 'lan.nurse@hospital.com', 
        phone: '0901234567', 
        status: 'active', 
        department: 'Khoa Nhi', 
        position: 'Trưởng khoa',
        experience: '8 năm',
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Lan&background=3b82f6&color=fff',
        created_at: '2024-01-15',
        last_login: '2024-06-18 09:30'
      },
      { 
        id: 2, 
        name: 'Y tá Trần Văn Minh', 
        email: 'minh.nurse@hospital.com', 
        phone: '0901234568', 
        status: 'active', 
        department: 'Khoa Truyền nhiễm',
        position: 'Y tá trưởng', 
        experience: '5 năm',
        avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Minh&background=10b981&color=fff',
        created_at: '2024-02-10',
        last_login: '2024-06-18 08:15'
      },
      { 
        id: 3, 
        name: 'Y tá Lê Thị Hoa', 
        email: 'hoa.nurse@hospital.com', 
        phone: '0901234569', 
        status: 'inactive', 
        department: 'Khoa Nhi',
        position: 'Y tá',
        experience: '3 năm',
        avatar: 'https://ui-avatars.com/api/?name=Le+Thi+Hoa&background=f59e0b&color=fff',
        created_at: '2024-01-20',
        last_login: '2024-06-10 16:45'
      }
    ],
    parent: [
      { 
        id: 1, 
        name: 'Phạm Văn Đức', 
        email: 'duc.parent@gmail.com', 
        phone: '0912345678', 
        status: 'active', 
        children_count: 2, 
        address: 'Quận 1, TP.HCM',
        occupation: 'Kỹ sư IT',
        avatar: 'https://ui-avatars.com/api/?name=Pham+Van+Duc&background=8b5cf6&color=fff',
        created_at: '2024-03-01',
        last_login: '2024-06-18 07:20'
      },
      { 
        id: 2, 
        name: 'Nguyễn Thị Mai', 
        email: 'mai.parent@gmail.com', 
        phone: '0912345679', 
        status: 'active', 
        children_count: 1, 
        address: 'Quận 3, TP.HCM',
        occupation: 'Giáo viên',
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Mai&background=ec4899&color=fff',
        created_at: '2024-03-05',
        last_login: '2024-06-17 19:30'
      },
      { 
        id: 3, 
        name: 'Trần Văn Nam', 
        email: 'nam.parent@gmail.com', 
        phone: '0912345680', 
        status: 'inactive', 
        children_count: 3, 
        address: 'Quận 7, TP.HCM',
        occupation: 'Bác sĩ',
        avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Nam&background=6b7280&color=fff',
        created_at: '2024-02-20',
        last_login: '2024-06-05 14:15'
      }
    ],
    student: [
      { 
        id: 1, 
        name: 'Phạm Minh An', 
        email: 'an.student@school.edu.vn', 
        phone: '0923456789', 
        status: 'active', 
        class: 'Lớp 10A1', 
        school: 'THPT Nguyễn Du',
        student_id: 'HS001',
        grade: '10',
        avatar: 'https://ui-avatars.com/api/?name=Pham+Minh+An&background=f97316&color=fff',
        birth_date: '2008-05-15',
        parent_contact: '0912345678'
      },
      { 
        id: 2, 
        name: 'Nguyễn Thị Bình', 
        email: 'binh.student@school.edu.vn', 
        phone: '0923456790', 
        status: 'active', 
        class: 'Lớp 11B2', 
        school: 'THPT Lê Quý Đôn',
        student_id: 'HS002',
        grade: '11',
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Binh&background=06b6d4&color=fff',
        birth_date: '2007-08-20',
        parent_contact: '0912345679'
      },
      { 
        id: 3, 
        name: 'Trần Văn Cường', 
        email: 'cuong.student@school.edu.vn', 
        phone: '0923456791', 
        status: 'inactive', 
        class: 'Lớp 12C1', 
        school: 'THPT Trần Hưng Đạo',
        student_id: 'HS003',
        grade: '12',
        avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Cuong&background=84cc16&color=fff',
        birth_date: '2006-12-10',
        parent_contact: '0912345680'
      }
    ]
  };

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const tabs = [
    { 
      key: 'nurse', 
      label: 'Y tá & Bác sĩ', 
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
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
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
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                    {activeTab === 'nurse' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Shield className="w-3 h-3 mr-1" />
                        {user.position}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Action Menu */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleStatusToggle(user.id, user.status)}
                    className={`p-2 rounded-lg transition-all ${
                      user.status === 'active' 
                        ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
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
                    <span className="w-16 font-medium">Email:</span>
                    <span className="text-gray-900 truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-16 font-medium">SĐT:</span>
                    <span className="text-gray-900">{user.phone}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {activeTab === 'nurse' && (
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
                  )}
                  
                  {activeTab === 'parent' && (
                    <>
                      <div className="flex items-center text-gray-600">
                        <span className="w-20 font-medium">Nghề nghiệp:</span>
                        <span className="text-gray-900">{user.occupation}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="w-20 font-medium">Số con:</span>
                        <span className="text-gray-900">{user.children_count} học sinh</span>
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'student' && (
                    <>
                      <div className="flex items-center text-gray-600">
                        <span className="w-20 font-medium">Mã HS:</span>
                        <span className="text-gray-900">{user.student_id}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="w-20 font-medium">Lớp:</span>
                        <span className="text-gray-900">{user.class}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <span>Tạo: {user.created_at}</span>
                {user.last_login && <span>Đăng nhập: {user.last_login}</span>}
              </div>
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
                  className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${
                        isActive ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {tab.label}
                      </h3>
                      <p className={`text-sm ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {tab.description}
                      </p>
                    </div>
                    <div className={`text-2xl font-bold ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
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
                <p className="text-sm font-medium text-gray-600">Hoạt động</p>
                <p className="text-3xl font-bold text-green-600">
                  {filteredUsers.filter(user => user.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tạm khóa</p>
                <p className="text-3xl font-bold text-red-600">
                  {filteredUsers.filter(user => user.status === 'inactive').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
          </div>
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
              
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all">
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
    </div>
  );
};

export default UserManagement;