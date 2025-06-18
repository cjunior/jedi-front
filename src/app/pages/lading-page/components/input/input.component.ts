import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() config: {
    label?: string;
    placeholder?: string;
    id?: string;
    type?: string;
    name?: string;
  } = {
    label: '',
    placeholder: '',
    id: '',
    type: 'text',
    name: ''
  };
 
}
