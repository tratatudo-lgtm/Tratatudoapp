
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, ChevronRight, User, Sparkles, Send, 
  Globe, Loader2, AlertCircle, Languages, Check, RefreshCw 
} from 'lucide-react';
import { translateText } from '../services/geminiService';

interface AdminChatViewProps {
  onUpdateUnreadAdminCount: (count: number) => void; // New prop for admin notification count
}

// Internal type for mock chats
interface AdminChat {
  id: string;
  name: string;
  lastMsg: string;
  time: string;
  unread: boolean;
  process: string;
  lang: string;
}

export const AdminChatView: React.FC<AdminChatViewProps> = ({ onUpdateUnreadAdminCount }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [targetLang, setTargetLang] = useState('Português');
  const [translatedMsgs, setTranslatedMsgs] = useState<Record<string, string>>({});
  const [loadingTranslation, setLoadingTranslation] = useState<Record<string, boolean>>({});

  // Use internal state for activeChats to allow modifying `unread` status
  const [activeChats, setActiveChats] = useState<AdminChat[]>([
    { id: '1', name: 'João Silva', lastMsg: 'I need to know about my D7 visa status and the required documents.', time: '2 min', unread: true, process: 'Visto D7', lang: 'en' },
    { id: '2', name: 'Maria Oliveira', lastMsg: 'Já carreguei o meu NIF, podem validar?', time: '1h', unread: false, process: 'NIF Expresso', lang: 'pt' },
    { id: '3', name: 'Carlos Santos', lastMsg: '¿Cuándo estará listo mi contrato de alquiler?', time: '3h', unread: false, process: 'Arrendamento', lang: 'es' },
  ]);

  const languages = [
    'Português', 'English', 'Français', 'Español', 'Deutsch', 'Italiano'
  ];

  useEffect(() => {
    // Calculate unread count and send to parent on mount and whenever activeChats changes
    const unreadCount = activeChats.filter(chat => chat.unread).length;
    onUpdateUnreadAdminCount(unreadCount);
  }, [activeChats, onUpdateUnreadAdminCount]);

  const handleTranslate = async (chatId: string, text: string) => {
    // Se já estiver traduzido para o mesmo idioma, não faz nada
    const cacheKey = `${chatId}-${targetLang}`;
    if (translatedMsgs[cacheKey]) return;

    setLoadingTranslation(prev => ({ ...prev, [chatId]: true }));
    const translated = await translateText(text, targetLang);
    setTranslatedMsgs(prev => ({ ...prev, [cacheKey]: translated }));
    setLoadingTranslation(prev => ({ ...prev, [chatId]: false }));
  };

  const handleSelectChat = (id: string) => {
    setSelectedChat(id);
    // Mark the selected chat as read
    setActiveChats(prevChats => 
      prevChats.map(chat => 
        chat.id === id ? { ...chat, unread: false } : chat
      )
    );
  };

  if (selectedChat) {
    const chat = activeChats.find(c => c.id === selectedChat);
    if (!chat) return null; // Should not happen if selectedChat is valid
    
    const isForeign = chat.lang && chat.lang !== 'pt';
    const cacheKey = `${chat.id}-${targetLang}`;

    return (
      <div className="flex flex-col h-[calc(100vh-140px)] animate-in slide-in-from-right-4 duration-300">
        <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
          <button onClick={() => setSelectedChat(null)} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
            <ChevronRight className="rotate-180" size={24} />
          </button>
          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-lg shadow-inner">
            {chat.name[0]}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm leading-none">{chat.name}</h3>
            <p className="text-[10px] text-slate-400 uppercase mt-1 tracking-tighter font-black">{chat.process}</p>
          </div>
          
          {/* Seletor de Idioma de Tradução */}
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
             <Languages size={14} className="text-blue-400" />
             <select 
               value={targetLang}
               onChange={(e) => setTargetLang(e.target.value)}
               className="bg-transparent text-[10px] font-black uppercase outline-none text-slate-300 cursor-pointer"
             >
               {languages.map(l => <option key={l} value={l} className="bg-slate-900 text-white">{l}</option>)}
             </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-[90%] shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50">
                <span className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1">
                   <Globe size={10} /> Original ({chat.lang})
                </span>
                <button 
                  onClick={() => handleTranslate(chat.id, chat.lastMsg)}
                  disabled={loadingTranslation[chat.id]}
                  className="text-[9px] font-black uppercase text-blue-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                >
                  {loadingTranslation[chat.id] ? <Loader2 size={10} className="animate-spin" /> : <><RefreshCw size={10} /> Traduzir para {targetLang}</>}
                </button>
              </div>
              
              <p className="text-sm text-slate-800 leading-relaxed">{chat.lastMsg}</p>
              
              {translatedMsgs[cacheKey] && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-500">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Tradução ({targetLang}):</span>
                   </div>
                   <p className="text-sm text-slate-700 font-medium italic bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/50">
                     "{translatedMsgs[cacheKey]}"
                   </p>
                </div>
              )}

              <p className="text-[9px] text-slate-300 mt-3 text-right font-bold uppercase">{chat.time} atrás</p>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 max-w-[85%] shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                 <Sparkles size={12} className="text-blue-600" />
                 <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">IA Sugestão</span>
              </div>
              <p className="text-xs text-slate-700 italic opacity-80 leading-relaxed">
                "Olá {chat.name.split(' ')[0]}, estamos a analisar o seu pedido. Por favor aguarde um momento."
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
           <div className="mb-3 flex items-center gap-2 px-1">
             <AlertCircle size={12} className="text-amber-500" />
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Responda no seu idioma padrão. A IA pode ajudar na tradução reversa se necessário.</span>
           </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-200 shadow-inner">
            <textarea 
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Escreva a sua resposta..."
              className="flex-1 bg-transparent text-sm p-3 outline-none resize-none h-14 scrollbar-hide font-medium"
            />
            <button className="w-12 h-12 bg-[#002B5B] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Conversas</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Gestão com Tradução IA</p>
        </div>
        <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-[#002B5B] shadow-sm">
          <MessageSquare size={24} />
        </div>
      </div>
      
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Pesquisar por cliente ou idioma..." 
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
        />
      </div>

      <div className="space-y-3">
        {activeChats.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => handleSelectChat(chat.id)}
            className={`bg-white p-5 rounded-[32px] border transition-all flex items-center gap-4 cursor-pointer relative overflow-hidden group ${
              chat.unread ? 'border-blue-500 ring-4 ring-blue-500/5 shadow-xl scale-[1.02]' : 'border-slate-100 hover:border-blue-200 shadow-sm'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-inner bg-slate-50 text-slate-700 flex items-center justify-center font-black text-xl relative group-hover:bg-[#002B5B] group-hover:text-white transition-all">
              {chat.name[0]}
              {chat.unread && <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white animate-pulse"></span>}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-black text-slate-800 text-sm truncate">{chat.name}</h4>
                <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap uppercase">{chat.time}</span>
              </div>
              <p className={`text-[11px] truncate leading-tight ${chat.unread ? 'text-slate-900 font-black' : 'text-slate-500 font-medium'}`}>
                {chat.lastMsg}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-blue-100">
                  {chat.process}
                </span>
                {chat.lang !== 'pt' && (
                  <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-amber-100 flex items-center gap-1">
                    <Languages size={10} /> {chat.lang.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            
            <ChevronRight size={18} className="text-slate-300 group-hover:text-[#002B5B] transition-colors shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
