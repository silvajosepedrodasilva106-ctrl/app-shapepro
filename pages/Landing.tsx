
import React from 'react';
import { ShieldCheck, Zap, Activity, ChevronRight } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl px-6 py-20 text-center flex flex-col items-center">
        <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1 rounded-full text-sm font-semibold mb-6 animate-pulse border border-emerald-500/20">
          INTELIGÊNCIA ARTIFICIAL APLICADA
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
          ShapePro <span className="text-emerald-500">AI</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          O futuro do fitness chegou. Tenha treinos e planos alimentares 100% personalizados criados por IA, focados na sua realidade brasileira.
        </p>
        <button 
          onClick={onStart}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-4 px-10 rounded-2xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-emerald-500/20"
        >
          Começar Minha Transformação <ChevronRight size={20} />
        </button>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 w-full max-w-5xl px-6 pb-20">
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
          <div className="bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <Zap className="text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Treinos Dinâmicos</h3>
          <p className="text-slate-400">A IA ajusta seus exercícios baseada no seu nível e onde você quer treinar: casa ou academia.</p>
        </div>
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
          <div className="bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <Activity className="text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Dieta Brasileira</h3>
          <p className="text-slate-400">Nada de ingredientes caros. Planos focados em alimentos que você encontra no mercado da esquina.</p>
        </div>
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
          <div className="bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <ShieldCheck className="text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Evolução Real</h3>
          <p className="text-slate-400">Acompanhe seu progresso, peso e sinta a diferença com gamificação e metas reais.</p>
        </div>
      </section>

      <footer className="mt-auto py-10 text-slate-500 text-sm">
        &copy; 2024 ShapePro AI. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Landing;
