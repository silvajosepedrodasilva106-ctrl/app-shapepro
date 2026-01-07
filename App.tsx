
import React, { useState, useEffect, createContext, useContext } from 'react';
import { UserProfile, AIPersonalPlan, ProgressEntry, AppState, Goal, Level, Location } from './types';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Meals from './pages/Meals';
import Profile from './pages/Profile';
import Premium from './pages/Premium';
import Checkout from './pages/Checkout';
import Navbar from './components/Navbar';

interface AppContextType {
  state: AppState;
  setUser: (user: UserProfile) => void;
  setPlan: (plan: AIPersonalPlan) => void;
  addProgress: (weight: number) => void;
  completeWorkout: (date?: string) => void;
  toggleWorkoutDate: (date: string) => void;
  logout: () => void;
  setActiveTab: (tab: string) => void;
  isAccessAllowed: () => boolean;
  getRemainingTrialDays: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const TRIAL_DAYS = 3;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('shapepro_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Falha ao carregar estado salvo:", e);
    }
    
    return {
      user: null,
      plan: null,
      progress: [],
      workoutLog: [],
      streak: 0,
      points: 0
    };
  });

  const [isOnboarding, setIsOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('shapepro_state', JSON.stringify(state));
  }, [state]);

  const setUser = (user: UserProfile) => setState(prev => ({ ...prev, user }));
  const setPlan = (plan: AIPersonalPlan) => setState(prev => ({ ...prev, plan }));
  
  const addProgress = (weight: number) => {
    const weightVal = Number(weight);
    if (isNaN(weightVal)) return;

    setState(prev => {
      const today = new Date().toISOString().split('T')[0];
      const newEntry: ProgressEntry = {
        date: today,
        weight: weightVal,
        workoutsCompleted: prev.progress.length > 0 ? prev.progress[prev.progress.length - 1].workoutsCompleted : 0
      };
      
      const lastEntry = prev.progress[prev.progress.length - 1];
      const updatedProgress = lastEntry && lastEntry.date === today 
        ? [...prev.progress.slice(0, -1), newEntry]
        : [...prev.progress, newEntry];

      return {
        ...prev,
        user: prev.user ? { ...prev.user, weight: weightVal } : null,
        progress: updatedProgress,
        points: prev.points + 10
      };
    });
  };

  const completeWorkout = (date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    setState(prev => {
      if (prev.workoutLog.includes(targetDate)) return prev;

      const newLog = [...prev.workoutLog, targetDate];
      return {
        ...prev,
        workoutLog: newLog,
        streak: prev.streak + 1,
        points: prev.points + 50,
      };
    });
  };

  const toggleWorkoutDate = (date: string) => {
    setState(prev => {
      const isDone = prev.workoutLog.includes(date);
      const newLog = isDone 
        ? prev.workoutLog.filter(d => d !== date)
        : [...prev.workoutLog, date];
      
      return {
        ...prev,
        workoutLog: newLog,
        streak: isDone ? Math.max(0, prev.streak - 1) : prev.streak + 1,
        points: isDone ? Math.max(0, prev.points - 50) : prev.points + 50
      };
    });
  };

  const logout = () => {
    setState({ user: null, plan: null, progress: [], workoutLog: [], streak: 0, points: 0 });
    setIsOnboarding(false);
    setActiveTab('dashboard');
    localStorage.removeItem('shapepro_state');
  };

  const getRemainingTrialDays = () => {
    if (!state.user || state.user.isPremium) return TRIAL_DAYS;
    const created = new Date(state.user.createdAt).getTime();
    const now = new Date().getTime();
    const diff = now - created;
    const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, TRIAL_DAYS - daysPassed);
  };

  const isAccessAllowed = () => {
    if (!state.user) return false;
    if (state.user.isPremium) return true;
    return getRemainingTrialDays() > 0;
  };

  const handleTabChange = (tab: string) => {
    const restrictedTabs = ['workouts', 'meals'];
    if (restrictedTabs.includes(tab) && !isAccessAllowed()) {
      setActiveTab('premium');
    } else {
      setActiveTab(tab);
    }
  };

  if (!state.user && !isOnboarding) {
    return <Landing onStart={() => setIsOnboarding(true)} />;
  }

  if (isOnboarding || (state.user && !state.plan)) {
    return (
      <AppContext.Provider value={{ state, setUser, setPlan, addProgress, completeWorkout, toggleWorkoutDate, logout, setActiveTab: handleTabChange, isAccessAllowed, getRemainingTrialDays }}>
        <Onboarding onComplete={() => {
          setIsOnboarding(false);
          setActiveTab('dashboard');
        }} />
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={{ state, setUser, setPlan, addProgress, completeWorkout, toggleWorkoutDate, logout, setActiveTab: handleTabChange, isAccessAllowed, getRemainingTrialDays }}>
      <div className="flex flex-col min-h-screen pb-24 bg-slate-950">
        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full animate-fadeIn">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'workouts' && <Workouts />}
          {activeTab === 'meals' && <Meals />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'premium' && <Premium />}
          {activeTab === 'checkout' && <Checkout />}
        </main>
        {activeTab !== 'checkout' && <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />}
      </div>
    </AppContext.Provider>
  );
};

export default App;
