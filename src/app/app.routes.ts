import { Routes } from '@angular/router';
import { userConfigsRoutes } from './pages/user-configs/user-configs.routes';
import { authGuard } from './core/guards/auth.guard';
import { preRegistrationGuard } from './core/guards/pre-registration.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/lading-page/lading-page.component').then(m => m.LadingPageComponent)
    },
    {
      path: 'noticias',
      children: [
        {
          path: '',
          loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent)
        },
        {
          path: ':id',
          loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent)
        }
      ]
    },
    {
      path: 'resultados',
      children: [
        {
          path: '',
          redirectTo: 'fortaleza',
          pathMatch: 'full'
        },
        {
          path: 'fortaleza',
          loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent)
        }
      ]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login/login.component').then(m => m.LoginComponent),
        canActivate: [loginGuard]
    },
    {
      path: 'recuperar-senha',
      loadComponent: () => import('./pages/login/recuperar-senha/recuperar-senha.component').then(m => m.RecuperarSenhaComponent),
      canActivate: [loginGuard]
  },
  {
    path: 'auth/:token',
    loadComponent: () => import('./pages/login/recuperar-email-senha/recuperar-email-senha.component').then(m => m.RecuperarEmailSenhaComponent)
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