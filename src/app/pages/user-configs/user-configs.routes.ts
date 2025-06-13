import { Routes } from '@angular/router';
import { UserConfigsComponent } from './user-configs.component';

export const userConfigsRoutes: Routes = [
  {
    path: '',
    component: UserConfigsComponent,
    children: [
      {
        path: 'pagina-informativa',
        loadComponent: () => import('./admin/manage-landing-page/manage-landing-page.component').then(m => m.ManageLandingPageComponent)
      }
    ]
  }
]
