import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  tasks = signal<Task[]>([
    {
      id: Date.now(),
      title:'Crear proyecto',
      completed: false
    }]);

  ChangeHandler(event: Event){
    const input = event.target as HTMLInputElement;
    const newTask = input.value;
    this.AddTask(newTask);
  }

  DeleteTask(index: number){
    this.tasks.update((tasks)=> tasks.filter((task,position) => position !== index));
  }
  
  AddTask(task: string){

    const newTask = {
      id: Date.now(),
      title: task,
      completed: false
    }

    this.tasks.update((tasks) => [...tasks,newTask]);
  }

  UpdateTask(index: number){
    this.tasks.update((tasks)=>{
      return tasks.map((task,position)=>{
        if(position == index){
          return{
            ...task,
            completed: !task.completed
          }
        }
        return task;
      });
    });
  }

}