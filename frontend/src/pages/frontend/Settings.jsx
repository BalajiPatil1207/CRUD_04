import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Api } from "../../components/common/Api/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Switch from "../../components/common/Switch";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useToast } from "../../components/common/Toast";
import {
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  ListFilter,
  EyeOff,
  Eye,
  ArrowLeft,
  Settings2,
  ShieldCheck,
  Pin,
  PinOff,
} from "lucide-react";
import {
  getChatSettings,
  updateChatSettings,
  toggleHiddenContact,
  toggleMutedContact,
  togglePinnedContact,
} from "../../components/chat/chatSettings";

const Settings = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(() => getChatSettings(user?.user_id));

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await Api.get("/chat/users");
        setContacts(response.data.data);
      } catch (error) {
        console.error("Failed to load contacts", error);
        addToast("Could not load your chat contacts", "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [addToast]);

  const persist = (patch) => {
    if (!user?.user_id) return;
    const next = updateChatSettings(user.user_id, patch);
    setSettings(next);
    window.dispatchEvent(new Event("storage"));
    return next;
  };

  const handleToggle = async (name, value) => {
    if (name === "notificationsEnabled" && value && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        addToast("Notification permission is required", "warning");
        persist({ notificationsEnabled: false });
        return;
      }
    }

    persist({ [name]: value });
  };

  const handleHideToggle = (contactId) => {
    const next = toggleHiddenContact(user.user_id, contactId);
    setSettings(next);
    window.dispatchEvent(new Event("storage"));
  };

  const handleMuteToggle = (contactId) => {
    const next = toggleMutedContact(user.user_id, contactId);
    setSettings(next);
    window.dispatchEvent(new Event("storage"));
  };

  const handlePinToggle = (contactId) => {
    const next = togglePinnedContact(user.user_id, contactId);
    setSettings(next);
    window.dispatchEvent(new Event("storage"));
  };

  const handleUnhideAll = () => {
    persist({ hiddenContacts: [] });
    addToast("All chats restored", "success");
  };

  const hiddenContacts = contacts.filter((contact) =>
    settings.hiddenContacts.includes(contact.user_id)
  );

  const visibleContacts = contacts.filter(
    (contact) => !settings.hiddenContacts.includes(contact.user_id)
  );
  const pinnedContacts = contacts.filter((contact) =>
    settings.pinnedContacts.includes(contact.user_id)
  );

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Settings2 size={12} />
              Chat preferences
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Settings
            </h1>
            <p className="mt-3 text-sm text-gray-500 dark:text-slate-400 max-w-2xl">
              Control notifications, sound, chat ordering, pinned chats, and which conversations stay hidden on your side only.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/chat">
              <Button variant="secondary" icon={ArrowLeft}>
                Back to Chat
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass shadow-premium border-none p-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-6">
              Notifications & Behavior
            </h2>

            <div className="grid gap-4">
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                    {settings.notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      Message notifications
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Toasts and browser notifications when a new message arrives.
                    </p>
                  </div>
                </div>
                <Switch
                  name="notificationsEnabled"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleToggle("notificationsEnabled", e.target.value)}
                />
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      Sound alerts
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Play a short sound when a message arrives.
                    </p>
                  </div>
                </div>
                <Switch
                  name="soundEnabled"
                  checked={settings.soundEnabled}
                  onChange={(e) => handleToggle("soundEnabled", e.target.value)}
                />
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <ListFilter size={18} />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      Auto sort chats
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Put unread and recent chats at the top automatically.
                    </p>
                  </div>
                </div>
                <Switch
                  name="autoSortEnabled"
                  checked={settings.autoSortEnabled}
                  onChange={(e) => handleToggle("autoSortEnabled", e.target.value)}
                />
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-900/20 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400">
                    <Pin size={18} />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      Pinned chats
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Keep chosen conversations at the top of your chat list.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {settings.pinnedContacts.length} pinned
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass shadow-premium border-none p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Hidden Chats
              </h2>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {settings.hiddenContacts.length} hidden, {settings.mutedContacts.length} muted, {settings.pinnedContacts.length} pinned
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-dashed border-gray-200 dark:border-slate-700 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <EyeOff size={16} className="text-gray-500" />
                <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">
                  Hide from your side only
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                Hidden chats disappear from your sidebar, but the other person can still see and message you.
              </p>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : hiddenContacts.length === 0 ? (
              <div className="py-10 text-center">
                <Eye size={28} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-bold text-gray-500 dark:text-slate-400">
                  No hidden conversations
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {hiddenContacts.map((contact) => (
                  <div
                    key={contact.user_id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">
                        {contact.username}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                        {contact.role}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={Eye}
                      onClick={() => handleHideToggle(contact.user_id)}
                    >
                      Unhide
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={handleUnhideAll}>
                  Restore all
                </Button>
              </div>
            )}
          </Card>
        </div>

        <Card className="glass shadow-premium border-none p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Contacts Snapshot
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium uppercase tracking-[0.2em] mt-2">
                Quickly hide or restore contacts from here.
              </p>
            </div>
            <div className="px-4 py-2 rounded-full bg-gray-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-gray-500">
              {visibleContacts.length} visible
            </div>
          </div>

          {pinnedContacts.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-fuchsia-50/60 dark:bg-fuchsia-950/20 border border-fuchsia-100 dark:border-fuchsia-900/30">
              <div className="flex items-center gap-3 mb-4">
                <Pin size={16} className="text-fuchsia-600 dark:text-fuchsia-400" />
                <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">
                  Pinned Chats
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {pinnedContacts.map((contact) => (
                  <button
                    key={contact.user_id}
                    type="button"
                    onClick={() => handlePinToggle(contact.user_id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-slate-900 border border-fuchsia-200 dark:border-fuchsia-900/40 text-xs font-black uppercase tracking-widest text-fuchsia-700 dark:text-fuchsia-300"
                  >
                    {contact.username}
                    <PinOff size={12} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {contacts.map((contact) => {
              const hidden = settings.hiddenContacts.includes(contact.user_id);
              const muted = settings.mutedContacts.includes(contact.user_id);
              const pinned = settings.pinnedContacts.includes(contact.user_id);
              return (
                <div
                  key={contact.user_id}
                  className={`p-4 rounded-2xl border transition-all ${
                    hidden
                      ? "border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20"
                      : "border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">
                        {contact.username}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                        {contact.role}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        hidden
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300"
                          : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300"
                      }`}
                    >
                      {hidden ? "Hidden" : "Visible"}
                    </span>
                  </div>

                  {pinned && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 text-[9px] font-black uppercase tracking-widest">
                      <Pin size={10} />
                      Pinned
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {contact.isOnline ? <ShieldCheck size={12} className="text-emerald-500" /> : <EyeOff size={12} />}
                      {contact.isOnline ? "Online" : "Offline"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={pinned ? "secondary" : "ghost"}
                        icon={pinned ? PinOff : Pin}
                        onClick={() => handlePinToggle(contact.user_id)}
                      >
                        {pinned ? "Unpin" : "Pin"}
                      </Button>
                      <Button
                        size="sm"
                        variant={muted ? "secondary" : "ghost"}
                        icon={muted ? Volume2 : VolumeX}
                        onClick={() => handleMuteToggle(contact.user_id)}
                      >
                        {muted ? "Unmute" : "Mute"}
                      </Button>
                      <Button
                        size="sm"
                        variant={hidden ? "secondary" : "ghost"}
                        icon={hidden ? Eye : EyeOff}
                        onClick={() => handleHideToggle(contact.user_id)}
                      >
                        {hidden ? "Unhide" : "Hide"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
