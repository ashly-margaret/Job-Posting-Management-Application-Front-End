import { Job, CreateJobInput, UpdateJobInput } from "@/types/job";

/**
 * Direct NestJS Backend API URL (http://localhost:5000)
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_NEST_API_URL || "http://localhost:5000";

const getBaseUrl = (): string => API_BASE_URL;

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Fetch all job postings
 */
export async function fetchJobs(): Promise<Job[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/jobs`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(
      errorBody.message || `Failed to fetch jobs (${res.status})`,
      res.status,
      errorBody
    );
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}


/**
 * Fetch a single job posting by ID
 */
export async function fetchJobById(id: number): Promise<Job> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/jobs/${id}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(
      errorBody.message || `Failed to fetch job with ID ${id} (${res.status})`,
      res.status,
      errorBody
    );
  }

  return await res.json();
}

/**
 * Create a new job posting
 */
export async function createJob(input: CreateJobInput): Promise<Job> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => ({}))) as {
      message?: string | string[];
    };
    const message = Array.isArray(errorBody.message)
      ? errorBody.message.join(", ")
      : errorBody.message || `Failed to create job (${res.status})`;
    throw new ApiError(message, res.status, errorBody);
  }

  return await res.json();
}

/**
 * Update an existing job (supports partial updates)
 */
export async function updateJob(
  id: number,
  input: UpdateJobInput
): Promise<Job> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/jobs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => ({}))) as {
      message?: string | string[];
    };
    const message = Array.isArray(errorBody.message)
      ? errorBody.message.join(", ")
      : errorBody.message || `Failed to update job (${res.status})`;
    throw new ApiError(message, res.status, errorBody);
  }

  return await res.json();
}

/**
 * Delete a job by ID
 */
export async function deleteJob(id: number): Promise<{ success: boolean; message?: string }> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/jobs/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(
      errorBody.message || `Failed to delete job (${res.status})`,
      res.status,
      errorBody
    );
  }

  const data = await res.json().catch(() => ({}));
  return { success: true, ...data };
}
