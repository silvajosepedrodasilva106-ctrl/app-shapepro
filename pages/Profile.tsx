
import React from 'react';
import { useApp } from '../App';
import { LogOut, Settings, Bell, HelpCircle, FileText, ChevronRight } from 'lucide-react';

const Profile: React.FC = () => {
  const { state, logout } = useApp();

  const menuItems = [
    { label: 'Notificações', icon: Bell, sub: 'Lembretes de treino ativos' },
    { label: 'Ajuda & Suporte', icon: HelpCircle, sub: 'Fale conosco' },
    { label: 'Termos de Uso', icon: FileText, sub: 'Privacidade e regras' },
    { label: 'Configurações', icon: Settings, sub: 'Senha e e-mail' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header Profile */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-3xl border-2 border-emerald-500/30">
          {state.user?.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{state.user?.name}</h1>
          <p className="text-slate-400 text-sm">{state.user?.goal} • {state.user?.level}</p>
          <div className="mt-1 flex gap-2">
            {state.user?.isPremium && (
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-500/20">
                Premium Account
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">Peso</p>
          <p className="text-lg font-bold text-slate-100">{state.user?.weight} kg</p>
        </div>
        <div className="border-x border-slate-800">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">Altura</p>
          <p className="text-lg font-bold text-slate-100">{state.user?.height} cm</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">Idade</p>
          <p className="text-lg font-bold text-slate-100">{state.user?.age} anos</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-3">
        {menuItems.map((item, idx) => (
          <button 
            key={idx} 
            className="w-full bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between group hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-slate-700 transition-colors">
                <item.icon className="text-slate-400" size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-100">{item.label}</p>
                <p className="text-xs text-slate-500">{item.sub}</p>
              </div>
            </div>
            <ChevronRight className="text-slate-600" size={20} />
          </button>
        ))}
      </div>

      <button 
        onClick={logout}
        className="w-full mt-10 p-5 rounded-2xl flex items-center justify-center gap-3 text-red-500 font-bold bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors"
      >
        <LogOut size={20} /> Sair da Conta
      </button>

      <footer className="text-center text-slate-600 text-[10px] py-4 uppercase tracking-[0.2em]">
        ShapePro AI v1.0.4 • Made with AI
      </footer>
    </div>
  );
};

export default Profile;
