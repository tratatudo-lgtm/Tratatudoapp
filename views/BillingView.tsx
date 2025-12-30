
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Download, ChevronLeft, Plus, 
  CheckCircle2, Clock, Smartphone, ShieldCheck, X, 
  ArrowRight, Loader2, Check, Zap, Crown, Gem,
  Globe, BellRing, Wallet, Phone, AlertCircle,
  Trash2, ShoppingBag, Receipt, FileText, ExternalLink,
  ShieldAlert, Landmark, ReceiptText, FileCheck, Star, FileSignature, Lock,
  AlertTriangle
} from 'lucide-react';
import { UserRole, PlanLevel, CartItem, Invoice, Document as UserDocument, PaymentContext } from '../types';

interface BillingViewProps {
  onBack: () => void;
  role: UserRole;
  cart: CartItem[];
  removeFromCart: (index: number) => void;
  onClearCart: () => void;
  invoices: Invoice[];
  onAddInvoice: (invoice: Invoice) => void;
  initialTab?: 'plans' | 'cart' | 'invoices';
  onNavigateToChatForPayment: (context: PaymentContext) => void; // New prop for payment flow
}

export const BillingView: React.FC<BillingViewProps> = ({ 
  onBack, 
  role, 
  cart = [], 
  removeFromCart, 
  onClearCart,
  invoices = [],
  onAddInvoice,
  initialTab = 'plans',
  onNavigateToChatForPayment // Destructure new prop
}) => {
  const [userPlan, setUserPlan] = useState<PlanLevel>((localStorage.getItem('tratatudo_plan') as PlanLevel) || 'lite');
  const [activeTab, setActiveTab] = useState<'plans' | 'cart' | 'invoices'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const priceVal = parseFloat(item.price.replace('€', '').replace('Incluído', '0')) || 0;
      return acc + priceVal;
    }, 0);
  };

  const handleInitiatePayment = (context: PaymentContext) => {
    onNavigateToChatForPayment(context);
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-24 min-h-[calc(100vh-64px)] bg-slate-50">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-white rounded-xl text-slate-400"><ChevronLeft size={20} /></button>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Faturação</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-widest">Finanças & Gestão</p>
          </div>
        </div>
        <div className="p-3 bg-white border border-slate-100 text-[#002B5B] rounded-2xl shadow-sm">
          <Receipt size={24} />
        </div>
      </header>

      <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-100">
        {(['plans', 'cart', 'invoices'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white text-[#002B5B] shadow-sm' : 'text-slate-400'
            }`}
          >
            {tab === 'plans' ? 'Planos' : tab === 'cart' ? `Carrinho (${cart.length})` : 'Faturas'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeTab === 'plans' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-2">
            {[
              { id: 'lite', name: 'Lite', price: '0€', desc: 'Apenas serviços avulsos', icon: <Star className="text-slate-400" /> },
              { id: 'gold', name: 'Gold', price: '29€', desc: 'Gestão 360º & Suporte Prioritário', icon: <Crown className="text-amber-500" /> },
              { id: 'elite', name: 'Elite', price: '99€', desc: 'Acompanhamento VIP ilimitado', icon: <Gem className="text-blue-500" /> }
            ].map((p) => (
              <div key={p.id} className={`p-6 rounded-[32px] border bg-white shadow-sm transition-all relative overflow-hidden ${userPlan === p.id ? 'border-blue-600 ring-2 ring-blue-500/10' : 'border-slate-100'}`}>
                {p.id === 'gold' && <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 -mr-12 -mt-12 rounded-full"></div>}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                     {p.icon}
                     <h3 className="font-black text-lg text-slate-800">{p.name}</h3>
                  </div>
                  {userPlan === p.id && <span className="text-[8px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Ativo</span>}
                </div>
                <p className="text-2xl font-black text-slate-800">{p.price}<span className="text-[10px] text-slate-400">/mês</span></p>
                <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">{p.desc}</p>
                {userPlan !== p.id && (
                  <button 
                    onClick={() => handleInitiatePayment({ type: 'plan', planLevel: p.id as PlanLevel, amount: p.price })}
                    className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${p.id === 'gold' ? 'bg-amber-500 text-white' : 'bg-[#002B5B] text-white'}`}
                  >
                    Mudar para {p.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-2">
            {cart.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center opacity-30">
                <ShoppingBag size={48} className="mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Carrinho Vazio</p>
              </div>
            ) : (
              <>
                {cart.map((item, i) => (
                  <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 text-blue-600 rounded-xl flex items-center justify-center">{item.icon}</div>
                      <div>
                        <p className="text-[11px] font-black text-slate-800">{item.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{item.price}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(i)} className="p-2 text-rose-500"><Trash2 size={16} /></button>
                  </div>
                ))}
                <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-4 shadow-xl mt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-slate-400">Total a Pagar</span>
                    <span className="text-3xl font-black">{calculateTotal().toFixed(2)}€</span>
                  </div>
                  <button 
                    onClick={() => handleInitiatePayment({ type: 'cart', items: cart, totalAmount: `${calculateTotal().toFixed(2)}€` })}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Finalizar Pagamento <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-3 animate-in slide-in-from-bottom-2">
            {invoices.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center opacity-30">
                <ReceiptText size={48} className="mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Nenhuma Fatura Emitida</p>
              </div>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <FileCheck size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{inv.invoiceNumber}</p>
                        <p className="text-[8px] text-slate-400 font-bold">{inv.date} • {inv.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-800">{inv.amount}</p>
                      <span className="text-[7px] font-black text-emerald-600 uppercase bg-emerald-50 px-1.5 py-0.5 rounded-md">Pago</span>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 py-2 text-[9px] font-black text-blue-600 uppercase bg-blue-50 rounded-xl">
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
