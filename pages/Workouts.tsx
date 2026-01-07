
import React, { useState } from 'react';
import { useApp } from '../App';
import { generateFitnessPlan } from '../services/geminiService';
import { 
  CheckCircle2, 
  Circle, 
  Info, 
  ChevronLeft, 
  Zap, 
  Sparkles, 
  Loader2,
  RefreshCw
} from 'lucide-react';

const Workouts: React.FC = () => {
  const { state, completeWorkout, setPlan, setActiveTab } = useApp();
  const [selectedDay, setSelectedDay] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const workouts = state.plan?.workouts || [];
  const currentWorkout = workouts[selectedDay];

  const handleRegenerate = async () => {
    if (!state.user) return;
    
    setIsRegenerating(true);
    try {
      const newPlan = await generateFitnessPlan(state.user);
      setPlan(newPlan);
      setCompletedExercises([]);
      setIsFinished(false);
      alert("IA: Seu plano de treinos foi atualizado com novos exercícios!");
    } catch (error) {
      alert("Erro ao regenerar treino. Tente novamente em instantes.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const toggleExercise = (index: number) => {
    if (completedExercises.includes(index)) {
      setCompletedExercises(completedExercises.filter(i => i !== index));
    } else {
      setCompletedExercises([...completedExercises, index]);
    }
  };

  const handleFinish = () => {
    if (isFinished) return;
    completeWorkout();
    setIsFinished(true);
    setTimeout(() => {
      setIsFinished(false);
      setCompletedExercises([]);
    }, 3000);
  };

  const markAllAndFinish = () => {
    if (!currentWorkout) return;
    const allIndices = currentWorkout.exercises.map((_, i) => i);
    setCompletedExercises(allIndices);
    handleFinish();
  };

  if (isRegenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fadeIn">
        <div className="relative">
          <Loader2 className="text-emerald-500 animate-spin" size={64} strokeWidth={1.5} />
          <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={24} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">IA Criando Novo Treino</h2>
          <p className="text-slate-500 text-sm max-w-xs">Analisando novas combinações de exercícios para o seu nível {state.user?.level}...</p>
        </div>
      </div>
    );
  }

  if (!currentWorkout) return (
    <div className="p-8 text-center space-y-4">
      <p className="text-slate-500 font-bold">Nenhum plano disponível.</p>
      <button 
        onClick={handleRegenerate}
        className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs"
      >
        Gerar Treino Agora
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="p-3 hover:bg-slate-900 rounded-full text-slate-400 bg-slate-900/50"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Meu Treino 🏋️</h1>
        <button 
          onClick={handleRegenerate}
          className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full text-emerald-400 transition-all active:scale-95 border border-emerald-500/20 group"
          title="Mudar meu treino com IA"
        >
          <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </header>

      {/* Seletor de Dia (A, B, C) */}
      <div className="flex gap-2 justify-start pb-2 overflow-x-auto no-scrollbar mask-fade-edges">
        {workouts.map((w, i) => (
          <button
            key={i}
            onClick={() => { setSelectedDay(i); setCompletedExercises([]); }}
            className={`min-w-[80px] h-14 rounded-2xl font-black uppercase tracking-widest transition-all text-[10px] ${
              selectedDay === i 
                ? 'bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/20 scale-105' 
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            {w.title.replace('Treino ', '')}
          </button>
        ))}
      </div>

      {/* Banner Informativo / Regenerar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex flex-col gap-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-emerald-400 uppercase italic tracking-tighter leading-none">{currentWorkout.title}</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Personalizado para seu objetivo de {state.user?.goal}</p>
          </div>
          <button 
            onClick={handleRegenerate}
            className="bg-slate-950 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500/10 transition-all"
          >
            <Sparkles size={14} /> Mudar Treino Hoje
          </button>
        </div>
        
        <div className="h-px bg-slate-800 w-full" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-emerald-500/10 p-2 rounded-lg">
                <Zap size={18} className="text-emerald-500" />
             </div>
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{currentWorkout.exercises.length} Exercícios Prescritos</span>
          </div>
          <button 
            onClick={markAllAndFinish}
            className="bg-emerald-500 text-slate-950 px-6 py-4 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            Concluir Tudo
          </button>
        </div>
      </div>

      {/* Lista de Exercícios */}
      <div className="space-y-3">
        {currentWorkout.exercises.map((ex, idx) => (
          <div 
            key={idx}
            onClick={() => toggleExercise(idx)}
            className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex items-center gap-5 ${
              completedExercises.includes(idx) 
                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-inner' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className={`transition-all duration-300 ${completedExercises.includes(idx) ? 'text-emerald-500 scale-110' : 'text-slate-800'}`}>
              {completedExercises.includes(idx) ? <CheckCircle2 size={30} strokeWidth={2.5} /> : <Circle size={30} strokeWidth={2} />}
            </div>
            <div className="flex-1">
              <h4 className={`text-base font-black transition-all uppercase tracking-tight ${completedExercises.includes(idx) ? 'text-slate-600 line-through italic' : 'text-slate-100'}`}>
                {ex.name}
              </h4>
              <div className="flex gap-2 mt-2">
                <span className="text-[9px] bg-slate-950 px-3 py-1 rounded-lg text-slate-500 font-black border border-slate-800 uppercase tracking-widest">{ex.sets} SÉRIES</span>
                <span className="text-[9px] bg-slate-950 px-3 py-1 rounded-lg text-slate-500 font-black border border-slate-800 uppercase tracking-widest">{ex.reps} REPS</span>
              </div>
            </div>
            <button 
              className="text-slate-700 hover:text-emerald-400 p-2 transition-colors"
              onClick={(e) => { e.stopPropagation(); alert(ex.description); }}
            >
              <Info size={20} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleFinish}
        disabled={completedExercises.length === 0 || isFinished}
        className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95 ${
          isFinished 
            ? 'bg-green-500 text-white animate-pulse' 
            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-600 shadow-emerald-500/20 disabled:opacity-20 disabled:grayscale'
        }`}
      >
        {isFinished ? '✓ TREINO CONCLUÍDO! +50PTS' : 'FINALIZAR TREINO'}
      </button>
    </div>
  );
};

export default Workouts;
