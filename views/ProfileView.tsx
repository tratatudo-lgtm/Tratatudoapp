
import React, { useState, useEffect } from 'react';
import { 
  Settings, CreditCard, Bell, LogOut, ChevronRight, ShieldCheck, 
  HelpCircle, Globe, Check, X, Shield, Lock, Eye, Info, 
  ChevronDown, Sparkles, User, Mail, Smartphone, MapPin, 
  Calendar, Save, EyeOff, BellRing, BellOff, Loader2,
  FileWarning, Scale, Database, ShieldAlert, Download,
  Fingerprint, KeyRound, AlertTriangle, History, Link as LinkIcon,
  CheckCircle2, Trash2, Gavel, FileSignature, Landmark, Key,
  FileText, Printer
} from 'lucide-react';
import { AppView, Document as UserDocument } from '../types';
import { languages, getBrowserLang } from '../services/i18n';

interface ProfileViewProps {
  onLogout: () => void;
  onNavigate: (view: AppView) => void;
  onLangChange: (code: any) => void;
}

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onLogout, onNavigate, onLangChange }) => {
  const [activeModal, setActiveModal] = useState<'language' | 'faq' | 'security' | 'settings' | 'contracts' | null>(null);
  const [selectedLang, setSelectedLang] = useState(getBrowserLang());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [viewingContract, setViewingContract] = useState<UserDocument | null>(null);
  const [contracts, setContracts] = useState<UserDocument[]>([]);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    name: 'João Silva',
    email: 'joao.silva@gmail.com',
    phone: '912 345 678',
    birthDate: '1988-05-15',
    address: 'Rua de Origem 123, São Paulo, Brasil',
    notifications: {
      push: true,
      email: true,
      sms: false
    }
  });

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem('tratatudo_docs') || '[]') as UserDocument[];
    const contractDocs = savedDocs.filter(d => d.name.includes('Contrato') || d.category === 'Legal');
    setContracts(contractDocs);
  }, [activeModal]);

  const faqs: FAQItem[] = [
    { 
      category: "RESPONSABILIDADE",
      q: "A TrataTudo pode garantir o sucesso do meu visto?", 
      a: "Não. A TrataTudo é uma entidade privada de consultoria. A decisão final é uma prerrogativa soberana e exclusiva das autoridades portuguesas (AIMA, Consulados, etc.)." 
    },
    { 
      category: "DOCUMENTAÇÃO",
      q: "O que acontece se um documento for rejeitado?", 
      a: "O utilizador é o único responsável pela autenticidade. Documentos falsos resultam em rescisão imediata e possíveis sanções legais." 
    },
    { 
      category: "SEGURANÇA",
      q: "Como os meus dados são protegidos?", 
      a: "Utilizamos encriptação AES-256 e registamos hashes SHA-256 na Blockchain Polygon para garantir a integridade total dos seus ficheiros." 
    }
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLanguageChange = (code: string) => {
    setSelectedLang(code as any);
    localStorage.setItem('tratatudo_lang', code);
    onLangChange(code);
    setActiveModal(null);
    triggerToast('Idioma atualizado!');
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      triggerToast('Dados atualizados com sucesso!');
      setActiveModal(null);
    }, 1500);
  };

  const menuItems = [
    { id: 'settings', icon: Settings, label: 'Definições da Conta', color: 'text-slate-600', extra: 'Dados Pessoais' },
    { id: 'contracts', icon: FileSignature, label: 'Meus Contratos', color: 'text-amber-600', extra: `${contracts.length} Ativos` },
    { id: 'language', icon: Globe, label: 'Idioma da Aplicação', color: 'text-blue-600', extra: selectedLang.toUpperCase() },
    { id: 'billing', icon: CreditCard, label: 'Faturação e Pagamentos', color: 'text-slate-600' },
    { id: 'security', icon: ShieldCheck, label: 'Segurança e Responsabilidade', color: 'text-emerald-600', extra: 'Web3 Ativa' },
    { id: 'support', icon: HelpCircle, label: 'Suporte e FAQ Legal', color: 'text-orange-600' },
  ];

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-xs animate-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <div className="bg-blue-600 p-1.5 rounded-full text-white"><Check size={14} strokeWidth={3} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest flex-1">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-40"></div>
        <div className="w-28 h-28 rounded-[40px] border-4 border-slate-50 p-1.5 mb-6 relative shadow-inner">
          <img src="https://i.pravatar.cc/150?u=client" alt="Avatar" className="w-full h-full rounded-[32px] object-cover shadow-sm" />
          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-2xl border-4 border-white shadow-lg">
            <Fingerprint size={16} />
          </div>
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">{profileData.name}</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Soberania de Dados Auditada</p>
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 divide-y divide-slate-50">
        {menuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => (item.id === 'billing' ? onNavigate('billing') : setActiveModal(item.id as any))}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2.5 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">{item.label}</p>
                {item.extra && <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-0.5">{item.extra}</p>}
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}
      </div>

      <button 
        onClick={onLogout}
        className="w-full p-6 bg-rose-50 text-rose-600 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all border border-rose-100"
      >
        Terminar Sessão <LogOut size={18} />
      </button>

      {/* MODAL: MEUS CONTRATOS */}
      {activeModal === 'contracts' && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-sm h-[80vh] rounded-[48px] overflow-hidden shadow-2xl p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-800">Meus Contratos</h3>
               <button onClick={() => setActiveModal(null)} className="p-2 text-slate-300"><X size={24} /></button>
            </div>
            <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide flex-1">
               {contracts.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full opacity-20 text-center">
                    <FileSignature size={48} className="mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">Nenhum Contrato Ativo</p>
                 </div>
               ) : (
                 contracts.map(cnt => (
                   <button 
                    key={cnt.id}
                    onClick={() => setViewingContract(cnt)}
                    className="w-full p-5 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-between hover:border-amber-400 transition-all"
                   >
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><FileText size={18} /></div>
                        <div className="text-left">
                           <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter truncate w-32">{cnt.name}</p>
                           <p className="text-[8px] text-slate-400 font-bold">Gerado em {new Date(cnt.signedAt!).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <ChevronRight size={16} className="text-slate-300" />
                   </button>
                 ))
               )}
            </div>
          </div>
        </div>
      )}

      {/* VISUALIZADOR DE CONTRATO */}
      {viewingContract && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center animate-in zoom-in-95">
           <div className="bg-white w-full max-w-md h-[90vh] rounded-[48px] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Visualizar Contrato</h3>
                <button onClick={() => setViewingContract(null)} className="p-2 text-slate-300"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 bg-slate-100/30">
                <div className="bg-white p-10 rounded-[10px] shadow-xl border border-slate-200 relative font-serif text-[11px] leading-relaxed text-slate-800">
                  <div className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-end">
                    <h1 className="text-lg font-black uppercase tracking-tighter">TrataTudo Digital</h1>
                    <span className="text-[8px] font-black uppercase text-blue-600">Documento Autenticado</span>
                  </div>
                  <div className="whitespace-pre-wrap">
                    {viewingContract.content}
                  </div>
                  <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-4">Certificação de Integridade</p>
                    <div className="flex justify-center gap-6 opacity-30">
                       <ShieldCheck size={32} />
                       <Fingerprint size={32} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white border-t border-slate-100">
                <button onClick={() => window.print()} className="w-full bg-[#002B5B] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                  <Printer size={18} /> Baixar PDF Contratual
                </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: DEFINIÇÕES DA CONTA */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-50 w-full max-w-md h-[92vh] sm:h-auto rounded-t-[48px] sm:rounded-[48px] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 text-white rounded-xl"><User size={20} /></div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Dados Pessoais</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 text-slate-300"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide pb-24">
              {/* Form Dados */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={e => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Principal</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={e => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Telemóvel</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="tel" 
                        value={profileData.phone}
                        onChange={e => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-slate-700 outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Nascimento</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="date" 
                        value={profileData.birthDate}
                        onChange={e => setProfileData({...profileData, birthDate: e.target.value})}
                        className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-slate-700 outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Morada Oficial</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                    <textarea 
                      rows={2}
                      value={profileData.address}
                      onChange={e => setProfileData({...profileData, address: e.target.value})}
                      className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 resize-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Preferências Notificação */}
              <div className="bg-white rounded-[32px] p-6 border border-slate-100 space-y-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Bell size={12} /> Notificações de Processos
                 </h4>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Notificações Push</span>
                    <button 
                      onClick={() => setProfileData({
                        ...profileData, 
                        notifications: { ...profileData.notifications, push: !profileData.notifications.push }
                      })}
                      className={`w-12 h-6 rounded-full transition-all relative ${profileData.notifications.push ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profileData.notifications.push ? 'left-7' : 'left-1'}`}></div>
                    </button>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Alertas SMS</span>
                    <button 
                      onClick={() => setProfileData({
                        ...profileData, 
                        notifications: { ...profileData.notifications, sms: !profileData.notifications.sms }
                      })}
                      className={`w-12 h-6 rounded-full transition-all relative ${profileData.notifications.sms ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profileData.notifications.sms ? 'left-7' : 'left-1'}`}></div>
                    </button>
                 </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
              <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'A GRAVAR...' : 'GRAVAR ALTERAÇÕES'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IDIOMA EXPANDIDO */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-sm h-[80vh] rounded-[48px] overflow-hidden shadow-2xl p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-800">Idioma</h3>
               <button onClick={() => setActiveModal(null)} className="p-2 text-slate-300"><X size={24} /></button>
            </div>
            <div className="space-y-2 overflow-y-auto pr-2 scrollbar-hide">
               {languages.map(lang => (
                 <button 
                   key={lang.code}
                   onClick={() => handleLanguageChange(lang.code)}
                   className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${selectedLang === lang.code ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/10' : 'border-slate-100 hover:bg-slate-50'}`}
                 >
                   <div className="flex items-center gap-4">
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-bold text-slate-800">{lang.name}</span>
                   </div>
                   {selectedLang === lang.code && <CheckCircle2 size={18} className="text-blue-600" />}
                 </button>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SEGURANÇA WEB3 */}
      {activeModal === 'security' && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-50 w-full max-w-md h-[92vh] sm:h-auto rounded-t-[48px] sm:rounded-[48px] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl"><ShieldCheck size={20} /></div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Segurança e Termos</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 text-slate-300"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide pb-24">
              <section className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-blue-500" />
                      <span className="text-[10px] font-black uppercase text-slate-400">Integridade Web3</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase">Ativa</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock size={16} className="text-indigo-500" />
                      <span className="text-[10px] font-black uppercase text-slate-400">Encriptação AES-256</span>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase">Militar</span>
                 </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Scale size={12} /> Isenção de Responsabilidade
                </h4>
                <div className="bg-amber-50 rounded-[32px] p-6 border border-amber-200 space-y-6">
                   <div className="flex items-start gap-3">
                      <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-1" />
                      <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                        Ao utilizar esta plataforma, o utilizador reconhece e aceita os limites de responsabilidade da TrataTudo.pt.
                      </p>
                   </div>
                   
                   <div className="space-y-4 pt-4 border-t border-amber-200">
                      <div className="flex items-start gap-3">
                         <div className="p-1 bg-amber-200/50 rounded-lg mt-1"><Landmark size={12} className="text-amber-700" /></div>
                         <div>
                            <p className="text-[10px] text-amber-950 font-black uppercase">Decisões Soberanas</p>
                            <p className="text-[9px] text-amber-800 leading-tight mt-0.5">Não garantimos aprovações estatais.</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <div className="p-1 bg-amber-200/50 rounded-lg mt-1"><FileSignature size={12} className="text-amber-700" /></div>
                         <div>
                            <p className="text-[10px] text-amber-950 font-black uppercase">Veracidade de Dados</p>
                            <p className="text-[9px] text-amber-800 leading-tight mt-0.5">O utilizador é o único responsável pelos documentos.</p>
                         </div>
                      </div>
                   </div>
                </div>
              </section>
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
              <button 
                onClick={() => setActiveModal(null)}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} /> CONFIRMAR RESPONSABILIDADES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FAQ */}
      {activeModal === 'support' && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-sm h-[85vh] rounded-[48px] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-orange-100 text-orange-600 rounded-xl"><Gavel size={20} /></div>
                 <h3 className="text-lg font-black text-slate-800 tracking-tight">FAQ Legal</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 text-slate-300 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`border rounded-3xl transition-all overflow-hidden ${expandedFaq === idx ? 'border-orange-200 bg-orange-50/20' : 'border-slate-50 bg-slate-50'}`}>
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <div className="flex-1">
                       <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest block mb-1">{faq.category}</span>
                       <span className="text-xs font-bold text-slate-800 pr-4">{faq.q}</span>
                    </div>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed border-t border-orange-100 pt-4">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
