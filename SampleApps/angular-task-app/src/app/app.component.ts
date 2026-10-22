import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TaskListComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>Task Management Application</h1>
      </header>
      <main>
        <app-task-list></app-task-list>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      background-color: #2c3e50;
      color: white;
      padding: 1.5rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    header h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    main {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
  `]
})
export class AppComponent {
  title = 'angular-task-app';
}
