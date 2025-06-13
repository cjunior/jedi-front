import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/lading-page/lading-page.component').then(m => m.LadingPageComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login/login.component').then(m => m.LoginComponent)
    }
];
