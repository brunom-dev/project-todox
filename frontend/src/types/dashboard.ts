export interface DashboardOverview {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  weeklyCompletedTasks: number;
}

export interface TaskByCategory {
  categoryId: string;
  name: string;
  color: string | null;
  count: number;
}

export interface GoalProgress {
  id: string;
  title: string;
  progress: number;
}

export interface DashboardInsightsResponse {
  overview: DashboardOverview;
  tasksByCategory: TaskByCategory[];
  goalsProgress: GoalProgress[];
}
