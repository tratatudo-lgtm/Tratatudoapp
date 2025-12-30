
import React, { useState, useEffect } from 'react';
import { ServiceDetail, PlanLevel, Document as UserDocument } from '../types';
import { 
  ChevronLeft, Info, ClipboardList, FileCheck, ArrowRight, 
  ShieldCheck, Loader2, Check, X, Zap, ShieldX, Lock,
  AlertTriangle, ShieldAlert, Crown, UploadCloud, MessageSquare,
  Sparkles, Globe, Heart, Shield, Star, Clock, Gem
} from 'lucide-react';

interface ServiceDetailViewProps {
  service: ServiceDetail;
  onBack: () => void;
  onAskQuestion: () => void;
  onViewDocuments: () => void;
  onAddToCart: (service: ServiceDetail) => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ service, onBack, onAskQuestion, onViewDocuments, onAddToCart }) => {
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [showToast, setShowToast] = useState(false);
  const [missingDocs, setMissingDocs] = useState<string[]>([]);
  
  const userPlan = (localStorage.getItem('tratatudo_plan') as PlanLevel) || 'lite';
  const isSubscriber = userPlan === 'gold' || userPlan === 'elite';

  // Calculate prices based on plans
  const basePrice = parseFloat(service.price.replace('€', ''));
  const goldPrice = service.isFreeForGold ? 0 : (service.goldDiscount ? basePrice * (1 - service.goldDiscount / 100) : basePrice);
  const elitePrice = service.isEliteExcluded ? goldPrice : 0; // Elite pays Gold price if excluded, otherwise 0

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem('tratatudo_docs') || '[]') as UserDocument[];
    const docNames = savedDocs.map(d => d.name.toLowerCase());
    const missing = service.requiredDocs.filter(req => {
      const found = docNames.some(name => name.includes(req.toLowerCase()) || req.toLowerCase().includes(name));
      return !found;
    });
    setMissingDocs(missing);
  }, [service.requiredDocs]);

  const handleAction = (planToBuy?: PlanLevel) => {
    if (orderStatus !== 'idle') return;

    if (!isSubscriber && !planToBuy) {
      // Show options or just proceed to checkout with plan?
      // For now, let's treat the footer button as "Proceed to Checkout"
    }

    setOrderStatus('loading');
    setTimeout(() => {
      onAddToCart(service);
      setOrderStatus('success');
      setShowToast(true);
      setTimeout(() => onBack(), 1500);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-white animate-in slide-in-from-right-10 duration-500 overflow-y-auto pb-44 relative scroll-smooth">
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-xs animate-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30">
            <div className="bg-white/20 p-1.5 rounded-full">
              <Check size={16} strokeWidth={3} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest flex-1">Serviço Adicionado!</p>
          </div>
        </div>
      )}

      {/* Header Visual */}
      <div className="relative bg-[#002B5B] pt-10 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
        <button onClick={onBack} className="relative z-10 mb-8 p-3 bg-white/10 text-white rounded-2xl backdrop-blur-md hover:bg-white/20 transition-all">
          <ChevronLeft size={24} />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center">
           <div className="w-20 h-20 bg-white/10 text-white rounded-[32px] flex items-center justify-center backdrop-blur-xl border border-white/20 mb-6 shadow-2xl animate-float">
              {service.icon}
           </div>
           <h2 className="text-2xl font-black text-white tracking-tight">{service.name}</h2>
           <span className="px-3 py-1 mt-4 bg-white/10 text-white rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">{service.category}</span>
        </div>
      </div>

      <div className="px-6 -mt-10 space-y-8 relative z-20">
         {/* TIERED PRICING CARD */}
         <section className="bg-white rounded-[40px] p-2 shadow-2xl border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 rounded-[36px] p-1 gap-1">
               <div className="p-4 flex flex-col items-center text-center border-r border-slate-200/50">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard</p>
                  <p className="text-lg font-black text-slate-400">{service.price}</p>
                  <span className="text-[6px] font-bold text-slate-300 uppercase mt-2">Sem Prioridade</span>
               </div>
               
               <div className="p-4 flex flex-col items-center text-center bg-white rounded-[30px] shadow-sm relative overflow-hidden border border-blue-100/50">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-amber-400/10 rounded-full -mr-4 -mt-4"></div>
                  <p className="text-[7px] font-black text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Crown size={8} /> Gold</p>
                  <p className="text-lg font-black text-blue-800">{goldPrice.toFixed(2)}€</p>
                  {service.isFreeForGold && <span className="text-[6px] font-black text-emerald-500 uppercase mt-2">Incluído</span>}
                  {!service.isFreeForGold && service.goldDiscount && <span className="text-[6px] font-black text-emerald-500 uppercase mt-2">Poupança {service.goldDiscount}%</span>}
               </div>

               <div className="p-4 flex flex-col items-center text-center">
                  <p className="text-[7px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Gem size={8} /> Elite</p>
                  <p className="text-lg font-black text-indigo-800">{elitePrice.toFixed(2)}€</p>
                  {service.isEliteExcluded ? (
                    <span className="text-[6px] font-black text-rose-500 uppercase mt-2">Excluído</span>
                  ) : (
                    <span className="text-[6px] font-black text-emerald-500 uppercase mt-2">100% Grátis</span>
                  )}
               </div>
            </div>
            
            <div className="p-4 flex items-center justify-center gap-2 bg-blue-50/50">
               <Zap size={14} className="text-blue-600" />
               <p className="text-[9px] text-blue-800 font-black uppercase tracking-widest">
                  Assinantes Gold/Elite têm atendimento prioritário IRN/AT
               </p>
            </div>
         </section>

         {/* Exclusivity Note for Elite if applicable */}
         {service.isEliteExcluded && (
           <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 flex items-start gap-3">
             <AlertTriangle size={18} className="text-amber-600 shrink-0" />
             <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
               <b>Atenção:</b> Serviços de Vistos e Nacionalidade exigem taxas governamentais e honorários jurídicos específicos, não estando incluídos na totalidade do plano Elite, mas beneficiando de desconto Gold.
             </p>
           </div>
         )}

         {/* Description */}
         <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <Info size={16} className="text-blue-600" /> Detalhes do Processo
            </h3>
            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {service.fullDesc}
               </p>
            </div>
         </section>

         {/* Required Documents */}
         <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <ClipboardList size={16} className="text-blue-600" /> Requisitos
            </h3>
            <div className="grid grid-cols-1 gap-3">
               {service.requiredDocs.map((doc, i) => (
                 <div key={i} className="p-5 rounded-3xl border border-slate-100 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                          <UploadCloud size={18} />
                       </div>
                       <span className="text-xs font-bold text-slate-700">{doc}</span>
                    </div>
                 </div>
               ))}
            </div>
         </section>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 z-40">
        <button 
          onClick={() => handleAction()}
          disabled={orderStatus === 'loading'}
          className="w-full py-5 bg-[#002B5B] text-white rounded-[28px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
        >
          {orderStatus === 'loading' ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <><Zap size={20} /> Iniciar Agora</>
          )}
        </button>
      </div>
    </div>
  );
};
