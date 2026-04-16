import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Breadcrumbs from "../common/Breadcrumbs";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-500">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-72 min-h-screen flex flex-col">
        {/* Dynamic Content with Page Transitions */}
        <div className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-right-4 duration-700">
            <Breadcrumbs />
            <Outlet />
          </div>
        </div>
        
        {/* Optional Footer inside Admin Layout */}
        <footer className="px-10 py-6 border-t border-gray-100 dark:border-slate-900 flex justify-between items-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
            <p className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-[0.2em]">
                &copy; 2026 Balaji Patil • CRUD Pro System
            </p>
            <div className="flex gap-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 block" title="Server Online" />
            </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
