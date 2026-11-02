import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus } from '../../models/task.model';

/**
 * Component for displaying a list of tasks.
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error: string | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * Load all tasks from the API.
   */
  loadTasks(): void {
    this.loading = true;
    this.error = null;

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (err) => this.handleError('Failed to load tasks', err, true)
    });
  }

  /**
   * Delete a task.
   */
  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.id !== id);
        },
        error: (err) => this.handleError('Failed to delete task', err)
      });
    }
  }

  private handleError(message: string, error: any, stopLoading = false): void {
    this.error = message;
    if (stopLoading) {
      this.loading = false;
    }
    console.error(`${message}:`, error);
  }

  /**
   * Get CSS class based on task status.
   */
  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'status-completed';
      case TaskStatus.IN_PROGRESS:
        return 'status-in-progress';
      case TaskStatus.FAILED:
        return 'status-failed';
      default:
        return 'status-pending';
    }
  }
}
