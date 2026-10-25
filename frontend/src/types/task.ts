export interface Category {
  id: string;
  name: string;
  color: string | null;
}

export interface Goal {
  id: string;
  title: string;
  description?: string | null;
  deadline?: string | null;
  tasks?: Task[];
  createdAt?: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null;
  userId: string;
  categoryId?: string | null;
  goalId?: string | null;
  category?: Category | null;
  goal?: Goal | null;
  createdAt: string;
}

export interface TaskAlertsResponse {
  overdue: Task[];
  upcoming: Task[];
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
  categoryId?: string | null;
  goalId?: string | null;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;
