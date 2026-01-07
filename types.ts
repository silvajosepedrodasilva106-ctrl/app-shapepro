
export enum Goal {
  LOSE_WEIGHT = 'Emagrecer',
  GAIN_MUSCLE = 'Ganhar Massa',
  MAINTAIN = 'Manter Peso'
}

export enum Level {
  BEGINNER = 'Iniciante',
  INTERMEDIATE = 'Intermediário',
  ADVANCED = 'Avançado'
}

export enum Location {
  HOME = 'Casa',
  GYM = 'Academia'
}

export interface UserProfile {
  name: string;
  age: number;
  sex: 'Masculino' | 'Feminino';
  weight: number;
  height: number;
  goal: Goal;
  level: Level;
  location: Location;
  daysPerWeek: number;
  isPremium: boolean;
  createdAt: string; // ISO date string
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  description: string;
}

export interface WorkoutDay {
  title: string;
  exercises: Exercise[];
}

export interface Meal {
  time: string;
  title: string;
  items: string[];
  calories: number;
}

export interface AIPersonalPlan {
  workouts: WorkoutDay[];
  meals: Meal[];
  totalDailyCalories: number;
}

export interface ProgressEntry {
  date: string;
  weight: number;
  workoutsCompleted: number;
}

export interface AppState {
  user: UserProfile | null;
  plan: AIPersonalPlan | null;
  progress: ProgressEntry[];
  workoutLog: string[]; // Array de datas ISO (YYYY-MM-DD) concluídas
  streak: number;
  points: number;
}
