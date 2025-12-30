
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AppView, UserRole, ServiceDetail, CartItem, Invoice, PlanLevel, PaymentContext, Document } from './types';
import { LandingView } from './views/LandingView.tsx';
import { DashboardView } from './views/DashboardView';
import { DocumentsView } from './views/DocumentsView';
import { ChatView } from './views/ChatView';
import { ProfileView } from './views/ProfileView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminChatView } from './views/AdminChatView';
import { AdminClientsView } from './views/AdminClientsView';
import { BillingView } from './views/BillingView';
import { ServiceDetailView } from './views/ServiceDetailView';
import { getBrowserLang } from './services/i18n';
import { 
  Receipt, Zap, Wifi, HeartPulse, Car, Smartphone, Landmark, UserCheck, 
  FileText, ShieldCheck, Briefcase, Home, Gavel, Globe, MapPin, 
  UserPlus, Scale, Calculator, Handshake, Search, ClipboardList, BookOpen,
  Mail, Phone, BookMarked, Wallet, Plane, Lightbulb, Package, Building,
  Bus, GraduationCap, Coins, DollarSign, PenSquare, MessageCircleMore,
  FileBadge, FileClock, ClipboardPaste, Award, X // Added X for Cessação de Atividade
} from 'lucide-react';

const DEFAULT_SERVICES: ServiceDetail[] = [
  // SERVIÇOS FISCAIS (AT - Autoridade Tributária)
  { 
    id: 's1', name: 'NIF Expresso', price: '49€', icon: <Landmark size={20} />, category: 'Fiscal (AT)', 
    desc: 'Número de Identificação Fiscal rápido.', fullDesc: 'Obtenção de NIF para residentes e não residentes. Tratamos da representação fiscal obrigatória para estrangeiros e do pedido em tempo recorde.', 
    difficulty: 'Baixa', painPoints: ['Longas filas nas Finanças', 'Necessidade de representante fiscal', 'Complexidade para não residentes'],
    requiredDocs: ['Passaporte', 'Comprovativo de Morada no país de origem'], isFreeForGold: true
  },
  { 
    id: 's4', name: 'IRS & Fiscalidade', price: '39€', originalPrice: '49€', icon: <Calculator size={20} />, category: 'Fiscal (AT)', 
    desc: 'Entrega de IRS e Benefícios.', fullDesc: 'Análise detalhada de faturas e entrega anual de IRS. Maximizamos o seu reembolso e aplicamos todos os benefícios fiscais aplicáveis à sua situação.', 
    difficulty: 'Média', painPoints: ['Erro no preenchimento de anexos', 'Cálculo de mais-valias', 'Perda de benefícios por desconhecimento'],
    requiredDocs: ['Senha das Finanças', 'Faturas (Saúde, Educação, Rendas, etc.)'], goldDiscount: 20
  },
  {
    id: 's9', name: 'Abertura de Atividade', price: '60€', icon: <Briefcase size={20} />, category: 'Fiscal (AT)',
    desc: 'Início de atividade como trabalhador independente.', fullDesc: 'Processo completo para abrir atividade nas Finanças (CAE), essencial para freelancers e empreendedores. Inclui análise do CAE mais adequado e regime simplificado.',
    difficulty: 'Média', painPoints: ['Documentação complexa', 'Escolha do CAE correto', 'Dúvidas sobre o regime tributário'],
    requiredDocs: ['NIF', 'Identificação pessoal', 'CAE pretendido'], goldDiscount: 15
  },
  {
    id: 's10', name: 'Cessação de Atividade', price: '50€', icon: <X size={20} />, category: 'Fiscal (AT)',
    desc: 'Fecho da atividade independente nas Finanças.', fullDesc: 'Encerramento oficial da sua atividade. Evite obrigações fiscais desnecessárias após deixar de trabalhar por conta própria. Inclui a submissão da declaração de cessação.',
    difficulty: 'Baixa', painPoints: ['Esquecimento de prazos', 'Manutenção de obrigações', 'Burocracia de fecho'],
    requiredDocs: ['NIF', 'Data de cessação'], isFreeForGold: true
  },
  {
    id: 's11', name: 'Alteração de Morada Fiscal', price: '20€', icon: <MapPin size={20} />, category: 'Fiscal (AT)',
    desc: 'Atualização da sua morada junto à Autoridade Tributária.', fullDesc: 'Garantimos que a sua morada fiscal esteja sempre atualizada, evitando problemas com notificações e correspondência oficial. Essencial para evitar multas.',
    difficulty: 'Baixa', painPoints: ['Perda de correspondência', 'Penalizações por morada desatualizada', 'Processo manual demorado'],
    requiredDocs: ['NIF', 'Nova morada', 'Comprovativo de nova morada'], isFreeForGold: true
  },
  {
    id: 's19', name: 'Adesão IRS Jovem', price: '30€', icon: <Award size={20} />, category: 'Fiscal (AT)',
    desc: 'Benefício fiscal para jovens trabalhadores.', fullDesc: 'Ajudamos a aplicar o regime fiscal IRS Jovem, que permite uma isenção parcial de IRS para recém-licenciados ou doutorados. Maximize a sua poupança.',
    difficulty: 'Média', painPoints: ['Desconhecimento dos requisitos', 'Erros na candidatura', 'Prazos de adesão'],
    requiredDocs: ['NIF', 'Certificado de habilitações', 'Início de atividade profissional'], goldDiscount: 10
  },

  // SERVIÇOS SEGURANÇA SOCIAL (SS)
  { 
    id: 's2', name: 'NISS na Hora', price: '39€', icon: <UserCheck size={20} />, category: 'Seg. Social', 
    desc: 'Ativação do Número de Segurança Social.', fullDesc: 'Indispensável para começar a trabalhar em Portugal e aceder a benefícios sociais. Garantimos a submissão correta do pedido na Segurança Social sem complicações.', 
    difficulty: 'Baixa', painPoints: ['Dificuldade em obter resposta da SS', 'Falta de agendamentos', 'Processo moroso'],
    requiredDocs: ['NIF', 'Passaporte ou Título de Residência'], isFreeForGold: true
  },
  {
    id: 's12', name: 'Pedido de Abono de Família', price: '30€', icon: <Coins size={20} />, category: 'Seg. Social',
    desc: 'Auxílio financeiro para crianças e jovens.', fullDesc: 'Apoiamos na candidatura ao abono de família para os seus dependentes, assegurando que todos os requisitos são cumpridos para a sua atribuição. Inclui o preenchimento de formulários.',
    difficulty: 'Média', painPoints: ['Documentação extensa', 'Cálculo de rendimentos', 'Rejeição por erros'],
    requiredDocs: ['NIF dos Pais e Criança', 'Comprovativo de rendimentos', 'Certidão de Nascimento'], goldDiscount: 10
  },
  {
    id: 's13', name: 'Subsídio de Desemprego', price: '75€', icon: <Bus size={20} />, category: 'Seg. Social',
    desc: 'Apoio para trabalhadores desempregados.', fullDesc: 'Orientação e submissão do pedido de subsídio de desemprego. Verificamos a elegibilidade e ajudamos a reunir a documentação necessária para garantir a aprovação.',
    difficulty: 'Média', painPoints: ['Prazos apertados', 'Requisitos complexos', 'Erros na documentação'],
    requiredDocs: ['NIF', 'NISS', 'Certificado de trabalho', 'Histórico de contribuições'], goldDiscount: 15
  },
  {
    id: 's20', name: 'Subsídio de Doença', price: '45€', icon: <HeartPulse size={20} />, category: 'Seg. Social',
    desc: 'Pedido de apoio por incapacidade temporária.', fullDesc: 'Auxiliamos no processo de obtenção do subsídio de doença. Verificamos a documentação médica e submetemos o pedido à Segurança Social para que receba o apoio devido.',
    difficulty: 'Média', painPoints: ['Atestados incorretos', 'Prazos de entrega', 'Burocracia da SS'],
    requiredDocs: ['NISS', 'Atestado Médico de Incapacidade Temporária (AMIT)', 'Comprovativo de rendimentos'], goldDiscount: 10
  },

  // SERVIÇOS IEFP (Instituto do Emprego e Formação Profissional)
  { 
    id: 's3', name: 'Inscrição IEFP', price: '25€', icon: <Search size={20} />, category: 'Emprego (IEFP)', 
    desc: 'Registo no Centro de Emprego.', fullDesc: 'Registo oficial no IEFP, abrindo portas para ofertas de emprego públicas, formação profissional e subsídios de apoio ao desemprego. Inclui a criação do perfil online.', 
    difficulty: 'Baixa', painPoints: ['Formulários complexos', 'Dúvidas sobre qualificações', 'Falta de informação sobre programas'],
    requiredDocs: ['NIF', 'NISS', 'Morada', 'Certificados de Habilitações'], isFreeForGold: true
  },
  {
    id: 's14', name: 'Candidatura a Bolsas de Formação', price: '40€', icon: <GraduationCap size={20} />, category: 'Emprego (IEFP)',
    desc: 'Apoio na candidatura a programas de formação com bolsa.', fullDesc: 'Identificamos programas de formação adequados e preparamos a sua candidatura para maximizar as chances de obter uma bolsa. Inclui revisão de CV e carta de motivação.',
    difficulty: 'Média', painPoints: ['Processos de seleção competitivos', 'Documentação específica', 'Prazos curtos'],
    requiredDocs: ['NIF', 'Curriculum Vitae', 'Certificados de Habilitações'], goldDiscount: 10
  },
  {
    id: 's15', name: 'Pedido de Estágio Profissional', price: '35€', icon: <FileBadge size={20} />, category: 'Emprego (IEFP)',
    desc: 'Apoio na procura e candidatura a estágios IEFP.', fullDesc: 'Conectamos-te com oportunidades de estágio profissional e ajudamos a elaborar uma candidatura forte e apelativa. Ideal para entrada no mercado de trabalho.',
    difficulty: 'Média', painPoints: ['Concorrência elevada', 'Requisitos específicos de elegibilidade'],
    requiredDocs: ['NIF', 'Curriculum Vitae', 'Área de interesse'], goldDiscount: 10
  },

  // SERVIÇOS IRN (Instituto dos Registos e Notariado)
  { 
    id: 's7', name: 'Nacionalidade PT', price: '450€', icon: <Scale size={20} />, category: 'IRN (Registo)', 
    desc: 'Pedido de Cidadania Portuguesa.', fullDesc: 'Processo completo de nacionalidade por tempo de residência, casamento ou ascendência. Acompanhamento jurídico especializado e preparação de todo o dossier. Não inclui taxas governamentais.', 
    difficulty: 'Alta', painPoints: ['Anos de espera', 'Erros na certidão de nascimento', 'Documentação complexa e específica'],
    requiredDocs: ['Certidão de Nascimento (original e traduzida)', 'Registo Criminal', 'Comprovativo de ligação à comunidade'], goldDiscount: 15, isEliteExcluded: true // Elite pays Gold price
  },
  {
    id: 's16', name: 'Registo de Nascimento', price: '80€', icon: <BookOpen size={20} />, category: 'IRN (Registo)',
    desc: 'Registo de nascimento de crianças em Portugal.', fullDesc: 'Formalizamos o registo de nascimento do seu filho em Portugal, garantindo todos os documentos e procedimentos corretos junto do IRN. Inclui aconselhamento sobre nomes.',
    difficulty: 'Média', painPoints: ['Prazos legais', 'Documentação dos pais', 'Nacionalidade do bebé'],
    requiredDocs: ['Identificação dos pais', 'Certidão de nascimento estrangeira (se aplicável)', 'Comprovativo de morada'], goldDiscount: 10
  },
  {
    id: 's17', name: 'Certidão de Casamento', price: '60€', icon: <Handshake size={20} />, category: 'IRN (Registo)',
    desc: 'Obtenção de certidões de casamento atualizadas.', fullDesc: 'Solicitamos e obtemos a certidão de casamento necessária para diversos processos, como vistos, nacionalidade ou processos familiares. Envio por correio ou digital.',
    difficulty: 'Baixa', painPoints: ['Demora na emissão', 'Dificuldade de acesso', 'Requisitos específicos'],
    requiredDocs: ['NIF dos cônjuges', 'Data e local do casamento'], isFreeForGold: true
  },
  {
    id: 's18', name: 'Alteração de Nome/Género', price: '120€', icon: <PenSquare size={20} />, category: 'IRN (Registo)',
    desc: 'Processo de mudança de nome ou género no Registo Civil.', fullDesc: 'Aconselhamento e apoio completo na alteração de nome ou género nos documentos oficiais em Portugal. Inclui toda a burocracia do IRN.',
    difficulty: 'Alta', painPoints: ['Procedimentos legais complexos', 'Documentação médica', 'Decisões do conservador'],
    requiredDocs: ['Identificação pessoal', 'Certidão de nascimento', 'Relatório médico/psicológico (se aplicável)'], goldDiscount: 20
  },

  // SERVIÇOS PARA EMIGRANTES / AIMA
  { 
    id: 's5', name: 'Visto D7 / Residência', price: '299€', icon: <Globe size={20} />, category: 'AIMA (Imigração)', 
    desc: 'Visto para Titulares de Rendimentos.', fullDesc: 'Consultoria completa para o visto D7. Análise de extratos e preparação do dossier para a AIMA. Acompanhamento até à marcação. Não inclui taxas governamentais.', 
    difficulty: 'Alta', painPoints: ['Dossier complexo', 'Rejeições por falta de prova financeira', 'Longa espera por agendamento'],
    requiredDocs: ['Prova de Meios de Subsistência', 'Registo Criminal', 'Passaporte', 'Comprovativo de Alojamento'], goldDiscount: 20, isEliteExcluded: true // Elite pays Gold price
  },
  {
    id: 's21', name: 'Manifestação de Interesse (Art. 88/89)', price: '199€', icon: <MessageCircleMore size={20} />, category: 'AIMA (Imigração)',
    desc: 'Regularização de permanência em Portugal por atividade profissional.', fullDesc: 'Apoio completo na submissão da Manifestação de Interesse (Art. 88º/89º da Lei de Estrangeiros). Preparamos o seu processo para a AIMA.',
    difficulty: 'Alta', painPoints: ['Documentação de trabalho', 'Contrato ou promessa de trabalho', 'Provas de entrada no país'],
    requiredDocs: ['Passaporte', 'Comprovativo de entrada legal', 'Contrato de trabalho/promessa'], goldDiscount: 15, isEliteExcluded: true
  },
  {
    id: 's22', name: 'Reagrupamento Familiar', price: '150€', icon: <UserPlus size={20} />, category: 'AIMA (Imigração)',
    desc: 'Processo para trazer familiares para Portugal.', fullDesc: 'Acompanhamento na candidatura ao reagrupamento familiar. Reúna a sua família em Portugal com o nosso apoio especializado.',
    difficulty: 'Média', painPoints: ['Comprovação de laços familiares', 'Meios de subsistência', 'Alojamento'],
    requiredDocs: ['Título de residência do requerente', 'Comprovativo de laços familiares', 'Prova de meios de subsistência'], goldDiscount: 10, isEliteExcluded: true
  },

  // SERVIÇOS PARA VEÍCULOS (IMT / DGV)
  { 
    id: 's6', name: 'Troca de Carta IMT', price: '89€', icon: <Car size={20} />, category: 'Veículos (IMT)', 
    desc: 'Troca de carta estrangeira pela portuguesa.', fullDesc: 'Tratamos do processo de troca da sua carta de condução original pela carta portuguesa junto do IMT. Inclui agendamento e preparação documental.', 
    difficulty: 'Média', painPoints: ['Agendamentos IMT impossíveis', 'Prazos legais apertados', 'Validade da carta estrangeira'],
    requiredDocs: ['Carta Original', 'Certificado de Autenticidade (se aplicável)', 'NIF', 'Atestado Médico'], goldDiscount: 20
  },
  {
    id: 's23', name: 'Registo Inicial de Veículo', price: '110€', icon: <FileClock size={20} />, category: 'Veículos (IMT)',
    desc: 'Primeiro registo de um veículo em Portugal.', fullDesc: 'Processo de registo inicial de veículos importados ou novos, junto do IMT e Conservatória. Garanta a legalização do seu automóvel.',
    difficulty: 'Alta', painPoints: ['Documentação de importação complexa', 'Inspeção tipo B', 'Prazos de registo'],
    requiredDocs: ['Documento Único Automóvel (DUA) estrangeiro', 'Declaração Aduaneira (DAV)', 'Inspeção Técnica'], goldDiscount: 15
  },
  {
    id: 's24', name: 'Alteração de Propriedade de Veículo', price: '65€', icon: <ClipboardPaste size={20} />, category: 'Veículos (IMT)',
    desc: 'Mudança de titularidade de um veículo.', fullDesc: 'Assistência completa para a alteração da propriedade de um veículo. Compra e venda, herança ou doação. Inclui o preenchimento da Declaração de Venda.',
    difficulty: 'Baixa', painPoints: ['Erros no preenchimento', 'Documentos em falta', 'Prazos de registo'],
    requiredDocs: ['Documento Único Automóvel (DUA)', 'Documentos de identificação (comprador e vendedor)'], goldDiscount: 10
  },

  // SERVIÇOS LOCAIS (Junta de Freguesia)
  { 
    id: 's8', name: 'Certificado Residência', price: '15€', icon: <Home size={20} />, category: 'Local (Junta)', 
    desc: 'Atestado de morada da Junta de Freguesia.', fullDesc: 'Tratamos da obtenção do atestado de residência na junta de freguesia local, um documento essencial para muitos processos oficiais. Inclui agendamento e acompanhamento.', 
    difficulty: 'Baixa', painPoints: ['Necessidade de testemunhas', 'Horários curtos', 'Dificuldade de agendamento'],
    requiredDocs: ['Contrato Arrendamento ou Escritura', 'Cartão Cidadão/NIF', '2 Testemunhas (se aplicável)'], isFreeForGold: true
  }
];

