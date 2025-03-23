// Defines the structure of a subtask
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

// Defines the structure of a goal with subtasks
export interface Goal {
  id?: string;
  title: string;
  description: string;
  deadline?: string;
  progress: number;
  subtasks: Subtask[];
}

// Calculate progress based on completed subtasks
export function calculateProgress(subtasks: Subtask[]): number {
  if (!subtasks || subtasks.length === 0) return 0;
  
  const completedCount = subtasks.filter(task => task.completed).length;
  return Math.round((completedCount / subtasks.length) * 100);
}

// Generate a unique ID for new subtasks
export function generateId(): string {
  return `st-${Math.random().toString(36).substring(2, 10)}`;
}
