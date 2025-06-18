import { Routes } from '@angular/router';
import { userConfigsRoutes } from './pages/user-configs/user-configs.routes';
import { authGuard } from './core/guards/auth.guard';
import { preRegistrationGuard } from './core/guards/pre-registration.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/lading-page/lading-page.component').then(m => m.LadingPageComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login/login.component').then(m => m.LoginComponent),
        canActivate: [() => import('./core/guards/login.guard').then(m => m.loginGuard)]
    },
    {
      path: 'pre-inscricao/continuar/:token',
      loadComponent: () => import('./pages/complete-register/complete-register.component').then(m => m.CompleteRegisterComponent),
      canActivate: [preRegistrationGuard]
    },
    {
      path: 'configuracoes',
      children: userConfigsRoutes,
      canActivate: [authGuard]
    }
];
