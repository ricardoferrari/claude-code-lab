import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';

/**
 * Service for managing tasks.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private endpoint = 'tasks';

  constructor(private api: ApiService) {}

  /**
   * Get all tasks.
   */
  getTasks(): Observable<Task[]> {
    return this.api.get<Task[]>(this.endpoint);
  }

  /**
   * Get a single task by ID.
   */
  getTask(id: number): Observable<Task> {
    return this.api.get<Task>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new task.
   */
  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.api.post<Task>(this.endpoint, request);
  }

  /**
   * Update an existing task.
   */
  updateTask(id: number, request: UpdateTaskRequest): Observable<Task> {
    return this.api.put<Task>(`${this.endpoint}/${id}`, request);
  }

  /**
   * Delete a task.
   */
  deleteTask(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
