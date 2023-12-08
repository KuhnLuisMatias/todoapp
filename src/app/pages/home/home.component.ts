import {
  Component,
  Injector,
  computed,
  effect,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tasks = signal<Task[]>([
    {
      id: Date.now(),
      title: 'Crear proyecto',
      completed: false,
    },
  ]);

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasksLocalStorage = JSON.parse(storage);
      this.tasks.set(tasksLocalStorage);
    }
    this.TrackTasks();
  }

  TrackTasks() {
    effect(
      () => {
        const tasks = this.tasks();
        console.log(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      },
      {
        injector: this.injector,
      }
    );
  }

  injector = inject(Injector);
  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    let tasks = this.tasks();
    switch (filter) {
      case 'pending':
        tasks = tasks.filter((task) => !task.completed);
        break;

      case 'completed':
        tasks = tasks.filter((task) => task.completed);
        break;

      default:
        tasks = tasks;
        break;
    }
    return tasks;
  });

  ChangeHandler() {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value;
      this.AddTask(value);
      this.newTaskCtrl.setValue('');
    }
  }

  DeleteTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.filter((task, position) => position !== index)
    );
  }

  AddTask(task: string) {
    const newTask = {
      id: Date.now(),
      title: task,
      completed: false,
    };

    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  UpdateTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position == index) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    });
  }

  UpdateTaskEditingMode(index: number) {
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) return { ...task, editing: true };
        return { ...task, editing: false };
      });
    });
  }

  UpdateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return { ...task, title: input.value, editing: false };
        }
        return task;
      });
    });
  }

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^\S*$/)],
  });

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }
}
