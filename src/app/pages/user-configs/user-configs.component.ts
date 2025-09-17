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

  sidebarOpen = false;

  logout() {
    this.authService.logout();
  }

  canManagePreRegistrations(): boolean {
    return this.authService.hasRole(['ROLE_ADMIN', 'ROLE_GERENTE']);
  }

  canManageCicles(): boolean {
    return this.authService.hasRole(['ROLE_ADMIN']);
  }

  canManageBlog(): boolean {
    return this.authService.hasRole(['ROLE_ADMIN', 'ROLE_GERENTE', 'ROLE_BLOG']);
  }

  canManageUsers(): boolean {
    return this.authService.hasRole(['ROLE_ADMIN']);
  }

  getUserName(): string {
    const name = this.authService.getUserName();
    return name ?? this.getUserDisplayName();
  }

  getUserPhoto(): string | null {
    return this.authService.getUserPhoto();
  }

  getUserEmail(): string | null {
    return this.authService.getUserEmail();
  }

  getUserInitials(): string {
    const name = this.getUserName();
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getUserDisplayName(): string {
    const role = this.authService.getUserRole();
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Admin';
      case 'ROLE_GERENTE':
        return 'Gerente';
      case 'ROLE_BLOG':
        return 'Editor';
      default:
        return 'Usuário';
    }
  }
}
