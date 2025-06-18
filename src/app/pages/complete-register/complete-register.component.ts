import { Component } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-complete-register',
  imports: [PanelModule, FloatLabel, InputTextModule],
  templateUrl: './complete-register.component.html',
  styleUrl: './complete-register.component.scss'
})
export class CompleteRegisterComponent {

}
