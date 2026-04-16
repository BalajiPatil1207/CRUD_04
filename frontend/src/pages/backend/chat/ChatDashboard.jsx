import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { socket } from "../../../components/chat/socket";
import { Api } from "../../../components/common/Api/api";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { Send, User as UserIcon, Hash, Search, MoreVertical, Paperclip, Smile, ShieldCheck, Activity } from "lucide-react";

const ChatDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Api.get("/chat/users");
        setUsers(response.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();

    // Connect socket
    socket.connect();
    return () => socket.disconnect();
  }, []);

  // When a user is selected, join room and fetch history
  useEffect(() => {
    if (selectedUser) {
      // Create a unique room ID based on user IDs (sorted to ensure consistency)
      const ids = [user.user_id, selectedUser.user_id].sort();
      const room = `chat_${ids[0]}_${ids[1]}`;
      
      socket.emit("join_room", room);
      
      const fetchMessages = async () => {
        try {
          const response = await Api.get(`/chat/messages/${selectedUser.user_id}`);
          setMessages(response.data.data);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
      fetchMessages();
    }
  }, [selectedUser, user.user_id]);

  // Handle receiving messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off("receive_message");
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const ids = [user.user_id, selectedUser.user_id].sort();
    const room = `chat_${ids[0]}_${ids[1]}`;

    const messageData = {
      senderId: user.user_id,
      receiverId: selectedUser.user_id,
      message: newMessage,
      room: room,
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
      {/* Sidebar - User List */}
      <Card className="w-80 flex flex-col p-0 overflow-hidden border-none shadow-premium bg-white dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Messages</h2>
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
          {filteredUsers.map((u) => (
            <button
              key={u.user_id}
              onClick={() => setSelectedUser(u)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group
                ${selectedUser?.user_id === u.user_id 
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" 
                  : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400"}
              `}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105
                ${selectedUser?.user_id === u.user_id ? "bg-white/20" : "bg-gray-100 dark:bg-slate-700"}
              `}>
                <UserIcon size={20} className={selectedUser?.user_id === u.user_id ? "text-white" : "text-gray-500"} />
              </div>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="font-bold text-sm truncate uppercase tracking-tight">{u.username}</span>
                <span className={`text-[10px] font-medium uppercase tracking-widest
                  ${selectedUser?.user_id === u.user_id ? "text-white/70" : "text-gray-400"}
                `}>
                  {u.role}
                </span>
              </div>
              {/* Online Indicator - Static for now */}
              <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />
            </button>
          ))}
        </div>
      </Card>

      {/* Main Chat Window */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-none shadow-premium bg-white dark:bg-slate-900/50 backdrop-blur-xl">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">{selectedUser.username}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online Now</span>
                  </div>
                </div>
              </div>
              <button className="p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-400">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 dark:bg-slate-900/10 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <Hash size={48} className="text-gray-300 mb-4" />
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">No conversation history yet</p>
                  <p className="text-gray-400 text-[10px] mt-1 italic">Say hi to start the journey!</p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex ${msg.senderId === user.user_id ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl shadow-sm relative group
                      ${msg.senderId === user.user_id 
                        ? "bg-brand-600 text-white rounded-tr-none" 
                        : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-slate-700"}
                    `}
                  >
                    <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                    <span className={`text-[9px] font-bold mt-2 block opacity-50 uppercase
                      ${msg.senderId === user.user_id ? "text-white" : "text-gray-400"}
                    `}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800/80 p-2 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-inner">
                <button type="button" className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-gray-400 hover:text-brand-500">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Drive your conversation here..."
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium py-2 px-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 italic"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="button" className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-gray-400 hover:text-amber-500">
                  <Smile size={20} />
                </button>
                <Button variant="primary" type="submit" className="rounded-xl px-6 h-12 shadow-lg shadow-brand-500/40">
                  <Send size={18} />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-3xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-8 animate-bounce transition-all">
              <Paperclip size={40} className="rotate-45" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Command Center Active</h3>
            <p className="text-gray-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed mb-8 uppercase text-[10px] tracking-[0.2em]">
              Select a strategic contact from the left list to initiate a high-fidelity private bridge.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center gap-2">
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">End-to-End Encryption</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center gap-2">
                    <Activity size={20} className="text-brand-500" />
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Real-time Stream</span>
                </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatDashboard;
