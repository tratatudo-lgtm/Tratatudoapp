
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle2, Lock, Mail, Eye, EyeOff, 
  Smartphone, MapPin, Calendar, ArrowLeft, Loader2,
  ShieldCheck, ShieldAlert, KeyRound, Check, User,
  Zap, HeartPulse, Receipt, Car, Wifi, Sparkles
} from 'lucide-react';
import { UserRole } from '../types';
import { t, LanguageCode } from '../services/i18n';

interface LandingViewProps {
  onLogin: (role: UserRole) => void;
  lang?: LanguageCode;
}

type RegisterStep = 'credentials' | 'verify-email' | 'verify-phone' | 'profile-details' | 'finalizing';

export const LandingView: React.FC<LandingViewProps> = ({ onLogin, lang = 'pt' }) => {
  const [view, setView] = useState<'login' | 'register'>('register');
  const [registerStep, setRegisterStep] = useState<RegisterStep>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const STATIC_ADMIN_EMAILS = ['admin@tratatudo.pt', 'geral@tratatudo.pt'];
  const ADMIN_PASS = 'Tratatudoadmin8110?@';

  /**
   * Refatoração: Lógica de Login segregada por perfil
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const normalizedEmail = email.toLowerCase().trim();
    const rawPassword = password;

    // 1. Fluxo de Autenticação de Administrador
    const isAdminDomain = STATIC_ADMIN_EMAILS.includes(normalizedEmail);
    
    if (isAdminDomain) {
      if (rawPassword === ADMIN_PASS) {
        onLogin('admin');
      } else {
        setError('Erro de Acesso: Palavra-passe de administrador incorreta.');
      }
      return;
    }

    // 2. Fluxo de Autenticação de Cliente Standard
    const isValidClientInput = normalizedEmail.length > 0 && rawPassword.length >= 6;
    
    if (isValidClientInput) {
      // Simulação de login de cliente
      onLogin('client');
    } else {
      setError('Credenciais Inválidas: Verifique o email ou certifique-se que a password tem pelo menos 6 caracteres.');
    }
  };

  const nextStep = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (registerStep === 'credentials') setRegisterStep('verify-email');
      else if (registerStep === 'verify-email') setRegisterStep('verify-phone');
      else if (registerStep === 'verify-phone') setRegisterStep('profile-details');
      else if (registerStep === 'profile-details') {
        setRegisterStep('finalizing');
        setTimeout(() => onLogin('client'), 2000);
      }
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const renderRegisterStep = () => {
    switch (registerStep) {
      case 'credentials':
        return (
          <div className="space-y-4 animate-in slide-in-from-right duration-500">
            <div className="text-center mb-6">
              <h3 className="text-lg font-black text-slate-800">Crie a sua Conta</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Acesso ao Concierge Burocrático</p>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Nome Completo" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Palavra-passe" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              onClick={nextStep}
              disabled={!fullName || !email || password.length < 6 || isLoading}
              className="w-full bg-[#002B5B] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>{t('cta_start', lang as LanguageCode)} <ArrowRight size={20} /></>}
            </button>
          </div>
        );

      case 'verify-email':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800">Verifique o seu Email</h3>
              <p className="text-xs text-slate-500 mt-2 px-4 leading-relaxed font-medium">
                Enviámos o código de segurança para <span className="text-blue-600 font-bold">{email}</span>
              </p>
            </div>

            <div className="flex justify-between gap-2">
              {otpCode.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-10 h-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl font-black text-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                />
              ))}
            </div>

            <button 
              onClick={nextStep}
              disabled={otpCode.some(d => !d) || isLoading}
              className="w-full bg-[#002B5B] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Validar Conta <CheckCircle2 size={20} /></>}
            </button>
          </div>
        );

      case 'verify-phone':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Smartphone size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800">Alertas Críticos</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">Receba lembretes sobre prazos de IRS, renovação de carta e seguros por SMS.</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2 border-r border-slate-200">
                  <span className="text-xs font-black text-slate-400">🇵🇹 +351</span>
                </div>
                <input 
                  type="tel" 
                  placeholder="9xx xxx xxx" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-24 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <button 
              onClick={nextStep}
              disabled={!phone || isLoading}
              className="w-full bg-[#002B5B] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Ativar Notificações <ArrowRight size={20} /></>}
            </button>
          </div>
        );

      case 'profile-details':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800">Dados Legais</h3>
              <p className="text-xs text-slate-500 mt-2">Personalize a sua experiência de concierge.</p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                <textarea 
                  placeholder="Morada de Residência"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 resize-none"
                />
              </div>
            </div>

            <button 
              onClick={nextStep}
              disabled={!birthDate || !address || isLoading}
              className="w-full bg-[#002B5B] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Finalizar Perfil <Check size={20} /></>}
            </button>
          </div>
        );

      case 'finalizing':
        return (
          <div className="py-12 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-600 text-white rounded-[40px] flex items-center justify-center shadow-2xl animate-pulse">
                <Sparkles size={48} />
              </div>
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2 rounded-full border-4 border-white">
                <Check size={20} strokeWidth={4} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">Bem-vindo à Liberdade!</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">A TrataTudo está agora ao seu serviço.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative border-x border-slate-200 shadow-2xl overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-600/5 rounded-full -ml-40 -mb-40"></div>

      <div className="flex-1 p-8 flex flex-col justify-center relative z-10">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M20 30 Q30 20 40 30 L35 50 Q25 40 20 30" fill="#002B5B" />
              <rect x="5" y="55" width="22" height="16" rx="3" fill="#FF6600" />
              <path d="M12 55 L12 50 Q12 46 16 46 L20 46 L20 55" fill="none" stroke="#FF6600" strokeWidth="3" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-[#002B5B] tracking-tight leading-tight">
             {t('slogan', lang as LanguageCode)}
          </h1>
          <p className="text-sm text-slate-500 mt-4 font-bold uppercase tracking-widest">
            {t('subSlogan', lang as LanguageCode)}
          </p>
        </div>

        {view === 'register' ? (
          <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100">
            {renderRegisterStep()}
            
            <div className="mt-8 pt-8 border-t border-slate-50 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Já tem conta? <button onClick={() => setView('login')} className="text-blue-600 font-black ml-1">Entrar</button>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100 animate-in slide-in-from-left duration-500">
            <div className="text-center mb-8">
              <h3 className="text-xl font-black text-slate-800">Aceder à Consola</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Bem-vindo de volta ao TrataTudo</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10" 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Palavra-passe" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase text-center animate-in fade-in slide-in-from-top-1">{error}</div>}

              <button className="w-full bg-[#002B5B] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                Entrar Agora <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-50 text-center">
              <button onClick={() => setView('register')} className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                <ArrowLeft size={16} /> Criar nova conta grátis
              </button>
            </div>
          </div>
        )}

        {/* Feature Icons */}
        <div className="mt-12 grid grid-cols-5 gap-2 px-2">
           <div className="flex flex-col items-center gap-1 opacity-40" title="Apoio na gestão de contratos de eletricidade e gás.">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Zap size={20} /></div>
              <span className="text-[7px] font-black uppercase">Energia</span>
           </div>
           <div className="flex flex-col items-center gap-1 opacity-40" title="Consultoria para serviços de internet e telecomunicações.">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600"><Wifi size={20} /></div>
              <span className="text-[7px] font-black uppercase">Fibra</span>
           </div>
           <div className="flex flex-col items-center gap-1 opacity-40" title="Assistência em seguros de saúde e acesso a serviços.">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600"><HeartPulse size={20} /></div>
              <span className="text-[7px] font-black uppercase">Saúde</span>
           </div>
           <div className="flex flex-col items-center gap-1 opacity-40" title="Ajuda com impostos e obrigações fiscais (IRS, NIF).">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600"><Receipt size={20} /></div>
              <span className="text-[7px] font-black uppercase">Fiscal</span>
           </div>
           <div className="flex flex-col items-center gap-1 opacity-40" title="Processos relacionados com veículos (IMT, troca de carta).">
              <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-700"><Car size={20} /></div>
              <span className="text-[7px] font-black uppercase">Carro</span>
           </div>
        </div>
      </div>
    </div>
  );
};
