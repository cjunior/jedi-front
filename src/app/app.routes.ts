import { Routes } from '@angular/router';
import { userConfigsRoutes } from './pages/user-configs/user-configs.routes';
import { authGuard } from './core/guards/auth.guard';

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
      path: 'configuracoes',
      children: userConfigsRoutes,
      canActivate: [authGuard]
    }
];
