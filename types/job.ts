export type JobType = 'full-time' | 'part-time' | 'contract';

export interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;
  type: JobType;
  createdAt: string;
}

export interface CreateJobInput {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;
  type: JobType;
}

export type UpdateJobInput = Partial<CreateJobInput>;
