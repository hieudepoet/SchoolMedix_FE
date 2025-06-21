import React, { createContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import TabHeader from "../components/TabHeader";

const ChildContext = createContext();

const ParentLayout = () => {
  const menuItems = [
    { title: "Trang chủ", path: "/" },
    { title: "Hồ sơ sức khỏe", path: "/parent" },
    { title: "Tiêm Chung", path: "/parent" },
    { title: "Sức khỏe định kỳ", path: "/parent" },
    { title: "Gửi thuốc", path: "/parent" },
    { title: "Sức khỏe hằng ngày", path: "/parent" },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Header menuItems={menuItems} />
      <TabHeader />
      <main className="flex-1 p-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ParentLayout;
