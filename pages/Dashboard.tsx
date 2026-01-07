
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Flame, Trophy, Calendar, Target, Plus, X, Crown, Clock, History, Star, CheckCircle2, Circle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state, addProgress, getRemainingTrialDays, setActiveTab, toggleWorkoutDate } = useApp();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [activeModal, setActiveModal] = useState<'streak' | 'points' | 'history' | null>(null);
  const [newWeight, setNewWeight] = useState('');

  const remainingDays = getRemainingTrialDays();
  const isPremium = state.user?.isPremium;

  useEffect(() => {
    if (showWeightModal && state.user) {
      setNewWeight(state.user.weight.toString());
    }
  }, [showWeightModal, state.user]);

  const weightData = state.progress.length > 0 
    ? state.progress 
    : [{ date: 'Início', weight: state.user?.weight || 0 }];

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightVal = parseFloat(newWeight.replace(',', '.'));
    if (!isNaN(weightVal) && weightVal > 0) {
      addProgress(weightVal);
      setShowWeightModal(false);
    } else {
      alert("Por favor, insira um peso válido.");
    }
  };

  // Helper para gerar os dias da semana atual
  const getWeekDays = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Inicia no Domingo (0)
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: dateStr,
        dayName: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
        dayNum: d.getDate(),
        isToday: dateStr === now.toISOString().split('T')[0],
        isDone: state.workoutLog.includes(dateStr)
      };
    });
  };

  const weekDays = getWeekDays();

  const renderModal = () => {
    if (!activeModal) return null;

    const modalContent = {
      streak: {
        title: "Sua Constância",
        icon: <Flame className="text-orange-500" size={40} />,
        description: `Você está há ${state.streak} dias focado! A constância é o segredo para resultados duradouros. Não quebre sua sequência.`,
        tip: "Dica: Treinar no mesmo horário ajuda a criar o hábito mais rápido."
      },
      points: {
        title: "Shape Points",
        icon: <Trophy className="text-yellow-500" size={40} />,
        description: `Você acumulou ${state.points} pontos de experiência!`,
        tip: "Como ganhar: +50 por treino concluído, +10 por atualização de peso semanal."
      },
      history: {
        title: "Histórico de Registros",
        icon: <History className="text-blue-500" size={40} />,
        description: "Confira sua jornada de peso até aqui:",
        tip: ""
      }
    };

    const content = modalContent[activeModal];

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{content.title}</h3>
            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow-inner">
              {content.icon}
            </div>
            <p className="text-slate-300 leading-relaxed">{content.description}</p>
            
            {activeModal === 'history' && (
              <div className="w-full max-h-48 overflow-y-auto space-y-2 mt-4 pr-2 custom-scrollbar">
                {state.progress.length > 0 ? (
                  state.progress.slice().reverse().map((entry, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-xs font-bold text-slate-500">{entry.date}</span>
                      <span className="text-sm font-black text-emerald-400">{entry.weight} kg</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Nenhum registro ainda.</p>
                )}
              </div>
            )}

            {content.tip && (
              <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 w-full mt-4">
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2 justify-center">
                  <Star size={12} fill="currentColor" /> {content.tip}
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setActiveModal(null)}
            className="w-full mt-8 bg-slate-800 text-slate-200 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all active:scale-95"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* Weight Update Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Atualizar Peso</h3>
              <button onClick={() => setShowWeightModal(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleWeightSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase mb-3 tracking-widest">Peso Atual (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-6 py-5 focus:ring-2 focus:ring-emerald-500 outline-none text-3xl font-black text-center text-emerald-400"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="00.0"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-emerald-500 text-slate-950 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
              >
                Confirmar Peso
              </button>
            </form>
          </div>
        </div>
      )}

      {renderModal()}

      {/* Header com Calendário Semanal */}
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">ShapePro <span className="text-emerald-500">AI</span></h1>
            <p className="text-slate-400 mt-2 italic text-xs">Acompanhe seu progresso semanal</p>
          </div>
          <button 
            onClick={() => setShowWeightModal(true)}
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all text-sm font-bold active:scale-95 shadow-lg shadow-emerald-500/5"
          >
            <Plus size={18} /> <span>Atualizar Peso</span>
          </button>
        </div>

        {/* Weekly Calendar Tracker */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Agenda Semanal</h3>
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Toque para atualizar</span>
          </div>
          <div className="flex justify-between items-center gap-1">
            {weekDays.map((day, idx) => (
              <button
                key={idx}
                onClick={() => toggleWorkoutDate(day.date)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all flex-1 ${
                  day.isToday 
                    ? 'bg-emerald-500/10 border border-emerald-500/30' 
                    : 'hover:bg-slate-800 border border-transparent'
                }`}
              >
                <span className={`text-[9px] font-black uppercase ${day.isToday ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {day.dayName}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  day.isDone 
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-950 border border-slate-800 text-slate-800'
                }`}>
                  {day.isDone ? <CheckCircle2 size={20} /> : <span className="font-black text-sm">{day.dayNum}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Trial Banner */}
      {!isPremium && (
        <div className={`p-4 rounded-[1.5rem] border flex items-center justify-between ${remainingDays > 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className="flex items-center gap-3">
            <Clock className={remainingDays > 0 ? 'text-blue-400' : 'text-red-400'} size={20} />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-200">
                {remainingDays > 0 ? `Teste Grátis: ${remainingDays} dias restantes` : 'Teste Expirado'}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Assine o Premium para acesso total</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('premium')}
            className="bg-slate-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20 hover:bg-slate-900 transition-all"
          >
            Upgrade <Crown size={12} className="inline ml-1" />
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => setActiveModal('streak')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] flex flex-col items-center text-center shadow-sm hover:border-orange-500/30 hover:bg-slate-800/50 transition-all active:scale-95 group"
        >
          <div className="bg-orange-500/10 p-2.5 rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <Flame className="text-orange-500" size={24} />
          </div>
          <span className="text-2xl font-black text-slate-100">{state.streak}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Dias Seguidos</span>
        </button>

        <button 
          onClick={() => setActiveModal('points')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] flex flex-col items-center text-center shadow-sm hover:border-yellow-500/30 hover:bg-slate-800/50 transition-all active:scale-95 group"
        >
          <div className="bg-yellow-500/10 p-2.5 rounded-xl mb-3 group-hover:scale-110 transition-transform">
            < Trophy className="text-yellow-500" size={24} />
          </div>
          <span className="text-2xl font-black text-slate-100">{state.points}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Shape Points</span>
        </button>

        <button 
          onClick={() => setActiveModal('history')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] flex flex-col items-center text-center shadow-sm hover:border-blue-500/30 hover:bg-slate-800/50 transition-all active:scale-95 group"
        >
          <div className="bg-blue-500/10 p-2.5 rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <Calendar className="text-blue-500" size={24} />
          </div>
          <span className="text-2xl font-black text-slate-100">{state.progress.length}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Registros</span>
        </button>

        <button 
          onClick={() => setActiveTab('meals')}
          className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-[2rem] flex flex-col items-center text-center shadow-sm hover:bg-emerald-500/20 transition-all active:scale-95 group"
        >
          <div className="bg-emerald-500/10 p-2.5 rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <Target className="text-emerald-500" size={24} />
          </div>
          <span className="text-2xl font-black text-emerald-500">{state.plan?.totalDailyCalories || 0}</span>
          <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest mt-1">Meta kcal</span>
        </button>
      </div>

      {/* Evolution Chart */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-lg">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-100">
          Evolução de Peso (kg)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWeight)" 
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
