import { Routes } from '@angular/router';
import { userConfigsRoutes } from './pages/user-configs/user-configs.routes';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/lading-page/lading-page.component').then(m => m.LadingPageComponent)
    },
    {
      path: 'configuracoes',
      children: userConfigsRoutes
    }
];
