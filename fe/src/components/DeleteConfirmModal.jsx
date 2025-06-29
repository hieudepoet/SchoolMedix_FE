import React from 'react';
import axiosClient from '../config/axiosClient';

const DeleteConfirmModal = ({ users, role, onClose, onDelete }) => {
  const restrictedEmails = [
    'mndkhanh@gmail.com',
    'mndkhanh3@gmail.com',
    'coccamco.fpthcm@gmail.com',
    'thuandntse150361@fpt.edu.vn',
    'dinhviethieu2910@gmail.com',
    'toannangcao3000@gmail.com',
    'phamthanhqb2005@gmail.com',
    'dathtse196321@gmail.com',
    'mndkhanh.alt3@gmail.com',
    'mndkhanh.alt@gmail.com',
  ];

  const handleDelete = async () => {
    try {
      const restrictedUsers = users.filter(user => restrictedEmails.includes(user.email));
      if (restrictedUsers.length > 0) {
        alert('Không thể xóa các tài khoản có email: ' + restrictedUsers.map(u => u.email).join(', '));
        return;
      }

      await Promise.all(users.map(user => 
        axiosClient.delete(`/${role}/${user.id}`)
      ));

      onDelete(users.map(u => u.id));
      alert('Xóa thành công!');
      onClose();
    } catch (error) {
      alert('Lỗi khi xóa: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
        <p className="mb-4">
          Bạn có chắc chắn muốn xóa {users.length} {role === 'admin' ? 'quản trị viên' : role === 'nurse' ? 'y tá' : role === 'parent' ? 'phụ huynh' : 'học sinh'}?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;