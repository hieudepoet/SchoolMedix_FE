import { User, Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MdOutlineSchool } from "react-icons/md";
import { getUser, getUserRole, removeUser } from "../service/authService";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const Header = ({menuItems}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const user = getUser();
  const isLoggedIn = !!user;

  const userMenuItems = [
    { title: "Tiện ích", path: "/" + getUserRole(), icon: User },
    { title: "Cài đặt", path: "/settings", icon: User },
    { title: "Profile", path: "/notifications", icon: User },
    { title: "Lịch sử", path: "/history", icon: User },
    { 
      title: "Đăng xuất", 
      action: handleLogout,
      icon: LogOut,
      variant: "danger"
    },
  ];

  function handleLogout() {
    removeUser();
    navigate("/");
    enqueueSnackbar("Đăng xuất thành công", { variant: "success" });
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleUserClick = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      navigate("/login");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation("/")}
          >
            <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center">
              <MdOutlineSchool className="text-lg" />
            </div>
            <span className="text-xl font-semibold text-gray-800">
              SchoolMedix
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems && menuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => handleNavigation(item.path)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {item.title}
              </button>
            ))}
          </nav>

          {/* User Actions & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* User Section */}
            <div className="relative" ref={dropdownRef}>
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  {/* User Info */}
                  <button
                    onClick={handleUserClick}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-800 hidden sm:block">
                      {user?.user_metadata?.name || "Người dùng"}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Đăng nhập
                </button>
              )}

              {/* User Dropdown Menu */}
              {isLoggedIn && isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.title}
                        onClick={() => item.action ? item.action() : handleNavigation(item.path)}
                        className={`flex items-center gap-3 w-full px-4 py-2 text-left transition-colors duration-200 ${
                          item.variant === "danger"
                            ? "text-red-600 hover:bg-red-50"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="px-4 py-2">
              {menuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavigation(item.path)}
                  className="block w-full text-left py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  {item.title}
                </button>
              ))}
              
              {/* Mobile User Menu */}
              {isLoggedIn && (
                <div className="border-t mt-2 pt-2">
                  <div className="px-3 py-2 text-sm text-gray-500 font-medium">
                    {user?.user_metadata?.name || "Người dùng"}
                  </div>
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.title}
                        onClick={() => item.action ? item.action() : handleNavigation(item.path)}
                        className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg transition-colors duration-200 ${
                          item.variant === "danger"
                            ? "text-red-600 hover:bg-red-50"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;