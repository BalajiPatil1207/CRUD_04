import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { socket, syncSocketAuth } from "../../../components/chat/socket";
import { Api } from "../../../components/common/Api/api";
import Button from "../../../components/common/Button";
import { useToast } from "../../../components/common/Toast";
import { getChatSettings, toggleHiddenContact, togglePinnedContact } from "../../../components/chat/chatSettings";
import {
  Activity,
  Ban,
  Check,
  CheckCheck,
  EyeOff,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Pencil,
  Menu,
  Pin,
  PinOff,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Smile,
  Sparkles,
  Trash2,
  User as UserIcon,
  VolumeX,
  Wifi,
  X,
} from "lucide-react";

const QUICK_EMOJIS = ["\u{1F60A}", "\u{1F602}", "\u{1F60D}", "\u{1F525}", "\u{1F44D}", "\u{1F64F}", "\u{1F4AF}", "\u{1F973}", "\u{1F4AC}", "\u2728"];

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [privacyShieldActive, setPrivacyShieldActive] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const typingTimeoutRef = useRef(null);
  const highlightTimeoutRef = useRef(null);
  const usersRef = useRef([]);
  const settingsRef = useRef(chatSettings);
  const messagesEndRef = useRef(null);
  const originalTitleRef = useRef(document.title);

  const selectedUser = users.find((contact) => contact.user_id === selectedUserId) || null;

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useEffect(() => {
    settingsRef.current = chatSettings;
  }, [chatSettings]);

  useEffect(() => {
    if (!user?.user_id) return undefined;
    const handleStorage = () => setChatSettings(getChatSettings(user.user_id));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [user?.user_id]);

  useEffect(() => {
    const updateShield = () => {
      setPrivacyShieldActive(document.hidden || !document.hasFocus());
    };

    updateShield();
    document.addEventListener("visibilitychange", updateShield);
    window.addEventListener("blur", updateShield);
    window.addEventListener("focus", updateShield);

    return () => {
      document.removeEventListener("visibilitychange", updateShield);
      window.removeEventListener("blur", updateShield);
      window.removeEventListener("focus", updateShield);
    };
  }, []);

  const clearConversationState = (contactId) => {
    setUnreadByUser((prev) => {
      if (!prev[contactId]) return prev;
      const next = { ...prev };
      delete next[contactId];
      return next;
    });
    setUsers((prev) => prev.map((contact) => (contact.user_id === contactId ? { ...contact, unreadCount: 0 } : contact)));
    setHighlightedUserId((prev) => (prev === contactId ? null : prev));
  };

  const refreshUsers = async () => {
    try {
      const response = await Api.get("/chat/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to refresh contacts", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Api.get("/chat/users");
        setUsers(response.data.data);
        const initialUnread = response.data.data.reduce((acc, contact) => {
          if (contact.unreadCount > 0) acc[contact.user_id] = contact.unreadCount;
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
    let active = true;

    const syncPresence = async () => {
      try {
        const response = await Api.get("/chat/users");
        if (!active) return;
        setUsers(response.data.data);
      } catch (error) {
        console.error("Failed to sync presence", error);
      }
    };

    const handleFocus = () => {
      syncPresence();
    };

    const intervalId = window.setInterval(syncPresence, 15000);
    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

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
        setMessages((prev) => (prev.some((msg) => msg.message_id === data.message_id) ? prev : [...prev, data]));
        if (data.senderId === selectedUserId) setIsRecipientTyping(false);
        clearConversationState(data.senderId);
        return;
      }

      if (data.senderId !== user.user_id) {
        setUnreadByUser((prev) => ({ ...prev, [data.senderId]: (prev[data.senderId] || 0) + 1 }));
        setHighlightedUserId(data.senderId);
        if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightedUserId((prev) => (prev === data.senderId ? null : prev));
        }, 1800);
        const senderName = usersRef.current.find((contact) => contact.user_id === data.senderId)?.username || "A user";
        if (shouldNotify && !isMutedContact) {
          addToast(`${senderName} sent a new message`, "info");
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`New message from ${senderName}`, { body: data.message });
          }
        }
        if (shouldSound && !isMutedContact) playSound();
      }
    };

    const handleTypingEvent = (data) => {
      if (selectedUserId && data.userId === selectedUserId) setIsRecipientTyping(true);
    };

    const handleStopTypingEvent = (data) => {
      if (selectedUserId && data.userId === selectedUserId) setIsRecipientTyping(false);
    };

    const handlePresenceUpdate = ({ userId, isOnline }) => {
      setUsers((prev) => prev.map((contact) => (contact.user_id === userId ? { ...contact, isOnline } : contact)));
    };

    const handleMessageError = ({ message }) => addToast(message || "Message could not be sent", "danger");
    const handleMessageUpdated = (updatedMessage) => {
      setMessages((prev) => prev.map((message) => (message.message_id === updatedMessage.message_id ? updatedMessage : message)));
      refreshUsers();
    };
    const handleMessageDeleted = ({ messageId, messageIds }) => {
      const ids = Array.isArray(messageIds)
        ? messageIds.map(Number)
        : messageId != null
          ? [Number(messageId)]
          : [];

      if (ids.length === 0) return;

      setMessages((prev) => prev.filter((message) => !ids.includes(message.message_id)));
      refreshUsers();
    };

    const handleMessageDelivered = ({ messageId, deliveredAt }) => {
      if (!messageId) return;

      setMessages((prev) =>
        prev.map((message) =>
          message.message_id === messageId
            ? { ...message, deliveredAt: deliveredAt || message.deliveredAt || new Date().toISOString() }
            : message
        )
      );
    };

    const handleMessagesSeen = ({ conversationUserId, seenMessageIds }) => {
      if (!conversationUserId || !Array.isArray(seenMessageIds)) return;

      setMessages((prev) =>
        prev.map((message) =>
          seenMessageIds.includes(message.message_id)
            ? { ...message, isSeen: true, deliveredAt: message.deliveredAt || new Date().toISOString() }
            : message
        )
      );

      setUsers((prev) =>
        prev.map((contact) =>
          contact.user_id === conversationUserId
            ? { ...contact, unreadCount: 0 }
            : contact
        )
      );

      if (selectedUserId === conversationUserId) {
        clearConversationState(conversationUserId);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTypingEvent);
    socket.on("stop_typing", handleStopTypingEvent);
    socket.on("presence_update", handlePresenceUpdate);
    socket.on("message_error", handleMessageError);
    socket.on("message_updated", handleMessageUpdated);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_delivered", handleMessageDelivered);
    socket.on("messages_seen", handleMessagesSeen);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTypingEvent);
      socket.off("stop_typing", handleStopTypingEvent);
      socket.off("presence_update", handlePresenceUpdate);
      socket.off("message_error", handleMessageError);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("message_delivered", handleMessageDelivered);
      socket.off("messages_seen", handleMessagesSeen);
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

  useEffect(() => {
    const originalTitle = originalTitleRef.current;
    const unreadTotal = Object.values(unreadByUser).reduce((sum, count) => sum + Number(count || 0), 0);
    document.title = unreadTotal > 0 ? `(${unreadTotal}) New chat message` : originalTitle;

    return () => {
      document.title = originalTitle;
    };
  }, [unreadByUser]);

  const handleSelectUser = (contact) => {
    setSelectedUserId(contact.user_id);
    setIsRecipientTyping(false);
    clearConversationState(contact.user_id);
    setShowEmojiPicker(false);
    setMobileSidebarOpen(false);
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
    addToast(next.hiddenContacts.includes(Number(contactId)) ? "Conversation hidden from your sidebar" : "Conversation restored to your sidebar", "info");
  };

  const handlePinContact = (contactId) => {
    if (!user?.user_id) return;
    const next = togglePinnedContact(user.user_id, contactId);
    setChatSettings(next);
    setShowEmojiPicker(false);
    addToast(next.pinnedContacts.includes(Number(contactId)) ? "Conversation pinned to the top" : "Conversation unpinned", "info");
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

  const appendEmoji = (emoji) => setNewMessage((prev) => `${prev}${emoji}`);

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
      Api.patch(`/chat/messages/${editingMessageId}`, { message: newMessage.trim() })
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
    try {
      await Api.delete(`/chat/messages/${messageId}`);
      setMessages((prev) => prev.filter((message) => message.message_id !== messageId));
      await refreshUsers();
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete message", error);
      addToast("Could not delete message", "danger");
    }
  };

  const handleCaptureBlock = (event) => {
    if (selectedUser) {
      event.preventDefault();
      addToast("Copy and capture are disabled in chat", "warning");
    }
  };

  const filteredUsers = users.filter((contact) => contact.username.toLowerCase().includes(searchTerm.toLowerCase()));
  const visibleUsers = filteredUsers
    .filter((contact) => !chatSettings.hiddenContacts.includes(contact.user_id))
    .sort((a, b) => {
      const pinnedA = chatSettings.pinnedContacts.includes(a.user_id) ? 1 : 0;
      const pinnedB = chatSettings.pinnedContacts.includes(b.user_id) ? 1 : 0;
      if (pinnedA !== pinnedB) return pinnedB - pinnedA;
      if (!chatSettings.autoSortEnabled) return a.username.localeCompare(b.username);
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

  const renderUser = (contact) => {
    const isActive = selectedUserId === contact.user_id;
    const unreadCount = unreadByUser[contact.user_id] ?? contact.unreadCount ?? 0;
    const isHighlighted = highlightedUserId === contact.user_id;
    const isPinned = chatSettings.pinnedContacts.includes(contact.user_id);

    return (
      <button
        key={contact.user_id}
        onClick={() => handleSelectUser(contact)}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all duration-200 mb-1 relative overflow-hidden ${isActive ? "bg-[#d9fdd3] dark:bg-[#202c33]" : "hover:bg-white/80 dark:hover:bg-white/5"} ${isHighlighted ? "ring-2 ring-[#25d366]/50" : ""}`}
      >
        <div className="relative shrink-0">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shadow-sm border ${isActive ? "bg-[#00a884] border-[#00a884] text-white" : "bg-gradient-to-br from-[#dff7e7] to-[#c6f3d3] border-white/80 dark:border-white/10 text-[#075e54]"}`}>
            <UserIcon size={22} />
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 h-[18px] w-[18px] rounded-full border-2 border-white dark:border-[#111b21] ${contact.isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`font-semibold truncate ${isActive ? "text-slate-900 dark:text-white" : "text-slate-800 dark:text-slate-100"}`}>{contact.username}</p>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
              {contact.lastMessageAt ? new Date(contact.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) : ""}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className={`text-sm truncate ${isActive ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
              {contact.lastMessage ? `${contact.lastMessageSenderId === user.user_id ? "You: " : ""}${contact.lastMessage}` : "No messages yet"}
            </p>
            {unreadCount > 0 && !isActive ? <span className="shrink-0 min-w-6 h-6 px-1.5 inline-flex items-center justify-center rounded-full bg-[#25d366] text-white text-[10px] font-black">{unreadCount}</span> : null}
          </div>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${contact.isOnline ? "text-emerald-600" : "text-slate-400"}`}>
              <span className={`h-2 w-2 rounded-full ${contact.isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
              {contact.isOnline ? "Online" : "Offline"}
            </span>
            {isPinned && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#00a884]"><Pin size={10} />Pinned</span>}
            {contact.isBlocked && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-red-500"><Ban size={10} />Blocked</span>}
            {chatSettings.mutedContacts.includes(contact.user_id) && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-600"><VolumeX size={10} />Muted</span>}
          </div>
        </div>
      </button>
    );
  };

  const renderMessage = (msg, index) => {
    const isMine = msg.senderId === user.user_id;
    const bubbleClass = isMine
      ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-900 dark:text-white rounded-tr-[6px]"
      : "bg-white dark:bg-[#202c33] text-slate-800 dark:text-slate-100 rounded-tl-[6px] border border-black/5 dark:border-white/10";
    const rowClass = "flex " + (isMine ? "justify-end" : "justify-start") + " animate-in slide-in-from-bottom-2 duration-300";
    const footerClass = "mt-1.5 flex items-center gap-1.5 " + (isMine ? "justify-end" : "justify-start");
    const hasDelivered = Boolean(msg.deliveredAt);
    const hasSeen = Boolean(msg.isSeen);

    return (
      <div key={msg.message_id || msg.id || index} className={rowClass}>
        <div className={`group relative max-w-[82%] md:max-w-[68%] rounded-2xl px-3.5 py-2.5 shadow-sm break-words ${bubbleClass}`}>
          {isMine && (
            <div className="absolute -top-3 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => startEditMessage(msg)} className="h-7 w-7 rounded-full bg-white text-slate-700 shadow flex items-center justify-center"><Pencil size={12} /></button>
              <button type="button" onClick={() => setDeleteTarget(msg)} className="h-7 w-7 rounded-full bg-white text-red-600 shadow flex items-center justify-center"><Trash2 size={12} /></button>
            </div>
          )}
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
          <div className={footerClass}>
            <span className="text-[10px] text-current/60">{new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
            {msg.editedAt && <span className="text-[9px] font-bold uppercase tracking-widest text-current/50">edited</span>}
            {isMine && (
              hasSeen ? (
                <CheckCheck size={13} className="text-[#53bdeb]" />
              ) : hasDelivered ? (
                <CheckCheck size={13} className="text-current/50" />
              ) : (
                <Check size={13} className="text-current/50" />
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative h-[calc(100dvh-2rem)] min-h-[calc(100dvh-2rem)] overflow-hidden rounded-[28px] border border-white/60 dark:border-slate-800 shadow-2xl shadow-black/10 select-none ${privacyShieldActive ? "privacy-shield-active" : ""}`}
      onContextMenu={handleCaptureBlock}
      onCopy={handleCaptureBlock}
      onCut={handleCaptureBlock}
    >
      <div className="absolute inset-0 bg-[#efeae2] dark:bg-[#0b141a]" />
      <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(37,211,102,0.25),transparent_30%),radial-gradient(circle_at_top_right,rgba(13,148,136,0.16),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.08] bg-[linear-gradient(rgba(0,0,0,0.75)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.75)_1px,transparent_1px)] bg-[size:22px_22px]" />

      <div className="relative z-10 flex h-full min-h-0">
        <div className={`absolute inset-0 z-20 md:hidden transition-opacity duration-300 ${mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <button
            type="button"
            aria-label="Close chat list"
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside
          className={`relative z-10 h-full min-h-0 w-[88%] max-w-[360px] border-r border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#111b21]/95 backdrop-blur-xl flex flex-col transition-transform duration-300 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="bg-[#00a884] px-5 py-4 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/75">WhatsApp style</p>
                  <h2 className="text-2xl font-black tracking-tight">Chats</h2>
                </div>
                <Link to="/settings" className="h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 inline-flex items-center justify-center transition-colors"><Settings2 size={18} /></Link>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-white/15 inline-flex items-center justify-center"><UserIcon size={18} /></div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{user?.username}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">Online chat</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#111b21]/80">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search or start a new chat" className="w-full h-12 rounded-2xl bg-[#f0f2f5] dark:bg-[#202c33] border border-transparent pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#00a884]/20 focus:border-[#00a884] text-slate-700 dark:text-slate-100 placeholder:text-slate-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0f2f5] dark:bg-[#202c33]"><Sparkles size={11} className="text-[#00a884]" />{visibleUsers.length} chats</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0f2f5] dark:bg-[#202c33]"><Wifi size={11} className="text-emerald-500" />Live</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
              {visibleUsers.length === 0 ? <div className="p-6 text-center text-sm text-gray-400 dark:text-slate-500">No visible contacts. Open Settings to restore hidden chats.</div> : visibleUsers.map(renderUser)}
            </div>
          </aside>
        </div>

        <aside className="hidden md:flex w-[340px] min-w-[300px] max-w-[360px] h-full min-h-0 border-r border-black/5 dark:border-white/10 bg-white/85 dark:bg-[#111b21]/95 backdrop-blur-xl flex-col">
          <div className="bg-[#00a884] px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/75">WhatsApp style</p>
                <h2 className="text-2xl font-black tracking-tight">Chats</h2>
              </div>
              <Link to="/settings" className="h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 inline-flex items-center justify-center transition-colors"><Settings2 size={18} /></Link>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-white/15 inline-flex items-center justify-center"><UserIcon size={18} /></div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{user?.username}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">Online chat</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#111b21]/80">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search or start a new chat" className="w-full h-12 rounded-2xl bg-[#f0f2f5] dark:bg-[#202c33] border border-transparent pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#00a884]/20 focus:border-[#00a884] text-slate-700 dark:text-slate-100 placeholder:text-slate-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0f2f5] dark:bg-[#202c33]"><Sparkles size={11} className="text-[#00a884]" />{visibleUsers.length} chats</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0f2f5] dark:bg-[#202c33]"><Wifi size={11} className="text-emerald-500" />Live</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
            {visibleUsers.length === 0 ? <div className="p-6 text-center text-sm text-gray-400 dark:text-slate-500">No visible contacts. Open Settings to restore hidden chats.</div> : visibleUsers.map(renderUser)}
          </div>
        </aside>

        <main className={`relative flex-1 min-h-0 flex flex-col bg-[#efeae2] dark:bg-[#0b141a] ${privacyShieldActive ? "blur-[10px] saturate-50" : ""}`}>
          {selectedUser && (
            <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-[0.08] dark:opacity-[0.12]">
              <div className="absolute -top-10 left-6 rotate-[-18deg] text-[10px] font-black uppercase tracking-[0.35em] text-slate-700 dark:text-slate-100 whitespace-nowrap">
                {user?.username} • {user?.email || "private"}
              </div>
              <div className="absolute top-24 right-4 rotate-[-18deg] text-[10px] font-black uppercase tracking-[0.35em] text-slate-700 dark:text-slate-100 whitespace-nowrap">
                {user?.username} • {user?.email || "private"}
              </div>
              <div className="absolute bottom-16 left-10 rotate-[-18deg] text-[10px] font-black uppercase tracking-[0.35em] text-slate-700 dark:text-slate-100 whitespace-nowrap">
                {user?.username} • {user?.email || "private"}
              </div>
            </div>
          )}
          {selectedUser ? (
            <>
              <div className="h-16 px-5 py-3 flex items-center justify-between bg-[#f0f2f5]/95 dark:bg-[#202c33]/95 border-b border-black/5 dark:border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(true)}
                    className="md:hidden h-10 w-10 rounded-full inline-flex items-center justify-center text-slate-500 hover:bg-white/80 dark:hover:bg-white/5 transition-colors"
                    aria-label="Open chat list"
                  >
                    <Menu size={18} />
                  </button>
                  <div className="relative shrink-0">
                    <div className="h-12 w-12 rounded-full bg-[#dff7e7] dark:bg-[#1f2c34] flex items-center justify-center text-[#075e54] dark:text-[#00a884] border border-white/70 dark:border-white/10"><UserIcon size={22} /></div>
                    <span className={`absolute -bottom-0.5 -right-0.5 h-[18px] w-[18px] rounded-full border-2 border-[#f0f2f5] dark:border-[#202c33] ${selectedUser.isBlocked ? "bg-red-500" : selectedUser.isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white truncate">{selectedUser.username}</h3>
                    <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      <span className={`h-2.5 w-2.5 rounded-full ${selectedUser.isBlocked ? "bg-red-500" : selectedUser.isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {selectedConversationStatus || "Select chat"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleHideContact(selectedUser.user_id)} className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-white/80 dark:hover:bg-white/5 transition-colors" title="Hide chat"><EyeOff size={18} /></button>
                  <button onClick={() => handlePinContact(selectedUser.user_id)} className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-white/80 dark:hover:bg-white/5 transition-colors" title="Pin chat">{chatSettings.pinnedContacts.includes(selectedUser.user_id) ? <PinOff size={18} /> : <Pin size={18} />}</button>
                  <Link to="/settings" className="h-10 w-10 rounded-full inline-flex items-center justify-center text-slate-500 hover:bg-white/80 dark:hover:bg-white/5 transition-colors" title="Settings"><Settings2 size={18} /></Link>
                  <button className="h-10 w-10 rounded-full inline-flex items-center justify-center text-slate-500 hover:bg-white/80 dark:hover:bg-white/5 transition-colors" title="More"><MoreVertical size={18} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5 space-y-4 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-6">
                    <div className="h-20 w-20 rounded-full bg-white/70 dark:bg-white/5 shadow-sm flex items-center justify-center text-[#00a884] mb-4"><MessageSquare size={34} /></div>
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Start your chat</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">Messages appear here in real time, with emoji support, online status, and friendly private chat.</p>
                  </div>
                ) : null}
                {messages.map(renderMessage)}
                {isRecipientTyping && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                    <div className="rounded-2xl rounded-tl-[6px] bg-white dark:bg-[#202c33] border border-black/5 dark:border-white/10 px-4 py-3 shadow-sm">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#00a884] animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-[#00a884] animate-bounce [animation-delay:0.15s]" />
                        <div className="w-2 h-2 rounded-full bg-[#00a884] animate-bounce [animation-delay:0.3s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="px-4 md:px-6 pb-4 pt-2 bg-[#f0f2f5]/95 dark:bg-[#202c33]/95 border-t border-black/5 dark:border-white/10 backdrop-blur-xl">
                {editingMessageId && (
                  <div className="mb-3 flex items-center justify-between rounded-2xl bg-[#d9fdd3] dark:bg-[#1f2c34] border border-[#25d366]/20 px-4 py-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#075e54] dark:text-[#25d366]">Editing message</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">Save changes or cancel.</p>
                    </div>
                    <button type="button" onClick={cancelEditMessage} className="h-9 w-9 rounded-full bg-white/80 dark:bg-[#111b21] inline-flex items-center justify-center text-slate-500"><X size={14} /></button>
                  </div>
                )}

                {showEmojiPicker && (
                  <div className="mb-3 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#111b21] shadow-xl p-3 max-w-sm">
                    <div className="grid grid-cols-5 gap-2">
                      {QUICK_EMOJIS.map((emoji) => (
                        <button key={emoji} type="button" onClick={() => appendEmoji(emoji)} className="h-11 rounded-2xl bg-[#f0f2f5] dark:bg-[#202c33] hover:bg-[#d9fdd3] dark:hover:bg-[#1f2c34] text-lg transition-colors">{emoji}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-[28px] bg-white dark:bg-[#2a3942] border border-black/5 dark:border-white/10 px-3 py-2 shadow-sm">
                  <button type="button" className="h-11 w-11 rounded-full inline-flex items-center justify-center text-slate-500 hover:bg-[#f0f2f5] dark:hover:bg-white/5 transition-colors" title="Attach"><Paperclip size={18} /></button>
                  <button type="button" onClick={() => setShowEmojiPicker((prev) => !prev)} className="h-11 w-11 rounded-full inline-flex items-center justify-center text-slate-500 hover:bg-[#f0f2f5] dark:hover:bg-white/5 transition-colors" title="Emoji"><Smile size={18} /></button>
                  <input type="text" placeholder={editingMessageId ? "Edit your message..." : selectedUser.isBlocked ? "Chat disabled for blocked user" : "Type a message"} className="flex-1 bg-transparent border-none outline-none text-[15px] px-2 py-3 text-slate-700 dark:text-slate-100 placeholder:text-slate-400" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleTyping} disabled={selectedUser.isBlocked || isSavingMessage} />
                  <Button variant="primary" type="submit" className="h-11 min-w-11 rounded-full px-4 bg-[#00a884] hover:bg-[#029d79] shadow-none" disabled={selectedUser.isBlocked || isSavingMessage} loading={isSavingMessage}>{editingMessageId ? "Save" : <Send size={16} />}</Button>
                </div>

                {selectedUser.isBlocked && <p className="mt-2 text-[11px] font-medium text-red-500 px-2">This contact is blocked. Chat is disabled until admin unblocks them.</p>}
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <div className="h-24 w-24 rounded-full bg-[#d9fdd3] dark:bg-[#1f2c34] flex items-center justify-center text-[#00a884] shadow-sm mb-6"><MessageSquare size={38} /></div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Select a chat</h3>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-md">Pick a contact from the sidebar to start a private conversation with live online status and message updates.</p>
              <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="rounded-3xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 p-5"><ShieldCheck size={20} className="mx-auto text-[#00a884]" /><p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Private chat</p></div>
                <div className="rounded-3xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 p-5"><Activity size={20} className="mx-auto text-[#00a884]" /><p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live presence</p></div>
              </div>
            </div>
          )}
        </main>

        {privacyShieldActive && selectedUser && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-[2px] pointer-events-none">
            <div className="max-w-sm rounded-3xl border border-white/10 bg-slate-950/85 px-6 py-5 text-center text-white shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">
                Privacy Shield Active
              </p>
              <h3 className="mt-2 text-xl font-black">Chat hidden while inactive</h3>
              <p className="mt-2 text-sm text-white/70">
                This view blurs automatically when you switch tabs, minimize, or lose focus.
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/50">
                Screen recording and screenshots cannot be fully blocked in a browser
              </p>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/55 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-950 text-white shadow-2xl p-6 md:p-8">
              <div className="w-14 h-14 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-300">
                Delete message
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight">
                Remove this message?
              </h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                This will delete the message for both sides. This action cannot be undone.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/10"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleDeleteMessage(deleteTarget.message_id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
