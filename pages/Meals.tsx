
import React from 'react';
import { useApp } from '../App';
import { Clock, ShieldAlert, ChevronLeft } from 'lucide-react';

const Meals: React.FC = () => {
  const { state, setActiveTab } = useApp();
  const meals = state.plan?.meals || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="p-2 bg-slate-900 rounded-full text-slate-400"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Plano Alimentar 🥗</h1>
        <div className="w-10"></div>
      </header>
      
      <p className="text-slate-500 text-center font-medium">Foco diário em <span className="text-emerald-400 font-bold">{state.plan?.totalDailyCalories} kcal</span>.</p>

      {/* Warning Alert */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3 items-start">
        <ShieldAlert className="text-amber-500 shrink-0" size={20} />
        <p className="text-[10px] text-amber-500/80 leading-relaxed font-bold uppercase tracking-wider">
          ESTE PLANO É GERADO POR IA E NÃO SUBSTITUI UM NUTRICIONISTA. CONSULTE UM MÉDICO ANTES DE COMEÇAR.
        </p>
      </div>

      <div className="space-y-4">
        {meals.map((meal, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="bg-slate-800/50 p-4 flex justify-between items-center border-b border-slate-800/50">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-400" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{meal.time}</span>
              </div>
              <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 uppercase">
                ~{meal.calories} kcal
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-slate-100 mb-4 uppercase italic tracking-tight">{meal.title}</h3>
              <ul className="space-y-3">
                {meal.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0 shadow-lg shadow-emerald-500/50" />
                    <span className="text-sm font-medium leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meals;
