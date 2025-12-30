
import React, { useState, useEffect } from 'react';
import { 
  Search, User, Mail, Smartphone, MapPin, Calendar, 
  ChevronRight, ArrowLeft, Briefcase, MessageSquare, 
  CheckCircle2, Clock, ShieldCheck, ExternalLink,
  Send, Bot, MoreVertical, FileText, X, Printer,
  Download, Fingerprint, ShieldAlert, Gavel, FileSignature,
  Activity, Landmark, Shield
} from 'lucide-react';
import { Client, UserProcess, Message, ProcessStatus, Document as UserDocument } from '../types';

export const AdminClientsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [viewingDoc, setViewingDoc] = useState<UserDocument | null>(null);

  // Mock Data: Lista de Clientes
  const clients: Client[] = [
    { 
      id: 'c1', 
      name: 'João Silva', 
      email: 'joao.silva@gmail.com', 
      phone: '+351 912 345 678', 
      birthDate: '15/05/1988', 
      address: 'Rua de Origem 123, São Paulo, Brasil',
      joinedAt: '10/05/2024',
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?u=c1',
      plan: 'lite'
    },
    { 
      id: 'c2', 
      name: 'Maria Oliveira', 
      email: 'm.oliveira@outlook.com', 
      phone: '+351 923 888 111', 
      birthDate: '22/10/1992', 
      address: 'Av. Paulista 500, São Paulo, Brasil',
      joinedAt: '12/05/2024',
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?u=c2',
      plan: 'gold'
    }
  ];

  // Mock de Documentos do Cliente (No Admin vemos tudo)
  const clientDocs: Record<string, UserDocument[]> = {
    'c1': [
      { id: 'doc1', name: 'Procuração Forense - João Silva', category: 'Legal', status: 'valid', isPOA: true, signedAt: '2024-05-12T10:00:00Z' },
      { id: 'doc2', name: 'Comprovativo NIF', category: 'Fiscal', status: 'valid' }
    ],
    'c2': [
      { id: 'doc3', name: 'Procuração Forense - Maria Oliveira', category: 'Legal', status: 'pending', isPOA: true }
    ]
  };

  const processes: UserProcess[] = [
    { id: 'p1', clientId: 'c1', clientName: 'João Silva', type: 'Visto D7 - Residência', status: ProcessStatus.IN_PROGRESS, progress: 65, lastUpdate: 'há 2 dias', nextStep: 'Aguardando VFS' }
  ];

  const chatHistory: Message[] = [
    { id: 'm1', clientId: 'c1', sender: 'user', text: 'Olá, quando recebo o meu NIF?', timestamp: new Date(Date.now() - 10000000) }
  ];

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const clientProcesses = processes.filter(p => p.clientId === selectedClientId);
  const clientMessages = chatHistory.filter(m => m.clientId === selectedClientId);
  const currentDocs = selectedClientId ? clientDocs[selectedClientId] || [] : [];

  if (selectedClientId && selectedClient) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300 pb-32">
        {/* Perfil Header */}
        <div className="bg-slate-900 pt-10 pb-20 px-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          <button 
            onClick={() => setSelectedClientId(null)}
            className="mb-8 p-3 bg-white/10 rounded-2xl backdrop-blur-md flex items-center gap-2 text-xs font-black uppercase tracking-widest"
          >
            <ArrowLeft size={18} /> Lista de Clientes
          </button>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-[32px] border-4 border-white/20 p-1">
              <img src={selectedClient.avatar} className="w-full h-full rounded-[28px] object-cover shadow-2xl" alt={selectedClient.name} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">{selectedClient.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${selectedClient.plan === 'gold' ? 'bg-amber-500 text-amber-950' : 'bg-blue-600 text-white'}`}>
                   Plano {selectedClient.plan.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">ID: {selectedClient.id.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 -mt-10 space-y-8 relative z-20">
          {/* Dados Pessoais Explícitos (Só Admin vê assim) */}
          <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Mail size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Contacto</p>
                  <p className="text-sm font-bold text-slate-800">{selectedClient.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Smartphone size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telemóvel</p>
                  <p className="text-sm font-bold text-slate-800">{selectedClient.phone}</p>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Calendar size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nascimento</p>
                  <p className="text-sm font-bold text-slate-800">{selectedClient.birthDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><MapPin size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Morada de Residência</p>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{selectedClient.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ARQUIVO DIGITAL DO CLIENTE */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" /> Arquivo Digital & Documentos
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {currentDocs.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => setViewingDoc(doc)}
                  className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                       <FileText size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">{doc.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.category} • {doc.status === 'valid' ? 'Validado' : 'Pendente'}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-200 group-hover:text-blue-600" />
                </div>
              ))}
            </div>
          </section>

          {/* SERVIÇOS */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Briefcase size={16} className="text-blue-600" /> Processos em Curso
              </h3>
            </div>
            <div className="space-y-3">
              {clientProcesses.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                       <Activity size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 leading-tight">{p.type}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{p.status} • {p.progress}% Concluído</p>
                    </div>
                  </div>
                  <button className="p-3 text-slate-400 hover:text-blue-600 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* MODAL DE DOCUMENTO DETALHADO (PROCURAÇÃO FULL DATA) */}
        {viewingDoc && selectedClient && (
          <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-end sm:items-center justify-center animate-in fade-in">
             <div className="bg-white w-full max-w-2xl h-[95vh] sm:h-[90vh] rounded-t-[48px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#002B5B] text-white rounded-xl"><ShieldCheck size={20} /></div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Consola de Auditoria</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Documento ID: {viewingDoc.id.toUpperCase()}</p>
                    </div>
                  </div>
                  <button onClick={() => setViewingDoc(null)} className="p-3 bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 bg-slate-100/50 scrollbar-hide">
                  <div className="bg-white p-12 sm:p-20 rounded-[10px] shadow-2xl border border-slate-200 relative overflow-hidden min-h-full">
                    {/* Watermark Oficial */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-12">
                       <h1 className="text-[120px] font-black uppercase">TRATATUDO</h1>
                    </div>

                    <div className="relative z-10 font-serif text-[13px] leading-relaxed text-slate-900 space-y-10">
                      <div className="pb-8 border-b-4 border-slate-900 flex justify-between items-end">
                         <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter">Procuração Forense</h1>
                            <p className="text-[10px] font-black uppercase text-blue-600 mt-1">Efeitos Administrativos e Legais em Portugal</p>
                         </div>
                         <div className="text-[9px] font-black text-right uppercase">
                            Ref: TT-LEGAL-{selectedClient.id.toUpperCase()}<br/>
                            Data de Emissão: {new Date().toLocaleDateString('pt-PT')}
                         </div>
                      </div>

                      {/* DADOS EXPLÍCITOS DO CLIENTE PARA O ADMIN */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <Shield size={14} className="text-blue-600" />
                           <h2 className="font-black text-xs uppercase border-b border-slate-200 pb-2 flex-1">I. OUTORGANTE (CLIENTE - DADOS EXPLÍCITOS)</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</p>
                              <p className="font-bold text-slate-900">{selectedClient.name.toUpperCase()}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nacionalidade</p>
                              <p className="font-bold text-slate-900">ESTRANGEIRA (VERIFICADO)</p>
                           </div>
                           <div className="col-span-2">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Morada de Residência Oficial</p>
                              <p className="font-bold text-slate-900 leading-snug">{selectedClient.address}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Data de Nascimento</p>
                              <p className="font-bold text-slate-900">{selectedClient.birthDate}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Documento ID</p>
                              <p className="font-bold text-slate-900">PASSAPORTE / CC (VALIDADO)</p>
                           </div>
                        </div>
                      </section>

                      <section className="space-y-4">
                        <h2 className="font-black text-xs uppercase border-b border-slate-200 pb-2">II. PROCURADOR (REPRESENTANTE)</h2>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="font-bold">TRATATUDO - SERVIÇOS DE CONSULTORIA ADMINISTRATIVA, LDA</p>
                          <p className="text-[11px] mt-1 text-slate-600">NIPC: 512 000 000 • Sede: Av. da Liberdade, 110, Lisboa, Portugal</p>
                        </div>
                      </section>

                      <section className="space-y-4 text-justify">
                        <h2 className="font-black text-xs uppercase border-b border-slate-200 pb-2">III. PODERES CONFERIDOS</h2>
                        <p>
                          Pela presente, o Outorgante confere ao Procurador poderes bastantes para, em seu nome e representação, praticar todos os atos necessários junto da <b>Autoridade Tributária e Aduaneira (AT)</b>, <b>Segurança Social</b> e <b>AIMA (ex-SEF)</b>, nomeadamente para requerer NIF, NISS, agendamentos, submissão de processos de residência e levantamento de documentação oficial.
                        </p>
                      </section>

                      {viewingDoc.signedAt && (
                        <div className="mt-16 pt-10 border-t-2 border-slate-100 flex flex-col items-center">
                           <div className="flex items-center gap-10">
                              <div className="text-center">
                                 <p className="text-[8px] font-black uppercase text-slate-400 mb-6">Assinatura Digital do Outorgante</p>
                                 <div className="w-64 h-24 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-[10px] text-blue-600 italic font-medium">
                                    [CERTIFICADO DIGITAL TRATATUDO ID: {viewingDoc.id}]
                                 </div>
                              </div>
                              <div className="text-center">
                                 <p className="text-[8px] font-black uppercase text-slate-400 mb-6">Validação do Procurador</p>
                                 <div className="w-32 h-32 flex items-center justify-center border-4 border-double border-blue-900/20 rounded-full opacity-40">
                                    <Fingerprint size={48} className="text-blue-900" />
                                 </div>
                              </div>
                           </div>
                           <div className="mt-10 flex flex-col items-center gap-2">
                              <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                 <ShieldCheck size={14} />
                                 <span className="text-[9px] font-black uppercase tracking-widest">Documento Registado em Blockchain Polygon</span>
                              </div>
                              <p className="text-[7px] font-mono text-slate-400">TX_HASH: 0x5521b210c888a210f9988e10...</p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-white flex gap-4">
                  <button className="flex-1 h-16 bg-[#002B5B] text-white rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
                    <Printer size={20} /> Gerar PDF Oficial
                  </button>
                  <button className="h-16 w-16 bg-slate-50 border border-slate-200 text-slate-400 rounded-3xl flex items-center justify-center">
                    <Download size={20} />
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gestão de Clientes</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Consola de Administração</p>
        </div>
        <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 shadow-sm">
          <User size={24} />
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Procurar por nome ou email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="space-y-3">
        {filteredClients.map((client) => (
          <div 
            key={client.id} 
            onClick={() => setSelectedClientId(client.id)}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-400 transition-all cursor-pointer group flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-inner">
              <img src={client.avatar} className="w-full h-full object-cover" alt={client.name} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-slate-800 truncate">{client.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{client.email}</p>
              <div className="mt-2 flex items-center gap-2">
                 <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${client.plan === 'gold' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                   {client.plan}
                 </span>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-200 group-hover:text-blue-600" />
          </div>
        ))}
      </div>
    </div>
  );
};
