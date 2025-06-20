  import {
    Settings,
    Menu,
    X,
    LogOut,
    CalendarDaysIcon,
    User2Icon,
  } from "lucide-react";
  import React, { useEffect, useState } from "react";
  import { MdOutlineSchool } from "react-icons/md";
  import { MdOutlineMedicalInformation } from "react-icons/md";
  import { RiHome9Line } from "react-icons/ri";
  import { BsTextIndentLeft } from "react-icons/bs";
  import { MdMedicationLiquid } from "react-icons/md";
  import { LuLayoutDashboard, LuSyringe } from "react-icons/lu";
  import { useNavigate } from "react-router-dom";
  import { getUser, getUserRole, removeUser } from "../service/authService";
  import { enqueueSnackbar } from "notistack";

  const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState("Trang chủ");
    const [isMobile, setIsMobile] = useState(false);
    const [commonItems, setCommonItems] = useState([
      { title: "Trang chủ", path: "/", icon: <RiHome9Line /> },
      {
        title: "Quản lý dặn thuốc",
        path: "send-drug",
        icon: <MdMedicationLiquid />,
      },
      {
        title: "Sức khỏe hằng ngày",
        path: "daily-health",
        icon: <CalendarDaysIcon />,
      },
    ]);

    const [adminItems, setAdminItems] = useState([
      {
        title: "Dashboard / Profile",
        path: "",
        icon: <LuLayoutDashboard />,
      },
      {
        title: "Quản lý bệnh",
        path: "disease-record",
        icon: <MdOutlineMedicalInformation />,
      },
      {
        title: "Khám định kỳ",
        path: "regular-checkup",
        icon: <BsTextIndentLeft />,
      },
      { title: "Kế hoạch tiêm chủng", path: "vaccine-campaign", icon: <LuSyringe /> },
    ]);

    const navigate = useNavigate();

    // Handle responsive design
    useEffect(() => {
      const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile) {
          setIsCollapsed(true);
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      const role = getUserRole();
      if (role === "admin") {
        setAdminItems((prev) => {
          if (!prev.some((item) => item.title === "Quản lý người dùng")) {
            return [
              ...prev,
              {
                title: "Quản lý người dùng",
                path: "user-manage",
                icon: <User2Icon />,
              },
            ];
          }
          return prev;
        });
      }
    }, [localStorage.getItem("user")]);

    const bottomItems = [
      { title: "Cài đặt", action: "settings", icon: <Settings /> },
      { title: "Đăng xuất", action: "logout", icon: <LogOut /> },
    ];

    const handleNavigation = (path, title) => {
      setActiveItem(title);
      console.log(`Navigating to: ${path}`);
      navigate(path);
      
      // Auto collapse on mobile after navigation
      if (isMobile) {
        setIsCollapsed(true);
      }
    };

    const handleAction = (action) => {
      console.log(`Action: ${action}`);
    };

    const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
    };

    return (
      <>
        {/* Overlay for mobile */}
        {isMobile && !isCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsCollapsed(true)}
          />
        )}
        
        <div
          className={`
            ${isMobile ? 'fixed' : 'relative'} 
            ${isMobile ? 'z-50' : 'z-10'}
            h-screen bg-white shadow-lg border-r border-gray-200 
            flex flex-col transition-all duration-300 ease-in-out
            ${isCollapsed ? 'w-16' : 'w-64'}
            ${isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'}
          `}
        >
          {/* Header */}
          <div className={`p-3 border-b border-gray-200 flex items-center justify-between 
                          min-h-[60px] ${isCollapsed ? "flex-col" : "flex-row"}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <MdOutlineSchool className="text-white text-lg" />
              </div>
              {!isCollapsed && (
                <span className="font-bold text-gray-900 text-lg">SchoolMedix</span>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
            >
              {isCollapsed ? <Menu size={18} /> : <X size={18} />}
            </button>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 py-2 px-2 overflow-y-auto scrollbar-hide">
            {/* Common Items */}
            <div className="space-y-1">
              {commonItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavigation(item.path, item.title)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl text-left 
                    transition-all duration-200 group relative
                    ${activeItem === item.title
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                  title={isCollapsed ? item.title : ''}
                >
                  <div className="text-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium text-sm leading-tight truncate">
                      {item.title}
                    </span>
                  )}
                  {activeItem === item.title && (
                    <div className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full opacity-75" />
                  )}
                </button>
              ))}
            </div>

            {/* Divider */}
            {adminItems.length > 0 && (
              <div className="my-4 border-t border-gray-100" />
            )}

            {/* Admin Items */}
            <div className="space-y-1">
              {adminItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavigation(item.path, item.title)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl text-left 
                    transition-all duration-200 group relative
                    ${activeItem === item.title
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                  title={isCollapsed ? item.title : ''}
                >
                  <div className="text-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium text-sm leading-tight truncate">
                      {item.title}
                    </span>
                  )}
                  {activeItem === item.title && (
                    <div className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full opacity-75" />
                  )}
                </button>
              ))}
            </div>
          </div> 

          {/* Bottom Actions */}
          <div className="p-2 border-t border-gray-100 bg-gray-50/50">
            <div className="space-y-1">
              {bottomItems.map((item, index) => (
                <button
                  key={item.title}
                  onClick={() => {
                    handleAction(item.action);
                    if (index === 1) {
                      removeUser();
                      enqueueSnackbar("Đăng xuất thành công", { variant: "success" });
                      navigate("/");
                    }
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-gray-600 hover:bg-white hover:text-gray-900 transition-all duration-200 group"
                  title={isCollapsed ? item.title : ''}
                >
                  <div className="text-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.title}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  export default Sidebar;