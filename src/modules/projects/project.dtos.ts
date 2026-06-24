export interface CreateProjectDto {
  title: string;
  description: string;
}

export interface UpdateProjectDto {
  id: string;
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}