export default function App() {
  const [lang, setLang] = useState(getBrowserLang());
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('tratatudo_logged') === 'true');
  const [userRole, setUserRole] = useState<UserRole>((localStorage.getItem('tratatudo_role') as UserRole) || 'client');
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [billingTab, setBillingTab] = useState<'plans' | 'cart' | 'invoices'>('plans');
  const [services, setServices] = useState<ServiceDetail[]>(DEFAULT_SERVICES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [paymentContext, setPaymentContext] = useState<PaymentContext | null>(null); // New state for payment context

  // State for the current user's plan level
  const [userPlan, setUserPlan] = useState<PlanLevel>(() => (localStorage.getItem('tratatudo_plan') as PlanLevel) || 'lite');

  // Notification States
  const [clientHasUnreadMessages, setClientHasUnreadMessages] = useState(false);
  const [adminHasUnreadMessages, setAdminHasUnreadMessages] = useState(0); // Count for admin

  useEffect(() => {
    const savedInvoices = localStorage.getItem('tratatudo_invoices');
    if (savedInvoices) {
      try { setInvoices(JSON.parse(savedInvoices)); } catch (e) { setInvoices([]); }
    }
    // Set a default plan for new users
    if (!localStorage.getItem('tratatudo_plan')) {
      localStorage.setItem('tratatudo_plan', 'lite');
    }
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (invoices.length > 0) {
      localStorage.setItem('tratatudo_invoices', JSON.stringify(invoices));
    }
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('tratatudo_cart', JSON.stringify(cart));
  }, [cart]);


  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('tratatudo_logged', 'true');
    localStorage.setItem('tratatudo_role', role);
    setActiveView(role === 'admin' ? 'admin_dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('tratatudo_logged');
    localStorage.removeItem('tratatudo_role');
  };

  const addToCart = (service: ServiceDetail) => {
    setCart(prev => [...prev, { ...service, addedAt: new Date() }]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // New function to handle payment redirection to chat
  const handleNavigateToChatForPayment = (context: PaymentContext) => {
    setPaymentContext(context);
    setActiveView('chat');
  };

  // Function to finalize payment after chat interaction
  const finalizePaymentFromChat = (method: string, context: PaymentContext) => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('pt-PT');
    const invId = `inv-${Date.now()}`;
    const invNum = `FT 2024/${Math.floor(Math.random() * 9000) + 1000}`;
    
    let description = '';
    let amount = '';

    if (context.type === 'cart') {
      description = `Pagamento de Serviços (${context.items.length} itens)`;
      amount = context.totalAmount;
      setCart([]); // Clear cart after payment
    } else { // context.type === 'plan'
      description = `Subscrição Plano ${context.planLevel.toUpperCase()}`;
      amount = context.amount;
      // Fix: Directly set the user plan state for the App component
      setUserPlan(context.planLevel); 
      localStorage.setItem('tratatudo_plan', context.planLevel);
      
      if (context.planLevel !== 'lite') {
        const savedDocs = JSON.parse(localStorage.getItem('tratatudo_docs') || '[]');
        // Fix: Use the correctly imported `Document` type
        const newContract: Document = { 
          id: `cnt-${Date.now()}`,
          name: `Contrato de Subscrição - Plano ${context.planLevel.toUpperCase()}`,
          category: 'Legal',
          status: 'valid',
          signedAt: new Date().toISOString(),
          content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONCIERGE DIGITAL\n\nENTRE:\n1. TRATATUDO LDA, NIPC 512000000, com sede em Lisboa.\n2. O UTILIZADOR devidamente registado na plataforma.\n\nOBJETO: O presente contrato tem por objeto a prestação de serviços de assessoria administrativa e concierge sob o plano ${context.planLevel.toUpperCase()}.\n\nVIGÊNCIA: O contrato tem a duração de 30 dias, renováveis automaticamente por iguais períodos mediante pagamento.\n\nCONDIÇÕES: Acesso ilimitado à IA, análise documental e suporte prioritário.`
        };
        localStorage.setItem('tratatudo_docs', JSON.stringify([newContract, ...savedDocs]));
      }
    }

    // Fix: Update the invoices state directly using setInvoices
    setInvoices(prev => [{ 
      id: invId,
      date: dateStr,
      description,
      amount,
      status: 'paid',
      method: method as any,
      invoiceNumber: invNum
    }, ...prev]);

    setPaymentContext(null); // Clear payment context
  };

  // Notification Handlers
  const handleNewClientMessageNotification = () => {
    setClientHasUnreadMessages(true);
  };

  const handleClearClientMessageNotification = () => {
    setClientHasUnreadMessages(false);
  };

  const handleUpdateUnreadAdminCount = (count: number) => {
    setAdminHasUnreadMessages(count);
  };


  const renderContent = () => {
    if (selectedService) {
      return (
        <ServiceDetailView 
          service={selectedService} 
          onBack={() => setSelectedService(null)} 
          onAddToCart={(s) => { addToCart(s); setSelectedService(null); setBillingTab('cart'); setActiveView('billing'); }}
          onAskQuestion={() => { setSelectedService(null); setActiveView('chat'); }}
          onViewDocuments={() => { setSelectedService(null); setActiveView('documents'); }}
        />
      );
    }

    switch (activeView) {
      case 'dashboard': return (
        <DashboardView 
          services={services}
          onSelectService={setSelectedService}
          onTalkToSupport={() => setActiveView('chat')}
          onNavigateToDocs={() => setActiveView('documents')}
          onNavigateToBilling={(tab) => { setBillingTab(tab || 'plans'); setActiveView('billing'); }}
          cartItems={cart}
          lang={lang}
        />
      );
      case 'documents': return <DocumentsView />;
      case 'chat': return (
        <ChatView 
          paymentContext={paymentContext} 
          onPaymentSuccess={finalizePaymentFromChat} 
          onNewAiMessageNotification={handleNewClientMessageNotification} // Pass notification handler
          onClearUnreadMessages={handleClearClientMessageNotification} // Pass clear handler
        />
      );
      case 'profile': return <ProfileView onLogout={handleLogout} onNavigate={setActiveView} onLangChange={setLang} />;
      case 'billing': return (
        <BillingView 
          onBack={() => setActiveView('dashboard')} 
          role={userRole} 
          cart={cart}
          removeFromCart={removeFromCart}
          onClearCart={() => setCart([])}
          invoices={invoices}
          onAddInvoice={(inv) => setInvoices(prev => [inv, ...prev])}
          initialTab={billingTab}
          onNavigateToChatForPayment={handleNavigateToChatForPayment} // Pass new prop
        />
      );
      case 'admin_dashboard': return <AdminDashboardView services={services} onUpdateServices={setServices} />;
      case 'admin_clients': return <AdminClientsView />;
      case 'admin_chat': return (
        <AdminChatView 
          onUpdateUnreadAdminCount={handleUpdateUnreadAdminCount} 
        />
      );
      default: return <DashboardView services={services} onSelectService={setSelectedService} onTalkToSupport={() => setActiveView('chat')} onNavigateToDocs={() => setActiveView('documents')} onNavigateToBilling={() => setActiveView('billing')} cartItems={cart} lang={lang} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={(view) => { setActiveView(view); setSelectedService(null); setPaymentContext(null); }} // Clear payment context on view change
      isLoggedIn={isLoggedIn} 
      role={userRole}
      cartCount={cart.length}
      clientHasUnreadMessages={clientHasUnreadMessages} // Pass to Layout
      adminHasUnreadMessages={adminHasUnreadMessages} // Pass to Layout
    >
      {isLoggedIn ? renderContent() : <LandingView onLogin={handleLogin} lang={lang} />}
    </Layout>
  );
}
