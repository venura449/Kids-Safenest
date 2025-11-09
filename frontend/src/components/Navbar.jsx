import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  CheckSquare,
  Heart,
  Calendar,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { comman } from "../pages/en/comman";

export default function Navbar({ userName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{comman.EN}</span>
            </div>
            <NavLink to="/dashboard">
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                {comman.SafeNet}
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Home className="w-4 h-4" />
              <span>{comman.Dashboard}</span>
            </NavLink>
            <NavLink
              to="/todo"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <CheckSquare className="w-4 h-4" />
              <span>{comman.Todo}</span>
            </NavLink>
            <NavLink
              to="/health"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Heart className="w-4 h-4" />
              <span>{comman.Health}</span>
            </NavLink>
            <NavLink
              to="/menstruation"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Calendar className="w-4 h-4" />
              <span>{comman.MenstruationCycle}</span>
            </NavLink>
          </div>

          {/* Right side - Desktop Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <NavLink
              to="/setting"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              {({ isActive }) => (
                <Settings
                  className={`w-5 h-5 cursor-pointer transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                />
              )}
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              {({ isActive }) => (
                <User
                  className={`w-5 h-5 cursor-pointer transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                />
              )}
            </NavLink>
            <NavLink
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2rounded-lg transition-colors text-red-600 hover:text-red-700 hover:bg-red-50 "
              to="/login"
            >
              <LogOut className="w-4 h-4" />
              <span>{comman.Logout}</span>
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/dashboard"
              onClick={() => {
                closeMobileMenu();
              }}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Home className="w-5 h-5" />
              <span>{comman.Dashboard}</span>
            </NavLink>
            <NavLink
              to="/todo"
              onClick={() => {
                closeMobileMenu();
              }}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <CheckSquare className="w-5 h-5" />
              <span>{comman.Todo}</span>
            </NavLink>
            <NavLink
              to="/health"
              onClick={() => {
                closeMobileMenu();
              }}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Heart className="w-5 h-5" />
              <span>{comman.Health}</span>
            </NavLink>
            <NavLink
              to="/menstruation"
              onClick={() => {
                closeMobileMenu();
              }}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Calendar className="w-5 h-5" />
              <span>{comman.MenstruationCycle}</span>
            </NavLink>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-gray-700">
                  {comman.QuickActions}
                </span>
              </div>
              <NavLink className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span>{comman.Notifications}</span>
              </NavLink>
              <NavLink
                onClick={() => closeMobileMenu()}
                to="/setting"
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Settings
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    />
                    <span>{comman.Settings}</span>
                  </>
                )}
              </NavLink>
              <NavLink
                onClick={() => closeMobileMenu()}
                to="/profile"
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <User
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    />
                    <span>{comman.Profile}</span>
                  </>
                )}
              </NavLink>

              <NavLink
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                  navigate("/login");
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>{comman.Logout}</span>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
