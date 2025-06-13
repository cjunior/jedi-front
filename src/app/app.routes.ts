import { Routes } from '@angular/router';
import { userConfigsRoutes } from './pages/user-configs/user-configs.routes';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/lading-page/lading-page.component').then(m => m.LadingPageComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login/login.component').then(m => m.LoginComponent)
    },
    {
      path: 'configuracoes',
      children: userConfigsRoutes
    }
];
