import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-configs',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './user-configs.component.html',
  styleUrl: './user-configs.component.scss'
})
export class UserConfigsComponent {
}
