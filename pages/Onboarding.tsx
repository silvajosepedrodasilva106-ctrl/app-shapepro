
import React, { useState } from 'react';
import { useApp } from '../App';
import { Goal, Level, Location, UserProfile } from '../types';
import { generateFitnessPlan } from '../services/geminiService';
import { Loader2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { setUser, setPlan, addProgress } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    sex: 'Masculino',
    weight: 70,
    height: 170,
    goal: Goal.LOSE_WEIGHT,
    level: Level.BEGINNER,
    location: Location.HOME,
    daysPerWeek: 3,
    isPremium: false,
    createdAt: new Date().toISOString()
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const fullProfile = {
        ...formData,
        createdAt: new Date().toISOString() // Garante a data atual no envio
      } as UserProfile;
      
      setUser(fullProfile);
      
      const generatedPlan = await generateFitnessPlan(fullProfile);
      setPlan(generatedPlan);
      
      addProgress(fullProfile.weight);
      
      onComplete();
    } catch (err) {
      console.error(err);
      setError("Houve um problema ao gerar seu plano. Verifique sua conexão e tente novamente.");
      setLoading(false);
    }
  };

  const ProgressHeader = () => (
    <div className="flex gap-2 mb-8 justify-center">
      {[1, 2, 3, 4].map(s => (
        <div 
          key={s} 
          className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= s ? 'bg-emerald-500 w-16' : 'bg-slate-800'}`} 
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="relative">
          <Loader2 className="text-emerald-500 animate-spin mb-6" size={80} strokeWidth={1.5} />
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full -z-10 animate-pulse" />
        </div>
        <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Criando seu Plano com IA...</h2>
        <p className="text-slate-400 max-w-sm">Analisando dados antropométricos e objetivos para otimizar seus resultados.</p>
        <div className="mt-10 space-y-4 w-full max-w-xs mx-auto">
          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 animate-[loading_3s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
          </div>
          <p className="text-emerald-400/80 text-xs font-mono tracking-widest uppercase">Processando algoritmo fitness</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl animate-fadeIn">
        <ProgressHeader />

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Quem é você?</h2>
            <p className="text-slate-400 text-sm mb-6">Comece nos contando o básico sobre você.</p>
            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Seu Nome Completo</label>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none border-transparent transition-all"
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Idade</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Sexo</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.sex}
                  onChange={e => setFormData({ ...formData, sex: e.target.value as any })}
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Suas medidas</h2>
            <p className="text-slate-400 text-sm mb-6">Isso ajuda a IA calcular suas necessidades calóricas.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Peso (kg)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Altura (cm)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.height}
                  onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Qual seu objetivo principal?</label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(Goal).map(g => (
                  <button
                    key={g}
                    onClick={() => setFormData({ ...formData, goal: g })}
                    className={`text-left px-5 py-4 rounded-2xl border transition-all ${
                      formData.goal === g ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Experiência</h2>
            <p className="text-slate-400 text-sm mb-6">Ajustamos a intensidade para evitar lesões.</p>
            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Nível de Treino</label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(Level).map(l => (
                  <button
                    key={l}
                    onClick={() => setFormData({ ...formData, level: l })}
                    className={`text-left px-5 py-4 rounded-2xl border transition-all ${
                      formData.level === l ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Onde vai treinar?</label>
              <div className="flex gap-2">
                {Object.values(Location).map(loc => (
                  <button
                    key={loc}
                    onClick={() => setFormData({ ...formData, location: loc })}
                    className={`flex-1 text-center px-5 py-4 rounded-2xl border transition-all ${
                      formData.location === loc ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Disponibilidade</h2>
            <p className="text-slate-400 text-sm mb-6">Seja realista para manter a constância.</p>
            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Dias disponíveis por semana</label>
              <div className="flex justify-between items-center gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <input 
                  type="range" 
                  min="2" 
                  max="7" 
                  className="w-full accent-emerald-500 h-2"
                  value={formData.daysPerWeek}
                  onChange={e => setFormData({ ...formData, daysPerWeek: Number(e.target.value) })}
                />
                <span className="text-3xl font-black text-emerald-500 w-12 text-center">{formData.daysPerWeek}</span>
              </div>
              <div className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem]">
                <p className="text-sm text-slate-400 leading-relaxed text-center">
                  Comece agora com seu <span className="text-emerald-400 font-bold">Teste Grátis de 3 dias</span>! Nossa IA vai criar seu plano agora mesmo.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex gap-4">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="flex-1 bg-slate-800 text-slate-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <button 
            onClick={step === 4 ? handleSubmit : nextStep}
            disabled={!formData.name && step === 1}
            className="flex-[3] bg-emerald-500 text-slate-950 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/10"
          >
            {step === 4 ? 'Gerar Meu Plano Agora' : 'Continuar'} {step < 4 && <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
