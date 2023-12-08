import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lab.component.html',
  styleUrl: './lab.component.css',
})
export class LabComponent {
  welcome = 'Subtitulo';
  tasks = ['Primera', 'Segunda', 'Tercera'];

  person = signal({
    name: 'Matias',
    age: 30,
    avatar:
      'https://gravatar.com/avatar/67785b3e27c60c7ab09c94a8674104dd?s=400&d=robohash&r=x',
  });

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50, { nonNullable: true });
  nameCtrl = new FormControl('Matias', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  constructor() {
    this.colorCtrl.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  clickHandler() {
    alert('Hola');
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person().name = newValue;
    console.log(event);
  }

  keyDownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }

  changeAgeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person().age = parseInt(newValue, 10);
  }
}
