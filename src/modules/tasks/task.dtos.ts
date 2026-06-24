export interface CreateTaskDTO {
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
}

export interface UpdateTaskDTO {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}

export interface AssignTaskDTO {
  id: string;
  assignedTo: string;
}

export interface UpdateStatusDTO {
  id: string;
  status: string;
}