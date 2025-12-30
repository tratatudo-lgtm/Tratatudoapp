
import React, { useState, useEffect } from 'react';
import { Document as UserDocument } from '../types';
import { 
  FileText, Search, Download, X, Eye, ShieldCheck, 
  Sparkles, Library, Printer, ExternalLink, 
  ShieldAlert, Fingerprint, CheckCircle2, PenTool, Check
} from 'lucide-react';
import { SignaturePad } from '../components/SignaturePad';

interface DocumentsViewProps {
  initialFilter?: string | null;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ initialFilter }) => {
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [activeFilter, setActiveFilter] = useState(initialFilter || 'Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingDoc, setViewingDoc] = useState<UserDocument | null>(null);
  const [signingDoc, setSigningDoc] = useState<UserDocument | null>(null);

  useEffect(() => {
    const savedDocs = localStorage.getItem('tratatudo_docs');
    if (savedDocs) {
      setDocs(JSON.parse(savedDocs));
    } else {
      // Mock inicial se estiver vazio
      const mockDocs: UserDocument[] = [
        { id: 'poa-1', name: 'Procuração Forense - IMT', category: 'Legal', status: 'pending', isPOA: true },
        { id: 'nif-1', name: 'Comprovativo de NIF', category: 'Fiscal', status: 'valid' }
      ];
      setDocs(mockDocs);
      localStorage.setItem('tratatudo_docs', JSON.stringify(mockDocs));
    }
  }, []);

  const filteredDocs = docs.filter(doc => {
    const matchesFilter = activeFilter === 'Todos' || doc.category === activeFilter;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSignature = (signatureData: string) => {
    if (!signingDoc) return;
    
    const updatedDocs = docs.map(d => {
      if (d.id === signingDoc.id) {
        return { 
          ...d, 
          status: 'valid' as const, 
          signedAt: new Date().toISOString(),
          content: (d.content || '') + `\n\n--- ASSINATURA DIGITAL REGISTADA ---\nID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };
      }
      return d;
    });

    setDocs(updatedDocs);
    localStorage.setItem('tratatudo_docs', JSON.stringify(updatedDocs));
    setSigningDoc(null);
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-24 bg-slate-50 min-h-screen">
      <header className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Biblioteca</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Acesso Vitalício aos teus Documentos</p>
        </div>
        <div className="p-3 bg-white border border-slate-100 text-[#002B5B] rounded-2xl shadow-sm">
          <Library size={24} />
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Pesquisar na tua biblioteca..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500/10"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Todos', 'Legal', 'Fiscal', 'Pessoal'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              activeFilter === f ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <div 
            key={doc.id} 
            className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0" onClick={() => setViewingDoc(doc)}>
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <FileText size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-slate-800 leading-tight truncate">{doc.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[8px] font-black uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">{doc.category}</span>
                   {doc.isPOA && (
                     <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${doc.signedAt ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                       {doc.signedAt ? 'Assinado' : 'Pendente de Assinatura'}
                     </span>
                   )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               {doc.isPOA && !doc.signedAt ? (
                 <button 
                   onClick={() => setSigningDoc(doc)}
                   className="p-3 bg-blue-600 text-white rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 text-[10px] font-black uppercase"
                 >
                   <PenTool size={16} /> Assinar
                 </button>
               ) : (
                 <div className="p-2 text-emerald-500">
                    <ShieldCheck size={20} />
                 </div>
               )}
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center opacity-40">
            <ShieldAlert size={48} className="text-slate-200 mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Biblioteca vazia</p>
          </div>
        )}
      </div>

      {/* Modal de Assinatura Digital */}
      {signingDoc && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-end sm:items-center justify-center animate-in slide-in-from-bottom-10">
          <div className="bg-white w-full max-w-md h-[80vh] sm:h-auto rounded-t-[48px] sm:rounded-[48px] overflow-hidden shadow-2xl">
            <SignaturePad 
              onConfirm={handleSignature} 
              onCancel={() => setSigningDoc(null)} 
            />
          </div>
        </div>
      )}

      {/* Modal de Visualização de Documento */}
      {viewingDoc && (
        <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in">
          <div className="bg-white w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[48px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Eye size={20} /></div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{viewingDoc.name}</h3>
               </div>
               <button onClick={() => setViewingDoc(null)} className="p-2 text-slate-300"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-slate-50">
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden">
                  <div className="absolute top-8 right-8 w-16 h-16 opacity-10 pointer-events-none"><Fingerprint size={64} /></div>
                  
                  <div className="relative z-10 font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                     <div className="mb-10 pb-4 border-b-2 border-slate-900 flex justify-between items-end">
                        <h1 className="text-xl font-black uppercase">Documento Oficial</h1>
                        <div className="text-[10px] font-black text-right">
                           TRATATUDO LEGAL SERVICES<br/>PORTUGAL 2024
                        </div>
                     </div>
                     
                     {viewingDoc.isPOA ? (
                       <>
                         <p className="font-bold mb-4">PROCURAÇÃO FORENSE E DE REPRESENTAÇÃO</p>
                         <p>Eu, portador dos dados constantes no meu perfil TrataTudo, nomeio a TrataTudo.pt como minha legítima representante para assuntos administrativos junto do IMT, Autoridade Tributária e Segurança Social...</p>
                         {viewingDoc.signedAt && (
                           <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col items-center">
                              <div className="w-48 h-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 italic text-[10px]">
                                 [ASSINATURA DIGITAL VALIDADA]
                              </div>
                              <p className="text-[10px] font-black uppercase mt-4 text-emerald-600">
                                 Assinado eletronicamente em {new Date(viewingDoc.signedAt).toLocaleDateString('pt-PT')}
                              </p>
                           </div>
                         )}
                       </>
                     ) : (
                       viewingDoc.content || "Documento externo. Faz o download para visualizar."
                     )}
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
               <button 
                 onClick={handlePrint}
                 className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
               >
                  <Printer size={18} /> Imprimir / PDF
               </button>
               <button className="p-4 bg-slate-50 border border-slate-200 text-slate-400 rounded-2xl">
                  <Download size={18} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
