import { Component } from '@angular/core';
import { InputComponent } from "../input/input.component";

@Component({
  selector: 'app-form',
  imports: [InputComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

}
