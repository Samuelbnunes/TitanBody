
export enum ExperienceLevel {
  BEGINNER = 'Iniciante',
  INTERMEDIATE = 'Intermediário',
  ADVANCED = 'Avançado',
  PRO = 'Profissional'
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  weight: number;
  restTime: string;
  notes?: string;
  completed?: boolean;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  dayOfWeek?: number; // 0-6
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  experience: ExperienceLevel;
  daysPerWeek: number;
  focusArea: string;
  gender: 'M' | 'F' | 'O';
}

export interface TrainingPlan {
  id: string;
  createdAt: string;
  workouts: Workout[];
  methodology: string;
}

export interface WorkoutHistory {
  date: string; // ISO string
  workoutId: string;
  workoutName: string;
}

export interface AppData {
  profile: UserProfile | null;
  currentPlan: TrainingPlan | null;
  history: WorkoutHistory[];
  lastWorkoutIndex: number;
}
