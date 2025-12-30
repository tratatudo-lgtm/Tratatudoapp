
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, CreditCard, Download, CheckCircle2, X, 
  FileText, ShieldCheck, AlertTriangle, CopyX, Check,
  Loader2, Eye, ShieldAlert, Sparkles, Printer, Paperclip,
  Languages, RefreshCw, Library, ArrowRight, Lock, Upload,
  ClipboardList
} from 'lucide-react';
import { 
  Message, Invoice, Document as UserDocument, CartItem, 
  PaymentContext, PlanLevel, FormDefinition, FormField 
} from '../types'; // Import new types
import { getAIResponse, translateText, SS_FORMS, getFormByServiceId } from '../services/geminiService';

interface ChatViewProps {
  initialMessage?: string | null;
  onMounted?: () => void;
  paymentContext?: PaymentContext | null; // New prop for payment context
  onPaymentSuccess?: (method: string, context: PaymentContext) => void; // New prop for success callback
  onNewAiMessageNotification?: () => void; // New prop for AI message notification
  onClearUnreadMessages?: () => void; // New prop to clear client unread messages
}

// Internal state for form filling
interface ActiveFormFilling {
  form: FormDefinition;
  collectedData: Record<string, string>;
  currentFieldIdx: number;
}

export const ChatView: React.FC<ChatViewProps> = ({ initialMessage, onMounted, paymentContext, onPaymentSuccess, onNewAiMessageNotification, onClearUnreadMessages }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userDocs, setUserDocs] = useState<UserDocument[]>([]);
  const [pendingServices, setPendingServices] = useState<CartItem[]>([]);
  const [translatedMsgs, setTranslatedMsgs] = useState<Record<string, string>>({});
  const [currentPaymentContext, setCurrentPaymentContext] = useState<PaymentContext | null>(null); // Internal state for payment
  const [activeFormFilling, setActiveFormFilling] = useState<ActiveFormFilling | null>(null); // New state for form filling
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem('tratatudo_docs') || '[]');
    const savedCart = JSON.parse(localStorage.getItem('tratatudo_cart') || '[]');
    setUserDocs(savedDocs);
    setPendingServices(savedCart);
    setCurrentPaymentContext(paymentContext || null); // Set internal context from prop

    // Clear unread messages when ChatView is mounted/active
    if (onClearUnreadMessages) {
      onClearUnreadMessages();
    }

    const initChat = async () => {
      setIsTyping(true);
      let initialAiResponseText = '';

      if (paymentContext) {
        // AI response for payment initiation
        const itemDescription = paymentContext.type === 'plan' 
          ? `o seu Plano ${paymentContext.planLevel.toUpperCase()}` 
          : `os seus ${paymentContext.items.length} serviços no carrinho`;
        const paymentAmount = paymentContext.type === 'plan' ? paymentContext.amount : paymentContext.totalAmount;

        initialAiResponseText = `Entendido! Para o pagamento de ${itemDescription} no valor de ${paymentAmount}, pode efetuar por transferência bancária (NIB: PT50 0000 0000 0000 0000 000) ou MB WAY (para o número +351 923 364 360). Assim que pagar, por favor, carregue o comprovativo para eu validar.`;
        
      } else {
        // Normal chat initialization
        const analysisPrompt = "Analisa os meus serviços pendentes e documentos. Diz-me o que falta de forma curta e informal.";
        initialAiResponseText = await getAIResponse(analysisPrompt, savedDocs, savedCart);
      }
      
      setMessages([
        { 
          id: 'welcome', 
          sender: 'ai', 
          text: initialAiResponseText, 
          timestamp: new Date() 
        }
      ]);
      setIsTyping(false);
      if (onNewAiMessageNotification) {
        onNewAiMessageNotification(); // Trigger notification for new AI message
      }
    };

    if (messages.length === 0 || paymentContext !== currentPaymentContext) { // Re-initialize if payment context changes
      initChat();
    }
    
    if (onMounted) onMounted();
  }, [initialMessage, onMounted, paymentContext, currentPaymentContext]); // Depend on paymentContext

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);


  // Helper to extract relevant form data from user input
  const extractFormData = (text: string, field: FormField) => {
    // Simple extraction logic based on field type and keywords.
    // This would be more robust with a proper NLU model.
    text = text.toLowerCase();
    
    if (field.type === 'number') {
      const match = text.match(/\d+/);
      return match ? match[0] : null;
    }
    if (field.type === 'date') {
      const match = text.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/);
      if (match) return match[0];
      // Try to parse relative dates, e.g., "hoje"
      if (text.includes('hoje')) return new Date().toISOString().split('T')[0];
      return null;
    }
    if (field.type === 'select' && field.options) {
      for (const option of field.options) {
        if (text.includes(option.toLowerCase())) {
          return option;
        }
      }
      return null;
    }
    // For text fields, just take the whole input for now
    return text;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate AI document identification or payment proof detection
    setIsTyping(true);
    setTimeout(async () => {
      const docName = file.name;
      const lowerCaseDocName = docName.toLowerCase();
      
      let aiMsgText = '';
      let isPaymentProof = false;

      if (currentPaymentContext && (lowerCaseDocName.includes('comprovativo') || lowerCaseDocName.includes('pagamento') || lowerCaseDocName.includes('proof'))) {
        isPaymentProof = true;
        aiMsgText = `Recebi o teu comprovativo (${docName})! Vou validar o pagamento, por favor aguarda um momento.`;
        setMessages(prev => [...prev, { id: `ai-msg-${Date.now()}`, sender: 'ai', text: aiMsgText, timestamp: new Date() }]);

        // Simulate payment validation delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Finalize payment
        if (onPaymentSuccess && currentPaymentContext) {
          onPaymentSuccess('Bank Transfer (Comprovativo)', currentPaymentContext); // Assuming bank transfer for proof
          aiMsgText = `Pagamento validado com sucesso! 🎉 O seu ${currentPaymentContext.type === 'plan' ? 'Plano ' + currentPaymentContext.planLevel.toUpperCase() : 'serviços do carrinho'} já está ativo. Uma fatura foi gerada e enviada para o seu email.`;
          setCurrentPaymentContext(null); // Clear payment context after success
        } else {
          aiMsgText = "Lamento, houve um problema ao finalizar o pagamento. Tenta de novo.";
        }
      } else {
        // Normal document upload
        const category = lowerCaseDocName.includes('nif') ? 'Fiscal' : 
                        lowerCaseDocName.includes('passaporte') ? 'Pessoal' : 
                        lowerCaseDocName.includes('contrato') ? 'Legal' : 'Pessoal';
        
        const newDoc: UserDocument = {
          id: `doc-${Date.now()}`,
          name: docName,
          category,
          status: 'valid',
          content: `Documento carregado via chat: ${docName}`
        };

        const updatedDocs = [newDoc, ...userDocs];
        localStorage.setItem('tratatudo_docs', JSON.stringify(updatedDocs));
        setUserDocs(updatedDocs);

        aiMsgText = `Identifiquei o documento "${docName}" como um documento de categoria ${category}. Já o anexei à tua biblioteca de documentos com sucesso! ✅`;
      }

      setMessages(prev => [...prev, {
        id: `ai-upload-${Date.now()}`,
        sender: 'ai',
        text: aiMsgText,
        timestamp: new Date(),
        attachments: isPaymentProof ? [] : [{ // Attach document only if not payment proof
          id: `doc-attach-${Date.now()}`,
          name: docName,
          category: 'Comprovativo', // For display in chat
          status: 'valid'
        }]
      }]);
      setIsTyping(false);
      if (onNewAiMessageNotification) {
        onNewAiMessageNotification(); // Trigger notification for new AI message
      }
    }, 2000);
  };

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim()) return;

    if (inputRef.current) {
      inputRef.current.blur();
    }

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInput('');
    setIsTyping(true);

    let aiResponseText = '';

    // --- FORM FILLING LOGIC ---
    if (activeFormFilling) {
      const currentForm = activeFormFilling.form;
      const currentField = currentForm.fields[activeFormFilling.currentFieldIdx];
      const fieldValue = extractFormData(messageText, currentField);

      if (fieldValue) {
        const updatedCollectedData = { ...activeFormFilling.collectedData, [currentField.id]: fieldValue };
        let nextIdx = activeFormFilling.currentFieldIdx + 1;
        let nextField: FormField | undefined;

        // Skip non-required fields if not provided directly
        while (nextIdx < currentForm.fields.length) {
          const field = currentForm.fields[nextIdx];
          if (field.required && !updatedCollectedData[field.id]) {
            nextField = field;
            break;
          }
          nextIdx++;
        }

        if (nextField) {
          // Continue asking for next required field
          setActiveFormFilling(prev => prev ? { ...prev, collectedData: updatedCollectedData, currentFieldIdx: nextIdx } : null);
          aiResponseText = `Entendido! Qual é o teu ${nextField.label.toLowerCase()}?`;
        } else {
          // All required fields filled, finalize form
          const formContent = `Formulário: ${currentForm.name}\nCategoria: ${currentForm.category}\n\nDados recolhidos:\n${
            Object.entries(updatedCollectedData)
                  .map(([key, value]) => `- ${currentForm.fields.find(f => f.id === key)?.label || key}: ${value}`)
                  .join('\n')
          }\n\nEste documento simulado pode agora ser submetido à Segurança Social.`;

          const newFormDoc: UserDocument = {
            id: `form-ss-${Date.now()}`,
            name: `${currentForm.name} - Preenchido`,
            category: currentForm.category,
            status: 'valid',
            content: formContent,
            filledFormId: currentForm.id,
            formData: updatedCollectedData
          };

          const updatedDocs = [newFormDoc, ...userDocs];
          localStorage.setItem('tratatudo_docs', JSON.stringify(updatedDocs));
          setUserDocs(updatedDocs);

          aiResponseText = `Ótimo! Tenho todos os dados para o formulário "${currentForm.name}". O documento foi gerado e adicionado à tua biblioteca. ✅`;
          setActiveFormFilling(null); // Clear form filling state
        }
      } else {
        // Could not extract value for current field, ask again
        aiResponseText = `Não consegui identificar o ${currentField.label.toLowerCase()}. Podes repetir ou ser mais específico?`;
      }

    } else {
      // Check if user is initiating a form filling process
      const ssServiceKeywords = {
        'abono de família': 'ss-abono-familia-form',
        'subsídio de desemprego': 'ss-subsidio-desemprego-form',
      };
      let formInitiated = false;
      for (const keyword in ssServiceKeywords) {
        if (messageText.toLowerCase().includes(keyword)) {
          const formDef = SS_FORMS.find(f => f.id === (ssServiceKeywords as any)[keyword]);
          if (formDef) {
            const firstRequiredField = formDef.fields.find(f => f.required);
            if (firstRequiredField) {
              setActiveFormFilling({
                form: formDef,
                collectedData: {},
                currentFieldIdx: formDef.fields.indexOf(firstRequiredField)
              });
              aiResponseText = `Entendido! Vamos iniciar o preenchimento do formulário de "${formDef.name}". Qual é o teu ${firstRequiredField.label.toLowerCase()}?`;
              formInitiated = true;
              break;
            }
          }
        }
      }

      // If not form filling, use generic AI response
      if (!formInitiated) {
        aiResponseText = await getAIResponse(messageText, userDocs, pendingServices);
      }
    }
    // --- END FORM FILLING LOGIC ---
    
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResponseText || 'Lamento, ocorreu um erro.',
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
    if (onNewAiMessageNotification) {
      onNewAiMessageNotification(); // Trigger notification for new AI message
    }
  };

  const handleTranslateMsg = async (msgId: string, text: string) => {
    if (translatedMsgs[msgId]) return;
    setTranslatedMsgs(prev => ({ ...prev, [msgId]: '...' }));
    const translated = await translateText(text, 'English');
    setTranslatedMsgs(prev => ({ ...prev, [msgId]: translated }));
  };

  const currentFormTitle = activeFormFilling?.form.name;
  const currentFormProgress = activeFormFilling ? 
    Object.keys(activeFormFilling.collectedData).length : 0;
  const totalRequiredFields = activeFormFilling ? 
    activeFormFilling.form.fields.filter(f => f.required).length : 0;
  const nextFieldToFill = activeFormFilling?.form.fields[activeFormFilling.currentFieldIdx]?.label;


  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50">
      <div className="bg-white p-4 flex items-center justify-between border-b border-slate-100 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#002B5B] flex items-center justify-center text-white shadow-lg relative">
            <Bot size={22} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">IA Concierge TrataTudo</h3>
            <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Processamento Documental Ativo</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {pendingServices.length > 0 && (
             <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 animate-pulse">
                <RefreshCw size={10} className="text-blue-600 animate-spin-slow" />
                <span className="text-[9px] font-black text-blue-600 uppercase">{pendingServices.length} Processos</span>
             </div>
           )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {/* Form Filling Indicator */}
        {activeFormFilling && (
          <div className="bg-blue-100/50 p-4 rounded-3xl border border-blue-200 shadow-inner flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <ClipboardList size={20} className="text-blue-600 shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase text-blue-800 tracking-tight">
                A Preencher Formulário: <span className="text-blue-600">{currentFormTitle}</span>
              </p>
              <p className="text-[9px] text-slate-600 mt-1">
                Próximo: <span className="font-bold text-slate-800">{nextFieldToFill || 'Concluído!'}</span> ({currentFormProgress}/{totalRequiredFields} campos)
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-[32px] p-5 shadow-sm relative animate-in slide-in-from-bottom-2 ${
              msg.sender === 'user' 
                ? 'bg-[#002B5B] text-white rounded-tr-none shadow-blue-900/10' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-slate-200/50'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
              
              {msg.attachments && (
                <div className="mt-4 grid grid-cols-1 gap-2">
                   {msg.attachments.map(att => (
                     <div key={att.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <FileText size={16} className="text-blue-600" />
                        <span className="text-[9px] font-black uppercase tracking-tight text-slate-600 truncate flex-1">{att.name}</span>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                     </div>
                   ))}
                </div>
              )}

              {msg.sender === 'ai' && !msg.attachments && (
                <button 
                  onClick={() => handleTranslateMsg(msg.id, msg.text)}
                  className="mt-3 flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-300 hover:text-blue-600 transition-colors"
                >
                   <Languages size={10} /> {translatedMsgs[msg.id] ? 'Traduzido' : 'Traduzir para Inglês'}
                </button>
              )}
            </div>
            <span className="text-[9px] font-black text-slate-300 uppercase mt-2 px-4 tracking-tighter">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 flex gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 pb-8">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
        />
        <div className="flex items-end gap-2 bg-white rounded-[28px] p-2 border-2 border-slate-200 shadow-lg focus-within:border-blue-600 transition-all">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-blue-600 shrink-0 mb-1 transition-colors"
          >
            <Paperclip size={20} />
          </button>
          
          <textarea 
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Diz-me o que precisas..."
            className="flex-1 bg-transparent text-base p-3 outline-none font-semibold text-slate-900 placeholder:text-slate-300 min-h-[44px] max-h-32 resize-none"
            style={{ height: 'auto' }}
          />

          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 bg-[#002B5B] text-white rounded-[20px] flex items-center justify-center shadow-xl active:scale-95 disabled:bg-slate-100 transition-all shrink-0 mb-1"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
