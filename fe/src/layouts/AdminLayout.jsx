import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {

  return (
    <div className="flex">
      <Sidebar />
      <div className="grow pt-4 max-h-screen overflow-y-scroll pl-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
