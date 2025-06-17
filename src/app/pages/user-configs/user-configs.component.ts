import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-configs',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user-configs.component.html',
  styleUrl: './user-configs.component.scss'
})
export class UserConfigsComponent {
}
