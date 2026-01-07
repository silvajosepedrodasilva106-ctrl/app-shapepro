
import React, { useState } from 'react';
import { useApp } from '../App';
import { ChevronLeft, CreditCard, ShieldCheck, Lock, CreditCard as CardIcon } from 'lucide-react';

const Checkout: React.FC = () => {
  const { state, setUser, setActiveTab } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de processamento de pagamento (SaaS style)
    setTimeout(() => {
      if(state.user) {
        setUser({ ...state.user, isPremium: true });
        setLoading(false);
        setActiveTab('dashboard');
        alert("PAGAMENTO APROVADO! Bem-vindo ao time Premium.");
      }
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-md mx-auto">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('premium')}
          className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold uppercase tracking-widest italic">Checkout</h1>
        <div className="w-10"></div>
      </header>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CardIcon size={120} />
        </div>

        <form onSubmit={handlePayment} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Número do Cartão</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                value={formData.number}
                onChange={e => setFormData({...formData, number: e.target.value})}
              />
              <CreditCard className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nome no Cartão</label>
            <input 
              type="text" 
              placeholder="NOME IGUAL AO CARTÃO"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none uppercase font-bold"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Validade</label>
              <input 
                type="text" 
                placeholder="MM/AA"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none text-center font-bold"
                value={formData.expiry}
                onChange={e => setFormData({...formData, expiry: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">CVC</label>
              <input 
                type="password" 
                placeholder="***"
                required
                maxLength={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none text-center font-bold"
                value={formData.cvc}
                onChange={e => setFormData({...formData, cvc: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-slate-950 py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <>PAGAR COM SEGURANÇA</>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col items-center gap-4 text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Ambiente 100% Seguro</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock size={16} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Criptografia de ponta a ponta</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
