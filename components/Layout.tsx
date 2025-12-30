
import React, { useRef, useEffect } from 'react';
import { Home, FileText, MessageSquare, User, LayoutDashboard, Users, CreditCard, ShoppingCart, Sparkles } from 'lucide-react';
import { AppView, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  isLoggedIn: boolean;
  role: UserRole;
  cartCount?: number;
  clientHasUnreadMessages?: boolean; // New prop
  adminHasUnreadMessages?: number; // New prop (count for admin)
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, isLoggedIn, role, cartCount = 0, clientHasUnreadMessages = false, adminHasUnreadMessages = 0 }) => {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeView]);

  const clientNav = [
    { id: 'dashboard' as AppView, icon: LayoutDashboard, label: 'Início' },
    { id: 'documents' as AppView, icon: FileText, label: 'Docs' },
    { id: 'chat' as AppView, icon: MessageSquare, label: 'Apoio', hasNotification: clientHasUnreadMessages },
    { id: 'billing' as AppView, icon: CreditCard, label: 'Faturas' },
    { id: 'profile' as AppView, icon: User, label: 'Perfil' },
  ];

  const adminNav = [
    { id: 'admin_dashboard' as AppView, icon: LayoutDashboard, label: 'Painel' },
    { id: 'admin_clients' as AppView, icon: Users, label: 'Clientes' },
    { id: 'admin_chat' as AppView, icon: MessageSquare, label: 'Mensagens', notificationCount: adminHasUnreadMessages },
    { id: 'profile' as AppView, icon: User, label: 'Perfil' },
  ];

  const navItems = role === 'admin' ? adminNav : clientNav;

  if (!isLoggedIn) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-md mx-auto border-x border-slate-200 shadow-xl relative">
      <style>{`
        @keyframes subtle-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 43, 91, 0.4); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 12px rgba(0, 43, 91, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 43, 91, 0); }
        }
        .nav-pulse {
          animation: subtle-pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
        .profile-btn-anim:active {
          transform: scale(0.9);
        }
      `}</style>
      
      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer" onClick={() => setActiveView('dashboard')}>
              <path d="M20 30 Q30 20 40 30 L35 50 Q25 40 20 30" fill="#002B5B" />
              <rect x="5" y="55" width="22" height="16" rx="3" fill="#FF6600" />
              <path d="M12 55 L12 50 Q12 46 16 46 L20 46 L20 55" fill="none" stroke="#FF6600" strokeWidth="3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-[#002B5B] tracking-tight leading-none text-lg">
              Trata Tudo<span className="text-[#E30613]">.pt</span>
            </h1>
            {role === 'admin' && <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">Backoffice</span>}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {role === 'client' && (
            <button 
              onClick={() => setActiveView('billing')}
              className="relative p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          <button 
            onClick={() => setActiveView('profile')}
            className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-100 shadow-sm profile-btn-anim transition-transform active:scale-90"
          >
            <img src={role === 'admin' ? "https://i.pravatar.cc/150?u=admin" : "https://i.pravatar.cc/150?u=client"} alt="User Profile" />
          </button>
        </div>
      </header>

      <main ref={mainRef} className="flex-1 overflow-y-auto pb-20 scroll-smooth">
        {children}
      </main>

      <nav className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 flex items-center justify-around px-2 z-40">
        {navItems.map((item) => {
          const isChat = item.id === 'chat' || item.id === 'admin_chat';
          const isActive = activeView === item.id;
          const showNotification = (item as any).hasNotification || ((item as any).notificationCount && (item as any).notificationCount > 0);
          const notificationCount = (item as any).notificationCount;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all relative ${
                isActive ? 'text-[#002B5B]' : 'text-slate-400'
              }`}
            >
              <div className={`relative flex items-center justify-center transition-all ${
                isChat ? 'w-12 h-12 rounded-full bg-[#002B5B] text-white shadow-lg nav-pulse -translate-y-4 scale-110' : 'w-8 h-8'
              }`}>
                {isChat ? <Sparkles size={24} /> : <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />}
                {showNotification && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {notificationCount && notificationCount > 0 ? notificationCount : ''}
                  </span>
                )}
              </div>
              <span className={`text-[8px] uppercase tracking-wider font-black mt-1 ${isActive ? 'opacity-100' : 'opacity-60'} ${isChat ? '-mt-2' : ''}`}>
                {item.label}
              </span>
              {isActive && !isChat && <div className="absolute bottom-2 w-1 h-1 bg-[#002B5B] rounded-full"></div>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
