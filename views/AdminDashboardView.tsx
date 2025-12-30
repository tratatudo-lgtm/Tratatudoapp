
import React, { useState } from 'react';
import { 
  Users, FileWarning, MessageCircle, TrendingUp, ChevronRight, 
  Clock, Activity, Filter, CheckCircle2, Calendar, 
  ChevronDown, Info, ArrowUpRight, LifeBuoy, X, Send, ShieldCheck,
  UserPlus, Trash2, Mail, User as UserIcon, AlertTriangle,
  Globe, Zap, RefreshCcw, Landmark, ShieldAlert, Database,
  ExternalLink, FileSpreadsheet, Lock, Cpu, Link as LinkIcon,
  CreditCard, Key, Settings, Wallet, Edit3, Save, Tag
} from 'lucide-react';
import { ProcessStatus, ServiceDetail } from '../types';

interface AdminDashboardViewProps {
  services: ServiceDetail[];
  onUpdateServices: (services: ServiceDetail[]) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ services, onUpdateServices }) => {
  const [showRevolutConfig, setShowRevolutConfig] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editPromoPrice, setEditPromoPrice] = useState('');

  const stats = [
    { label: 'Receita Mensal', value: '4.290€', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Saldo Gas (POL)', value: '142.50', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Docs Notarizados', value: '1,284', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Campanhas Ativas', value: services.filter(s => s.hasCampaign).length.toString(), icon: Tag, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const handleStartEdit = (service: ServiceDetail) => {
    setEditingServiceId(service.id);
    setEditPrice(service.price.replace('€', ''));
    setEditPromoPrice(service.originalPrice ? service.price.replace('€', '') : '');
  };

  const handleSavePrice = (id: string) => {
    const updated = services.map(s => {
      if (s.id === id) {
        if (editPromoPrice && editPromoPrice !== editPrice) {
          return {
            ...s,
            price: `${editPromoPrice}€`,
            originalPrice: `${editPrice}€`,
            hasCampaign: true
          };
        } else {
          return {
            ...s,
            price: `${editPrice}€`,
            originalPrice: undefined,
            hasCampaign: false
          };
        }
      }
      return s;
    });
    onUpdateServices(updated);
    setEditingServiceId(null);
  };

  const handleRemoveCampaign = (id: string) => {
    const updated = services.map(s => {
      if (s.id === id && s.originalPrice) {
        return {
          ...s,
          price: s.originalPrice,
          originalPrice: undefined,
          hasCampaign: false
        };
      }
      return s;
    });
    onUpdateServices(updated);
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Admin Hub</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Gestão de Ecossistema 360</p>
        </div>
        <button 
          onClick={() => setShowRevolutConfig(true)}
          className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl active:scale-95 transition-all"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* FINANCE & WEB3 STATS */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-3xl p-5 border border-white shadow-sm flex flex-col gap-3 transition-all hover:scale-[1.02]`}>
            <stat.icon size={20} className={`${stat.color}`} />
            <div>
              <p className="text-xl font-black text-slate-800 leading-none">{stat.value}</p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GESTÃO DE SERVIÇOS E PREÇOS */}
      <section className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 text-slate-400 rounded-2xl"><Tag size={20} /></div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Catálogo & Campanhas</h3>
           </div>
        </div>
        
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                    {service.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{service.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{service.category}</p>
                  </div>
                </div>
                {editingServiceId !== service.id && (
                  <button onClick={() => handleStartEdit(service)} className="p-2 text-blue-600 bg-white rounded-lg shadow-sm">
                    <Edit3 size={16} />
                  </button>
                )}
              </div>

              {editingServiceId === service.id ? (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Preço Base</label>
                    <input 
                      type="number" 
                      value={editPrice}
                      onChange={e => setEditPrice(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-orange-500 uppercase ml-1">Campanha (Opcional)</label>
                    <input 
                      type="number" 
                      placeholder="Novo valor"
                      value={editPromoPrice}
                      onChange={e => setEditPromoPrice(e.target.value)}
                      className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-xs font-bold text-orange-600"
                    />
                  </div>
                  <button 
                    onClick={() => handleSavePrice(service.id)}
                    className="col-span-2 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2"
                  >
                    Gravar Alterações <Save size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2 border-t border-white">
                  <div className="flex items-baseline gap-2">
                    {service.hasCampaign ? (
                      <>
                        <span className="text-lg font-black text-orange-600">{service.price}</span>
                        <span className="text-[10px] text-slate-400 line-through font-bold">{service.originalPrice}</span>
                      </>
                    ) : (
                      <span className="text-lg font-black text-slate-800">{service.price}</span>
                    )}
                  </div>
                  {service.hasCampaign && (
                    <button 
                      onClick={() => handleRemoveCampaign(service.id)}
                      className="text-[8px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg uppercase"
                    >
                      Remover Promo
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* WEB3 WALLET INFO (MANTIDA) */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={16} className="text-purple-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-200">Carteira de Notarização</span>
            </div>
            <h3 className="text-lg font-black mb-1">0xTrata...Tudo88</h3>
            <p className="text-[10px] text-purple-100/60 mb-6 font-mono break-all">Polygon Smart Contract: 0x5521...a210</p>
            <button className="w-full bg-white text-indigo-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
               Recarregar Taxas (POL) <Zap size={16} />
            </button>
         </div>
      </div>
    </div>
  );
};
