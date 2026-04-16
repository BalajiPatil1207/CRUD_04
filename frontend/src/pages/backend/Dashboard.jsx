import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Api } from "../../components/common/Api/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  Users,
  MessageSquare,
  Clock,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Ban,
  CheckCircle2,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalMessages: 0,
    uptime: "0m",
    recentActivity: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [blockTarget, setBlockTarget] = useState(null);

  const fetchUsers = async () => {
    const response = await Api.get("/chat/users");
    setUsers(response.data.data);
  };

  const fetchStats = async () => {
    const response = await Api.get("/stats");
    setStats(response.data.data);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await Promise.all([fetchStats(), fetchUsers()]);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
        setUsersLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleBlockToggle = async () => {
    if (!blockTarget) return;

    try {
      setActionLoading(true);
      await Api.patch(`/chat/users/${blockTarget.user_id}/block`, {
        isBlocked: !blockTarget.isBlocked,
      });
      await Promise.all([fetchStats(), fetchUsers()]);
      setBlockTarget(null);
    } catch (error) {
      console.error("Failed to update block state", error);
    } finally {
      setActionLoading(false);
    }
  };

  const statCards = [
    {
      name: "Global Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      trend: "Active Hub",
    },
    {
      name: "Online Now",
      value: stats.activeUsers,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      trend: "Live Presence",
    },
    {
      name: "Blocked",
      value: stats.blockedUsers,
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
      trend: "Admin Control",
    },
    {
      name: "Total Messages",
      value: stats.totalMessages,
      icon: MessageSquare,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      trend: "Real-time",
    },
    {
      name: "Security",
      value: "Active",
      icon: ShieldCheck,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      trend: "Encrypted",
    },
    {
      name: "Uptime",
      value: stats.uptime,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      trend: "Reliable",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse p-4">
        <div className="h-12 w-1/3 bg-gray-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-slate-800 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Welcome,{" "}
            <span className="text-brand-600 text-gradient">
              {user?.username || "Admin"}
            </span>
            !
          </h1>
          <p className="text-gray-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-[0.2em]">
            NETWORK OVERVIEW •{" "}
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
            Signal Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <Card className="lg:col-span-2 glass shadow-premium border-none p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider border-l-4 border-brand-500 pl-4">
              Real-time Stream
            </h3>
          </div>

          <div className="space-y-6">
            {stats.recentActivity.map((activity, idx) => (
              <div key={activity.id} className="flex gap-5 group relative">
                {idx !== stats.recentActivity.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-[-24px] w-0.5 bg-gray-100 dark:bg-slate-800" />
                )}

                <div
                  className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:rotate-12 ${activity.bg} ${activity.color}`}
                >
                  {activity.icon === "message-square" ? (
                    <MessageSquare size={20} />
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

        <div className="space-y-6">
          <Card className="glass shadow-premium border-none p-8 flex flex-col bg-linear-to-br from-brand-600 to-indigo-700 text-white">
            <h3 className="text-lg font-black uppercase tracking-wider mb-2">
              Secure Bridge
            </h3>
            <p className="text-xs text-brand-100 font-medium leading-relaxed opacity-80 mb-6">
              Connect private one-on-one rooms with end-to-end encrypted messaging streams.
            </p>
            <Button
              variant="secondary"
              className="w-full text-brand-700 shadow-xl bg-white hover:bg-brand-50"
              onClick={() => navigate("/chat")}
            >
              Launch Chat
            </Button>
          </Card>

          <Card className="glass shadow-premium border-none p-8">
            <h3 className="text-sm font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider">
              System Shortcuts
            </h3>
            <div className="space-y-3">
              <div
                onClick={() => navigate("/chat")}
                className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:border-brand-500 transition-colors"
              >
                <span className="text-xs font-bold text-gray-600 dark:text-slate-400 group-hover:text-brand-600 transition-colors uppercase tracking-widest">
                  Active Messages
                </span>
                <MessageSquare
                  size={14}
                  className="text-gray-300 group-hover:text-brand-500"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="glass shadow-premium border-none p-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">
              User Control
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium uppercase tracking-[0.2em] mt-2">
              Block or restore access for chat participants
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-gray-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-gray-500">
            {users.length} visible users
          </div>
        </div>

        {usersLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 rounded-3xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {users.map((u) => (
              <div
                key={u.user_id}
                className={`rounded-3xl border p-5 transition-all duration-300 ${
                  u.isBlocked
                    ? "border-red-200 dark:border-red-900/30 bg-red-50/60 dark:bg-red-950/20"
                    : "border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      {u.username}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                      {u.email}
                    </p>
                  </div>
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1 ${
                      u.isOnline ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300">
                    {u.role}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      u.isBlocked
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300"
                        : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300"
                    }`}
                  >
                    {u.isBlocked ? "Blocked" : "Allowed"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      u.isOnline
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400"
                    }`}
                  >
                    {u.isOnline ? "Online" : "Offline"}
                  </span>
                </div>

                <Button
                  variant={u.isBlocked ? "secondary" : "danger"}
                  size="sm"
                  className="mt-5 w-full"
                  icon={u.isBlocked ? CheckCircle2 : Ban}
                  onClick={() => setBlockTarget(u)}
                >
                  {u.isBlocked ? "Unblock User" : "Block User"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmModal
        isOpen={Boolean(blockTarget)}
        onClose={() => setBlockTarget(null)}
        onConfirm={handleBlockToggle}
        title={blockTarget?.isBlocked ? "Unblock user?" : "Block user?"}
        message={
          blockTarget
            ? `${blockTarget.username} will ${blockTarget.isBlocked ? "regain" : "lose"} access to chat immediately.`
            : ""
        }
        confirmText={blockTarget?.isBlocked ? "Unblock" : "Block"}
        cancelText="Cancel"
        variant={blockTarget?.isBlocked ? "success" : "danger"}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default Dashboard;
