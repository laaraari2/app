import React, { useState } from 'react';
import { Send, X, MessageSquare, User, CheckCheck } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface MessagingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessagingDrawer: React.FC<MessagingDrawerProps> = ({ isOpen, onClose }) => {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      sender: isAr ? 'إدارة المدرسة (سي بنسعيد)' : 'Direction (M. Bensaid)',
      text: isAr ? 'السلام عليكم، تم التأكد من رفع نقط المراقبة المستمرة لمسار.' : 'Bonjour, le transfert des notes MASSAR est finalisé.',
      time: '09:30',
      isMe: false,
    },
    {
      id: '2',
      sender: isAr ? 'أنت (المسؤول)' : 'Vous (Responsable)',
      text: isAr ? 'ممتاز، شكرًا جزيلًا. هل تم تفعيل إشعارات الواتساب للآباء؟' : 'Parfait, merci. Est-ce que les relances WhatsApp parents sont actives ?',
      time: '09:32',
      isMe: true,
    },
  ]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: isAr ? 'أنت' : 'Vous',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      },
    ]);
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full border-s border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xl animate-slideIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{isAr ? 'المراسلات الداخلية والمراسلات المباشرة' : 'Messagerie Interne & Parents'}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-slate-400 mb-1">{msg.sender}</span>
              <div
                className={`p-3 rounded-2xl max-w-[85%] ${
                  msg.isMe
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                {msg.time} {msg.isMe && <CheckCheck className="w-3 h-3 text-blue-400" />}
              </span>
            </div>
          ))}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isAr ? 'اكتب رسالتك للموظفين أو الأسر...' : 'Écrivez un message...'}
            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
