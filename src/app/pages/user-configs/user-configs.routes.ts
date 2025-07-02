import { Routes, Router } from '@angular/router';
import { UserConfigsComponent } from './user-configs.component';
import { adminGuard, managerGuard, blogGuard } from '../../core/guards/role.guard';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

// Função para redirecionamento baseado na role
const redirectBasedOnRole = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userRole = authService.getUserRole();
  
  switch (userRole) {
    case 'ROLE_ADMIN':
    case 'ROLE_GERENTE':
      return router.parseUrl('/configuracoes/pre-cadastros');
    case 'ROLE_BLOG':
      return router.parseUrl('/configuracoes/gerenciar-blog');
    default:
      return router.parseUrl('/login');
  }
};

export const userConfigsRoutes: Routes = [
  {
    path: '',
    canMatch: [() => {
      const authService = inject(AuthService);
      return authService.isLoggedIn();
    }],
    redirectTo: () => {
      return redirectBasedOnRole().toString().replace('/configuracoes/', '');
    },
    pathMatch: 'full'
  },
  {
    path: '',
    component: UserConfigsComponent,
    children: [
      {
        path: 'pre-cadastros',
        loadComponent: () => import('./admin/manage-pre-registrations/manage-pre-registrations.component').then(m => m.ManagePreRegistrationsComponent),
        canActivate: [managerGuard]
      },
      {
        path: 'gerenciar-blog',
        loadComponent: () => import('./admin/manage-blog/manage-blog.component').then(m => m.ManageBlogComponent),
        canActivate: [blogGuard]
      },
      {
        path: 'gerenciar-usuarios',
        loadComponent: () => import('./admin/manager-register/manager-register.component').then(m => m.ManagerRegisterComponent),
        canActivate: [adminGuard]
      }
    ]
  }
];
