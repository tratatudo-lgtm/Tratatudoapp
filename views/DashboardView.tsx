
import React, { useState, useEffect } from 'react';
import { UserProcess, ProcessStatus, ServiceDetail, CartItem, PlanLevel, Invoice } from '../types';
import { t, LanguageCode } from '../services/i18n';
// Added missing FileText import
import { 
  Sun, Moon, Crown, Rocket, CreditCard, ArrowRight, ChevronRight, 
  BrainCircuit, ShieldAlert, Lock, Zap, Star, ShieldCheck, 
  Sparkles, AlertTriangle, ShieldX, Receipt, Clock, ExternalLink,
  Check, TrendingUp, ZapOff, Fingerprint, Shield as ShieldIcon,
  FileText
} from 'lucide-react';

interface DashboardViewProps {
  onSelectService: (service: ServiceDetail) => void;
  onTalkToSupport: () => void;
  cartItems?: CartItem[];
  onNavigateToDocs: (filter?: string) => void;
  onNavigateToBilling: (tab?: 'plans' | 'cart' | 'invoices') => void;
  services: ServiceDetail[];
  lang?: LanguageCode;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onSelectService, 
  onTalkToSupport, 
  cartItems = [],
  onNavigateToDocs,
  onNavigateToBilling,
  services,
  lang = 'pt' as LanguageCode
}) => {
  const [userPlan, setUserPlan] = useState<PlanLevel>((localStorage.getItem('tratatudo_plan') as PlanLevel) || 'lite');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  
  const isSubscriber = userPlan === 'gold' || userPlan === 'elite';

  useEffect(() => {
    try {
      const savedInvoices = JSON.parse(localStorage.getItem('tratatudo_invoices') || '[]');
      setRecentInvoices(savedInvoices.slice(0, 3));
    } catch (e) {
      setRecentInvoices([]);
    }

    const timer = setInterval(() => {
      setActiveCarouselIndex((prev) => (prev + 1) % services.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [services]);

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-24 bg-slate-50">
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .service-grid-anim {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      
      <header className="pt-4 px-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-amber-500 animate-pulse">
             <Sun size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 leading-none">{t('welcome', lang as LanguageCode)}, João</h2>
            <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${isSubscriber ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
               {isSubscriber ? <Crown size={10} /> : <Rocket size={10} />} 
               Plano {userPlan.toUpperCase()}
            </div>
          </div>
        </div>
        <button onClick={() => onNavigateToBilling('cart')} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm active:scale-95 transition-all relative">
          <CreditCard size={20} />
          {cartItems.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 rounded-full border-2 border-white animate-bounce"></span>}
        </button>
      </header>

      {/* Relembrando benefícios de plano */}
      <section 
        onClick={() => onNavigateToBilling('plans')}
        className={`rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl cursor-pointer active:scale-95 transition-all group ${isSubscriber ? 'bg-emerald-600' : 'bg-[#002B5B]'}`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className={`w-12 h-12 ${isSubscriber ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-amber-950'} rounded-2xl flex items-center justify-center shrink-0 shadow-lg animate-float`}>
             {isSubscriber ? <Zap size={24} strokeWidth={3} /> : <Star size={24} strokeWidth={3} />}
          </div>
          <div className="flex-1">
             <h4 className="text-xs font-black uppercase tracking-widest leading-none">
                {isSubscriber ? 'Suporte Prioritário Ativo' : 'Consiga Preços até 100% Grátis'}
             </h4>
             <p className="text-[10px] font-medium text-slate-200 leading-tight mt-1.5">
                {isSubscriber ? 'Estamos a tratar dos seus processos com máxima urgência.' : 'Assine o Plano Gold para obter serviços grátis e apoio 24/7.'}
             </p>
          </div>
          <ArrowRight size={20} className="text-white/40 group-hover:translate-x-1 transition-transform" />
        </div>
      </section>

      {/* CARROSSEL PRINCIPAL INTERATIVO */}
      <section className="relative h-64 rounded-[40px] overflow-hidden shadow-2xl bg-slate-900">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-900/40 to-indigo-900/60 backdrop-blur-[1px]"></div>
         {services.map((service, idx) => (
           <div 
             key={service.id}
             className={`absolute inset-0 p-8 flex flex-col justify-center transition-all duration-700 ease-in-out ${idx === activeCarouselIndex ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
           >
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 text-white rounded-2xl backdrop-blur-xl border border-white/20 shadow-inner">
                        {service.icon}
                    </div>
                    {service.isFreeForGold && (
                       <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-400 text-emerald-950 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                          <Check size={10} /> Grátis com Gold
                       </span>
                    )}
                 </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-2 leading-tight drop-shadow-md">{service.name}</h3>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider mb-6">{service.category}</p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onSelectService(service)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-500 active:scale-95 transition-all flex items-center gap-2"
                >
                  Abrir Processo <ArrowRight size={14} />
                </button>
              </div>
           </div>
         ))}
         
         {/* Dot indicators */}
         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {services.slice(0, 5).map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${activeCarouselIndex % 5 === i ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}></div>
            ))}
         </div>
      </section>

      {/* CATÁLOGO DE SERVIÇOS EXPANDIDO */}
      <section>
         <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
               O Teu Catálogo <Sparkles size={14} className="text-blue-600" />
            </h3>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
               <TrendingUp size={12} className="text-emerald-500" />
               <span className="text-[8px] font-black text-slate-400 uppercase">Mercado Atualizado</span>
            </div>
         </div>
         
         <div className="service-grid-anim">
            {services.map((service) => (
              <button 
                key={service.id} 
                onClick={() => onSelectService(service)}
                className="bg-white p-5 rounded-[32px] border border-slate-100 text-left hover:border-blue-300 hover:shadow-lg transition-all shadow-sm group relative overflow-hidden flex flex-col h-full"
              >
                 <div className="flex justify-between items-start mb-4 shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        {service.icon}
                    </div>
                    {service.isFreeForGold && (
                       <span className="text-[7px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md uppercase border border-emerald-100">Livre</span>
                    )}
                 </div>
                 <h4 className="text-[11px] font-black text-slate-800 leading-tight mb-1 line-clamp-1">
                    {service.name}
                 </h4>
                 <p className="text-[8px] text-slate-400 font-bold leading-tight line-clamp-2 uppercase flex-1">
                    {service.desc}
                 </p>
                 <div className="flex items-center justify-between pt-4 mt-auto">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-black text-blue-600 group-hover:scale-105 transition-transform">{service.price}</span>
                       <span className="text-[7px] text-slate-300 font-bold uppercase tracking-tighter">Taxa Única</span>
                    </div>
                    <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <ChevronRight size={14} className="text-slate-200 group-hover:text-blue-600" />
                    </div>
                 </div>
              </button>
            ))}
         </div>
      </section>

      {/* Quick Access Documents Card */}
      <section 
        onClick={() => onNavigateToDocs()}
        className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm flex items-center gap-6 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[28px] flex items-center justify-center shrink-0">
          <FileText size={32} />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-800 leading-none">Minha Biblioteca</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest leading-tight">Consulte e partilhe os seus documentos oficiais.</p>
        </div>
      </section>

      {/* Footer Protection */}
      <div className="bg-slate-900 p-8 rounded-[40px] border border-white/10 shadow-2xl flex items-center gap-5 text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-1000"><ShieldIcon size={80} /></div>
         <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:rotate-12 transition-transform">
            <ShieldCheck size={28} />
         </div>
         <div className="relative z-10">
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Segurança de Dados IRN</h4>
            <p className="text-[10px] text-slate-300 leading-relaxed mt-1 font-medium italic">
               Todos os seus ficheiros são cifrados com autenticação biométrica e hash imutável.
            </p>
         </div>
      </div>
    </div>
  );
};
