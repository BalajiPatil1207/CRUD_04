import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Api } from "../../components/common/Api/api";
import Card from "../../components/common/Card";
import {
  Users,
  Package,
  Clock,
  ShieldCheck,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import Button from "../../components/common/Button";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalProducts: 2, // Default/Initial
    uptime: "0m",
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await Api.get("/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      name: "Active Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      trend: "Growth 12%",
    },
    {
      name: "Security",
      value: "Active",
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      trend: "Protected",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-12 w-1/3 bg-gray-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 dark:bg-slate-800 rounded-3xl"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-gray-100 dark:bg-slate-800 rounded-3xl" />
          <div className="h-96 bg-gray-100 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Welcome back,{" "}
            <span className="text-brand-600 text-gradient">
              {user?.username || "Admin"}
            </span>
            !
          </h1>
          <p className="text-gray-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-[0.2em]">
            SYSTEM OVERVIEW •{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Live System Status
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card
            key={stat.name}
            className="glass shadow-premium border-none p-6 group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div
                className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110`}
              >
                <stat.icon size={28} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">
                  {stat.name}
                </p>
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                  {stat.value}
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between text-[10px] font-bold">
              <span className={`${stat.color} uppercase tracking-widest`}>
                {stat.trend}
              </span>
              <ArrowUpRight
                size={14}
                className="text-gray-300 dark:text-slate-700"
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Activity and Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2 glass shadow-premium border-none p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider border-l-4 border-brand-500 pl-4">
              Recent Activity
            </h3>
            <Button className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest hover:underline transition-all">
              View All History
            </Button>
          </div>

          <div className="space-y-6">
            {stats.recentActivity.map((activity, idx) => (
              <div key={activity.id} className="flex gap-5 group relative">
                {/* Timeline Connector */}
                {idx !== stats.recentActivity.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-[-24px] w-0.5 bg-gray-100 dark:bg-slate-800" />
                )}

                <div
                  className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:rotate-12 ${activity.bg} ${activity.color}`}
                >
                  {activity.icon === "package" ? (
                    <Package size={20} />
                  ) : (
                    <ShieldCheck size={20} />
                  )}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      {activity.title}
                    </h4>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500">
                      {new Date(activity.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                    {activity.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Links / System Info */}
        <div className="space-y-6">
          <Card className="glass shadow-premium border-none p-8 flex flex-col bg-linear-to-br from-brand-600 to-indigo-700 text-white">
            <h3 className="text-lg font-black uppercase tracking-wider mb-2">
              Pro Subscription
            </h3>
            <p className="text-xs text-brand-100 font-medium leading-relaxed opacity-80 mb-6">
              Enjoy unlimited listings and advanced analytics with our business
              plan.
            </p>
            <button className="w-full py-3.5 bg-white text-brand-700 font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg hover:bg-brand-50 transition-colors">
              Upgrade Now
            </button>
          </Card>

          <Card className="glass shadow-premium border-none p-8">
            <h3 className="text-sm font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider">
              Quick Shortcuts
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:border-brand-500 transition-colors">
                <span className="text-xs font-bold text-gray-600 dark:text-slate-400 group-hover:text-brand-600 transition-colors">
                  Add New Product
                </span>
                <Package
                  size={14}
                  className="text-gray-300 group-hover:text-brand-500"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
