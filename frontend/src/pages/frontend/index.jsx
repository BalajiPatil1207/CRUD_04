import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { LayoutDashboard, LogIn, UserPlus, LogOut, Package, ShieldCheck } from "lucide-react";
import ThemeToggle from "../../components/common/ThemeToggle";

const Index = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Navigation Header */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-tr from-brand-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="text-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
            CRUD<span className="text-brand-600">Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Button variant="danger" size="sm" onClick={logout} icon={LogOut}>Logout</Button>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm" icon={LogIn}>Sign In</Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/20 rounded-full mb-8">
            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">Version 2.0 Now Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-6">
          Management <span className="text-brand-600 text-gradient">Simplified.</span>
        </h1>
        <p className="max-w-2xl text-lg text-gray-600 dark:text-slate-400 font-medium leading-relaxed mb-10">
          A premium, high-fidelity administrative system designed for data clarity and operational speed. Register today to experience the command center.
        </p>

        {user ? (
          <div className="flex flex-col items-center gap-6">
            <Card className="glass p-8 shadow-premium border-none flex flex-col items-center">
               <div className="w-20 h-20 rounded-full bg-linear-to-br from-brand-100 to-brand-50 dark:from-brand-900/40 dark:to-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 border-4 border-white dark:border-slate-800 shadow-xl">
                  <span className="text-3xl font-black uppercase">{user.username.charAt(0)}</span>
               </div>
               <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tighter">Welcome, {user.username}!</h3>
               <p className="text-gray-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-6">Role: {user.role}</p>
               
               {user.role === 'admin' ? (
                 <Link to="/admin/dashboard">
                   <Button variant="primary" size="lg" icon={LayoutDashboard} className="px-10">Enter Command Center</Button>
                 </Link>
               ) : (
                 <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl">
                    <ShieldCheck className="text-amber-600" size={16} />
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Regular User Access (Admin Restricted)</span>
                 </div>
               )}
            </Card>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg" icon={UserPlus} className="px-10 py-4 text-sm">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" icon={LogIn} className="px-10 py-4 text-sm">Sign In</Button>
            </Link>
          </div>
        )}
      </main>

      {/* Footer Decoration */}
      <footer className="fixed bottom-0 left-0 w-full p-8 flex justify-center opacity-20 pointer-events-none">
          <div className="flex gap-20">
              <div className="flex flex-col gap-2">
                  <div className="h-0.5 w-12 bg-gray-400" />
                  <div className="h-0.5 w-24 bg-gray-300" />
              </div>
              <div className="flex flex-col gap-2">
                  <div className="h-0.5 w-24 bg-gray-300" />
                  <div className="h-0.5 w-12 bg-gray-400" />
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Index;