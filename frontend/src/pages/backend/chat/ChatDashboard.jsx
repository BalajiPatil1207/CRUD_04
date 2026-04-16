import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { socket, syncSocketAuth } from "../../../components/chat/socket";
import { Api } from "../../../components/common/Api/api";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import { useToast } from "../../../components/common/Toast";
import { getChatSettings, toggleHiddenContact, togglePinnedContact } from "../../../components/chat/chatSettings";
import {
  Send,
  User as UserIcon,
  Hash,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  ShieldCheck,
  Activity,
  Check,
  CheckCheck,
  Ban,
  MessageSquare,
  Wifi,
  WifiOff,
  Sparkles,
  Settings2,
  EyeOff,
  VolumeX,
  Pencil,
  Trash2,
  X,
  Pin,
  PinOff,
} from "lucide-react";

const QUICK_EMOJIS = ["😊", "😂", "😍", "🔥", "👍", "🙏", "💯", "🥳", "💬", "✨"];

const playSound = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gainNode.gain.value = 0.04;

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);

  oscillator.onended = () => context.close();
};

const ChatDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadByUser, setUnreadByUser] = useState({});
  const [highlightedUserId, setHighlightedUserId] = useState(null);
  const [chatSettings, setChatSettings] = useState(() => getChatSettings(user?.user_id));
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [isSavingMessage, setIsSavingMessage] = useState(false);
  const typingTimeoutRef = useRef(null);
  const highlightTimeoutRef = useRef(null);
  const usersRef = useRef([]);
  const settingsRef = useRef(chatSettings);
  const messagesEndRef = useRef(null);

  const selectedUser = users.find((contact) => contact.user_id === selectedUserId) || null;

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useEffect(() => {
    settingsRef.current = chatSettings;
  }, [chatSettings]);

  useEffect(() => {
    if (!user?.user_id) return undefined;

    const handleStorage = () => {
      setChatSettings(getChatSettings(user.user_id));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [user?.user_id]);

  const clearConversationState = (contactId) => {
    setUnreadByUser((prev) => {
      if (!prev[contactId]) return prev;
      const next = { ...prev };
      delete next[contactId];
      return next;
    });

    setUsers((prev) =>
      prev.map((contact) =>
        contact.user_id === contactId ? { ...contact, unreadCount: 0 } : contact
      )
    );

    setHighlightedUserId((prev) => (prev === contactId ? null : prev));
  };

  const handleSelectUser = (contact) => {
    setSelectedUserId(contact.user_id);
    setIsRecipientTyping(false);
    clearConversationState(contact.user_id);
    setShowEmojiPicker(false);
  };

  const handleHideContact = (contactId) => {
    if (!user?.user_id) return;

    const next = toggleHiddenContact(user.user_id, contactId);
    setChatSettings(next);
    setShowEmojiPicker(false);

    if (selectedUserId === contactId) {
      setSelectedUserId(null);
      setMessages([]);
    }

    addToast(
      next.hiddenContacts.includes(Number(contactId))
        ? "Conversation hidden from your sidebar"
        : "Conversation restored to your sidebar",
      "info"
    );
  };

  const handlePinContact = (contactId) => {
    if (!user?.user_id) return;

    const next = togglePinnedContact(user.user_id, contactId);
    setChatSettings(next);
    setShowEmojiPicker(false);

    addToast(
      next.pinnedContacts.includes(Number(contactId))
        ? "Conversation pinned to the top"
        : "Conversation unpinned",
      "info"
    );
  };

  const refreshUsers = async () => {
    try {
      const response = await Api.get("/chat/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to refresh contacts", error);
    }
  };

  const startEditMessage = (message) => {
    setEditingMessageId(message.message_id);
    setNewMessage(message.message);
    setShowEmojiPicker(false);
  };

  const cancelEditMessage = () => {
    setEditingMessageId(null);
    setNewMessage("");
  };

  const appendEmoji = (emoji) => {
    setNewMessage((prev) => `${prev}${emoji}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Api.get("/chat/users");
        setUsers(response.data.data);

        const initialUnread = response.data.data.reduce((acc, contact) => {
          if (contact.unreadCount > 0) {
            acc[contact.user_id] = contact.unreadCount;
          }
          return acc;
        }, {});
        setUnreadByUser(initialUnread);
      } catch (err) {
        console.error("Error fetching users:", err);
        addToast("Could not load chat contacts", "danger");
      }
    };

    fetchUsers();

    syncSocketAuth();
    socket.connect();
    return () => socket.disconnect();
  }, [addToast]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      const incomingIsSelected = selectedUserId && (data.senderId === selectedUserId || data.receiverId === selectedUserId);
      const shouldNotify = settingsRef.current.notificationsEnabled;
      const shouldSound = settingsRef.current.soundEnabled;
      const isMutedContact = settingsRef.current.mutedContacts.includes(data.senderId);

      setUsers((prev) =>
        prev.map((contact) => {
          if (contact.user_id === data.senderId || contact.user_id === data.receiverId) {
            return {
              ...contact,
              lastMessage: data.message,
              lastMessageAt: data.createdAt || data.timestamp,
              lastMessageSenderId: data.senderId,
              unreadCount:
                incomingIsSelected && contact.user_id === data.senderId
                  ? 0
                  : contact.user_id === data.senderId
                    ? (contact.unreadCount || 0) + 1
                    : contact.unreadCount || 0,
            };
          }
          return contact;
        })
      );

      if (incomingIsSelected) {
        setMessages((prev) => {
          if (prev.some((msg) => msg.message_id === data.message_id)) return prev;
          return [...prev, data];
        });

        if (data.senderId === selectedUserId) {
          setIsRecipientTyping(false);
        }

        clearConversationState(data.senderId);
        return;
      }

      if (data.senderId !== user.user_id) {
        setUnreadByUser((prev) => ({
          ...prev,
          [data.senderId]: (prev[data.senderId] || 0) + 1,
        }));

        setHighlightedUserId(data.senderId);

        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }

        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightedUserId((prev) => (prev === data.senderId ? null : prev));
        }, 1800);

        const senderName = usersRef.current.find((contact) => contact.user_id === data.senderId)?.username || "A user";

        if (shouldNotify && !isMutedContact) {
          addToast(`${senderName} sent a new message`, "info");

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`New message from ${senderName}`, {
              body: data.message,
            });
          }
        }

        if (shouldSound && !isMutedContact) {
          playSound();
        }
      }
    };

    const handleTyping = (data) => {
      if (selectedUserId && data.userId === selectedUserId) {
        setIsRecipientTyping(true);
      }
    };

    const handleStopTyping = (data) => {
      if (selectedUserId && data.userId === selectedUserId) {
        setIsRecipientTyping(false);
      }
    };

    const handlePresenceUpdate = ({ userId, isOnline }) => {
      setUsers((prev) =>
        prev.map((contact) =>
          contact.user_id === userId ? { ...contact, isOnline } : contact
        )
      );
    };

    const handleMessageError = ({ message }) => {
      addToast(message || "Message could not be sent", "danger");
    };

    const handleMessageUpdated = (updatedMessage) => {
      setMessages((prev) =>
        prev.map((message) =>
          message.message_id === updatedMessage.message_id ? updatedMessage : message
        )
      );
      refreshUsers();
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((message) => message.message_id !== messageId));
      refreshUsers();
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("presence_update", handlePresenceUpdate);
    socket.on("message_error", handleMessageError);
    socket.on("message_updated", handleMessageUpdated);
    socket.on("message_deleted", handleMessageDeleted);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("presence_update", handlePresenceUpdate);
      socket.off("message_error", handleMessageError);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("message_deleted", handleMessageDeleted);
    };
  }, [selectedUserId, user.user_id, addToast]);

  useEffect(() => {
    if (!selectedUserId) return;

    const currentSelectedUser = usersRef.current.find((contact) => contact.user_id === selectedUserId);
    if (!currentSelectedUser) return;

    const ids = [user.user_id, currentSelectedUser.user_id].sort();
    const room = `chat_${ids[0]}_${ids[1]}`;

    socket.emit("join_room", room);

    const fetchMessages = async () => {
      try {
        const response = await Api.get(`/chat/messages/${currentSelectedUser.user_id}`);
        setMessages(response.data.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        addToast("Could not load chat history", "danger");
      }
    };

    fetchMessages();
    clearConversationState(currentSelectedUser.user_id);
    setIsRecipientTyping(false);
  }, [selectedUserId, user.user_id, addToast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isRecipientTyping]);

  const handleTyping = () => {
    if (!selectedUser) return;
    const ids = [user.user_id, selectedUser.user_id].sort();
    const room = `chat_${ids[0]}_${ids[1]}`;

    socket.emit("typing", { room, userId: user.user_id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { room, userId: user.user_id });
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || selectedUser.isBlocked) return;

    if (editingMessageId) {
      setIsSavingMessage(true);
      Api.patch(`/chat/messages/${editingMessageId}`, {
        message: newMessage.trim(),
      })
        .then(async () => {
          cancelEditMessage();
          await refreshUsers();
          const response = await Api.get(`/chat/messages/${selectedUser.user_id}`);
          setMessages(response.data.data);
        })
        .catch((error) => {
          console.error("Failed to edit message", error);
          addToast("Could not update message", "danger");
        })
        .finally(() => setIsSavingMessage(false));
      return;
    }

    const ids = [user.user_id, selectedUser.user_id].sort();
    const room = `chat_${ids[0]}_${ids[1]}`;

    socket.emit("send_message", {
      senderId: user.user_id,
      receiverId: selectedUser.user_id,
      message: newMessage,
      room,
    });

    socket.emit("stop_typing", { room, userId: user.user_id });
    setNewMessage("");
    setShowEmojiPicker(false);
    clearConversationState(selectedUser.user_id);
  };

  const handleDeleteMessage = async (messageId) => {
    const confirmed = window.confirm("Delete this message?");
    if (!confirmed) return;

    try {
      await Api.delete(`/chat/messages/${messageId}`);
      setMessages((prev) => prev.filter((message) => message.message_id !== messageId));
      await refreshUsers();
    } catch (error) {
      console.error("Failed to delete message", error);
      addToast("Could not delete message", "danger");
    }
  };

  const filteredUsers = users.filter((contact) =>
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleUsers = filteredUsers
    .filter((contact) => !chatSettings.hiddenContacts.includes(contact.user_id))
    .sort((a, b) => {
      const pinnedA = chatSettings.pinnedContacts.includes(a.user_id) ? 1 : 0;
      const pinnedB = chatSettings.pinnedContacts.includes(b.user_id) ? 1 : 0;
      if (pinnedA !== pinnedB) return pinnedB - pinnedA;

      if (!chatSettings.autoSortEnabled) {
        return a.username.localeCompare(b.username);
      }

      const unreadA = unreadByUser[a.user_id] ?? a.unreadCount ?? 0;
      const unreadB = unreadByUser[b.user_id] ?? b.unreadCount ?? 0;
      if (unreadA !== unreadB) return unreadB - unreadA;

      const timeA = new Date(a.lastMessageAt || 0).getTime();
      const timeB = new Date(b.lastMessageAt || 0).getTime();
      if (timeA !== timeB) return timeB - timeA;

      if (a.isOnline !== b.isOnline) return Number(b.isOnline) - Number(a.isOnline);

      return a.username.localeCompare(b.username);
    });

  const selectedConversationStatus = selectedUser
    ? selectedUser.isBlocked
      ? "Blocked"
      : selectedUser.isOnline
        ? "Online Now"
        : "Offline"
    : "";

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
      <Card className="w-80 flex flex-col p-0 overflow-hidden border-none shadow-premium bg-white dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Messages
            </h2>
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800/60 text-gray-500 dark:text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
            >
              <Settings2 size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
            </Link>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {visibleUsers.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400 dark:text-slate-500">
              No visible contacts. Open Settings to restore hidden chats.
            </div>
          ) : (
            visibleUsers.map((contact) => {
              const isActive = selectedUserId === contact.user_id;
              const unreadCount = unreadByUser[contact.user_id] ?? contact.unreadCount ?? 0;
              const isHighlighted = highlightedUserId === contact.user_id;

              return (
                <button
                  key={contact.user_id}
                  onClick={() => handleSelectUser(contact)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden text-left
                    ${isActive
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                      : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400"}
                    ${isHighlighted ? "ring-2 ring-brand-400/60 animate-pulse" : ""}
                  `}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105
                      ${isActive ? "bg-white/20" : "bg-gray-100 dark:bg-slate-700"}
                    `}
                  >
                    <UserIcon size={20} className={isActive ? "text-white" : "text-gray-500"} />
                  </div>

                  <div className="flex flex-col items-start overflow-hidden text-left flex-1 min-w-0">
                    <span className="font-bold text-sm truncate uppercase tracking-tight w-full">
                      {contact.username}
                    </span>
                    <span className={`text-[10px] font-medium uppercase tracking-widest ${isActive ? "text-white/70" : "text-gray-400"}`}>
                      {contact.role}
                    </span>
                    <span className={`mt-1 text-[11px] max-w-[180px] truncate w-full ${isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                      {contact.lastMessage
                        ? `${contact.lastMessageSenderId === user.user_id ? "You: " : ""}${contact.lastMessage}`
                        : "No messages yet"}
                    </span>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      {chatSettings.pinnedContacts.includes(contact.user_id) && (
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${isActive ? "text-white/80" : "text-fuchsia-500"}`}>
                          <Pin size={10} />
                          Pinned
                        </span>
                      )}
                      {contact.isBlocked && (
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${isActive ? "text-white/80" : "text-red-500"}`}>
                          <Ban size={10} />
                          Blocked
                        </span>
                      )}
                      {chatSettings.mutedContacts.includes(contact.user_id) && (
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${isActive ? "text-white/80" : "text-amber-500"}`}>
                          <VolumeX size={10} />
                          Muted
                        </span>
                      )}
                      {unreadCount > 0 && !isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest">
                          <Sparkles size={10} />
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-auto flex flex-col items-end gap-2">
                    {contact.lastMessageAt && (
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? "text-white/60" : "text-gray-400"}`}>
                        {new Date(contact.lastMessageAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                    <div
                      className={`w-2 h-2 rounded-full border-2 border-white dark:border-slate-800 ${
                        contact.isOnline ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    />
                    {contact.isOnline ? (
                      <Wifi size={12} className={isActive ? "text-white/70" : "text-emerald-500"} />
                    ) : (
                      <WifiOff size={12} className={isActive ? "text-white/70" : "text-gray-400"} />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </Card>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-none shadow-premium bg-white dark:bg-slate-900/50 backdrop-blur-xl">
        {selectedUser ? (
          <>
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">
                    {selectedUser.username}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedUser.isBlocked
                          ? "bg-red-500"
                          : selectedUser.isOnline
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-gray-400"
                      }`}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {selectedConversationStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleHideContact(selectedUser.user_id)}
                  className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800/60 text-gray-500 dark:text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors inline-flex items-center gap-2"
                >
                  <EyeOff size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Hide</span>
                </button>
                <button
                  onClick={() => handlePinContact(selectedUser.user_id)}
                  className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800/60 text-gray-500 dark:text-slate-400 hover:bg-fuchsia-50 hover:text-fuchsia-600 transition-colors inline-flex items-center gap-2"
                >
                  {chatSettings.pinnedContacts.includes(selectedUser.user_id) ? <PinOff size={14} /> : <Pin size={14} />}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {chatSettings.pinnedContacts.includes(selectedUser.user_id) ? "Unpin" : "Pin"}
                  </span>
                </button>
                <Link
                  to="/settings"
                  className="p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-400 inline-flex items-center justify-center"
                >
                  <Settings2 size={18} />
                </Link>
                <button className="p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-400">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 dark:bg-slate-900/10 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <Hash size={48} className="text-gray-300 mb-4" />
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">
                    No conversation history yet
                  </p>
                  <p className="text-gray-400 text-[10px] mt-1 italic">
                    Say hi to start the journey!
                  </p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={msg.message_id || msg.id || index}
                  className={`flex ${msg.senderId === user.user_id ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl shadow-sm relative group break-words
                      ${msg.senderId === user.user_id
                        ? "bg-brand-600 text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-slate-700"}
                    `}
                  >
                    {msg.senderId === user.user_id && (
                      <div className="absolute -top-3 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => startEditMessage(msg)}
                          className="p-1.5 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg.message_id)}
                          className="p-1.5 rounded-full bg-white/90 text-red-600 shadow hover:bg-white"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    <div
                      className={`flex items-center gap-1.5 mt-2 opacity-60 ${
                        msg.senderId === user.user_id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span
                        className={`text-[9px] font-bold uppercase ${
                          msg.senderId === user.user_id ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.editedAt && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-current/70">
                          edited
                        </span>
                      )}
                      {msg.senderId === user.user_id && (
                        msg.isSeen ? (
                          <CheckCheck size={12} className="text-emerald-300" />
                        ) : (
                          <Check size={12} className="text-white/50" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isRecipientTyping && (
                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-6 bg-white dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800">
              <div className="relative">
                {editingMessageId && (
                  <div className="mb-3 flex items-center justify-between rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 px-4 py-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">
                        Editing message
                      </p>
                      <p className="text-xs text-amber-700/80 dark:text-amber-200/80">
                        Update the text and save it, or cancel.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={cancelEditMessage}
                      className="p-2 rounded-full bg-white/80 dark:bg-slate-900/60 text-amber-700 dark:text-amber-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {showEmojiPicker && (
                  <div className="absolute bottom-full mb-3 left-0 z-20 w-full max-w-sm bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl p-3">
                    <div className="grid grid-cols-5 gap-2">
                      {QUICK_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => appendEmoji(emoji)}
                          className="h-11 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-lg transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800/80 p-2 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-inner">
                  <button type="button" className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-gray-400 hover:text-brand-500">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder={
                      editingMessageId
                        ? "Edit your message..."
                        : selectedUser.isBlocked
                          ? "Chat disabled for blocked user"
                          : "Drive your conversation here..."
                    }
                    className={`flex-1 bg-transparent border-none outline-none text-sm font-medium py-2 px-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 italic ${
                      selectedUser.isBlocked ? "cursor-not-allowed opacity-60" : ""
                    }`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleTyping}
                    disabled={selectedUser.isBlocked || isSavingMessage}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-gray-400 hover:text-amber-500"
                  >
                    <Smile size={20} />
                  </button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="rounded-xl px-6 h-12 shadow-lg shadow-brand-500/40"
                    disabled={selectedUser.isBlocked || isSavingMessage}
                    loading={isSavingMessage}
                  >
                    {editingMessageId ? "Save" : <Send size={18} />}
                  </Button>
                </div>

                {selectedUser.isBlocked && (
                  <p className="mt-3 text-xs font-bold uppercase tracking-widest text-red-500">
                    This contact is blocked. Chat is disabled until admin unblocks them.
                  </p>
                )}
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-3xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-8 animate-bounce transition-all">
              <MessageSquare size={40} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
              Command Center Active
            </h3>
            <p className="text-gray-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed mb-8 uppercase text-[10px] tracking-[0.2em]">
              Select a contact to start a live private chat. Online status and new message alerts update in real time.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-500" />
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                  End-to-End Encryption
                </span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center gap-2">
                <Activity size={20} className="text-brand-500" />
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                  Real-time Stream
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatDashboard;
