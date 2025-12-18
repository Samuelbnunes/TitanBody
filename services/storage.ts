
import { AppData, UserProfile, TrainingPlan, WorkoutHistory } from '../types';

const STORAGE_KEY = 'titanbody_data_v1';

const defaultData: AppData = {
  profile: null,
  currentPlan: null,
  history: [],
  lastWorkoutIndex: -1
};

export const storageService = {
  getData: (): AppData => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultData;
  },

  saveData: (data: AppData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  saveProfile: (profile: UserProfile) => {
    const data = storageService.getData();
    data.profile = profile;
    storageService.saveData(data);
  },

  savePlan: (plan: TrainingPlan) => {
    const data = storageService.getData();
    data.currentPlan = plan;
    data.lastWorkoutIndex = -1; // Reset progress on new plan
    storageService.saveData(data);
  },

  completeWorkout: (workoutId: string, workoutName: string) => {
    const data = storageService.getData();
    const historyItem: WorkoutHistory = {
      date: new Date().toISOString(),
      workoutId,
      workoutName
    };
    data.history.push(historyItem);
    
    // Update next workout index
    if (data.currentPlan) {
      const index = data.currentPlan.workouts.findIndex(w => w.id === workoutId);
      data.lastWorkoutIndex = index;
    }
    
    storageService.saveData(data);
  },

  updateWorkout: (workout: any) => {
    const data = storageService.getData();
    if (data.currentPlan) {
      data.currentPlan.workouts = data.currentPlan.workouts.map(w => 
        w.id === workout.id ? workout : w
      );
      storageService.saveData(data);
    }
  }
};
