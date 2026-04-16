import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  MessageSquare,
  LogOut,
  User as UserIcon,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Secure Chat", path: "/admin/chat", icon: MessageSquare },
  ];

  const isActive = (path) => {
    // Exact match for dashboard, startWith for others to handle deep links like /create, /edit
    if (path === "/admin/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 shadow-premium flex flex-col z-50">
      {/* Branding Section */}
      <div className="p-8 pb-6">
        <Link to="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-linear-to-tr from-brand-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 transition-transform duration-300 group-hover:scale-110">
            <Package className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
              CRUD<span className="text-brand-600">Pro</span>
            </span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              Management UI
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p className="px-4 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          Main Menu
        </p>

        {menuItems
          .filter(item => user?.role === 'admin' || item.path === '/admin/dashboard') // Ensure basic dashboard always accessible if allowed into sidebar
          .map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`
              flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
              ${
                isActive(item.path)
                  ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 shadow-sm shadow-brand-100/50 dark:shadow-none"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
              }
            `}
          >
            <div className="flex items-center gap-4">
              <item.icon
                size={20}
                className={`transition-colors duration-300 ${isActive(item.path) ? "text-brand-600 dark:text-brand-400" : "group-hover:text-brand-500"}`}
              />
              <span className="font-bold text-[15px]">{item.name}</span>
            </div>
            {isActive(item.path) && (
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400 animate-pulse" />
            )}
          </Link>
        ))}
      </nav>

      {/* Profile & Settings Section */}
      <div className="p-4 bg-gray-50/50 dark:bg-slate-800/20 border-t border-gray-100 dark:border-slate-800/50">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-gray-600 dark:text-slate-400 border border-white dark:border-slate-700 shadow-sm">
              <UserIcon size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-tighter">
                {user?.username || "Admin"}
              </p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase">
                  Online
                </span>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="group w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 font-black text-xs uppercase tracking-widest border border-red-100 dark:border-red-900/30 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white rounded-2xl transition-all duration-300 shadow-sm hover:shadow-red-500/20 mt-2"
        >
          <LogOut
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
