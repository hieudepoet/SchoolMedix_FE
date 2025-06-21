import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { getUserRole } from "../service/authService";

const MainLayout = () => {
  const menuItemsDefault = [
    { title: "Trang chủ", path: "/" },
    { title: "Hồ sơ sức khỏe", path: "/login" },
    { title: "Quản lý thuốc", path: "/login" },
    { title: "Tiêm chủng", path: "/login" },
    { title: "Kiểm tra y tế", path: "/login" },
    { title: "Báo cáo", path: "/login" },
  ];
  const menuItemsParent = [
    { title: "Trang chủ", path: "/" },
    { title: "Hồ sơ sức khỏe", path: "/parent" },
    { title: "Tiêm Chung", path: "/parent" },
    { title: "Sức khỏe định kỳ", path: "/parent" },
    { title: "Gửi thuốc", path: "/parent" },
    { title: "Sức khỏe hằng ngày", path: "/parent" },
  ];
    const menuItemsAdmin = [
    { title: "Trang chủ", path: "/" },
    { title: "Hồ sơ sức khỏe", path: "/admin" },
    { title: "Tiêm Chung", path: "/admin" },
    { title: "Sức khỏe định kỳ", path: "/admin" },
    { title: "Gửi thuốc", path: "/admin" },
    { title: "Sức khỏe hằng ngày", path: "/admin" },
  ];
    const userRole = getUserRole();
    console.log("User Role:", userRole);
  return (
    <div className="min-h-screen flex flex-col">
      <Header menuItems={!userRole ? menuItemsDefault : ((userRole === "admin" || userRole === "nurse") ? menuItemsAdmin : menuItemsParent)} />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
