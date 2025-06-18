import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-configs',
  imports: [RouterOutlet, RouterLink,  RouterLinkActive, AvatarModule, Popover, ButtonModule],
  templateUrl: './user-configs.component.html',
  styleUrl: './user-configs.component.scss'
})
export class UserConfigsComponent {
  private readonly authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
