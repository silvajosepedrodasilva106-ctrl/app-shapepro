
import React from 'react';
import { useApp } from '../App';
import { Check, Crown, Zap, ShieldCheck, ChevronLeft } from 'lucide-react';

const Premium: React.FC = () => {
  const { state, setActiveTab } = useApp();

  const features = [
    "Planos de treino infinitos",
    "Sugestões de receitas extras",
    "Gráficos detalhados de evolução",
    "Suporte prioritário via WhatsApp",
    "Sem anúncios no app",
    "Acesso a desafios exclusivos"
  ];

  if (state.user?.isPremium) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-fadeIn">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="absolute top-6 left-6 p-3 bg-slate-900 rounded-full text-slate-400"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="bg-emerald-500/20 p-8 rounded-full shadow-2xl shadow-emerald-500/10 relative">
          <Crown size={80} className="text-emerald-400 animate-bounce" />
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full -z-10" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">VOCÊ É PREMIUM!</h1>
        <p className="text-slate-400 max-w-sm">Aproveite todos os recursos liberados para sua transformação extrema.</p>
        <div className="bg-slate-900 p-8 rounded-[3rem] border border-emerald-500/30 w-full max-w-sm shadow-2xl">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-3">Assinatura Ativa</p>
          <p className="text-4xl font-black text-emerald-400 italic">352 DIAS</p>
          <div className="mt-6 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[95%]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <header className="relative flex items-center justify-center py-4">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="absolute left-0 p-3 bg-slate-900 rounded-full text-slate-400"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Premium</h1>
      </header>

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black italic tracking-tighter leading-none uppercase">LIBERE SEU PODER</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Escolha o plano ideal para seus resultados.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Plan */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] flex flex-col hover:border-slate-700 transition-all shadow-xl group">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Mensal</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase">Flexibilidade total</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <Zap className="text-emerald-400" size={24} fill="currentColor" />
            </div>
          </div>
          <div className="mb-10">
            <span className="text-5xl font-black italic tracking-tighter">R$ 29,90</span>
            <span className="text-slate-600 font-black text-sm uppercase">/mês</span>
          </div>
          <button 
            onClick={() => setActiveTab('checkout')}
            className="w-full bg-slate-800 text-slate-200 py-5 rounded-[2rem] font-black uppercase tracking-widest mb-10 hover:bg-slate-700 transition-colors shadow-lg active:scale-95"
          >
            Assinar Mensal
          </button>
          <ul className="space-y-4 mt-auto">
            {features.slice(0, 4).map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <Check size={16} className="text-emerald-500" strokeWidth={3} /> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Annual Plan */}
        <div className="bg-emerald-500 text-slate-950 p-8 rounded-[3rem] flex flex-col transform shadow-2xl shadow-emerald-500/30 relative overflow-hidden group border-2 border-emerald-400/50">
          <div className="absolute top-0 right-0 bg-slate-950 text-emerald-400 px-6 py-3 rounded-bl-[2rem] text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
            MELHOR OFERTA
          </div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Anual</h3>
              <p className="text-slate-950/60 text-[10px] font-black uppercase">Economize 45%</p>
            </div>
            <div className="bg-slate-950/10 p-3 rounded-2xl group-hover:rotate-12 transition-transform">
              <Crown className="text-slate-950" size={24} fill="currentColor" />
            </div>
          </div>
          <div className="mb-10">
            <span className="text-5xl font-black italic tracking-tighter leading-none">R$ 199,90</span>
            <span className="text-slate-800/60 font-black text-sm uppercase">/ano</span>
          </div>
          <button 
            onClick={() => setActiveTab('checkout')}
            className="w-full bg-slate-950 text-emerald-400 py-5 rounded-[2rem] font-black uppercase tracking-widest mb-10 hover:bg-slate-900 transition-all shadow-2xl active:scale-95"
          >
            Começar Agora
          </button>
          <ul className="space-y-4 mt-auto">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-[9px] font-black text-slate-900 uppercase tracking-widest">
                <Check size={16} strokeWidth={4} /> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Premium;
