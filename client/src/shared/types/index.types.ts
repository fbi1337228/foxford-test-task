export interface Task {
  id: string;
  title: string;
  description: string;
  authorId: string;
  executorId: string;
}

export type CreateTaskData = Pick<Task, "title" | "description">;

export interface UserData {
  email: string;
  password: string
}