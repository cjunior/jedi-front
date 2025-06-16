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
      },
      {
        path: 'edit-landing-page',
        loadComponent: () => import('./admin/manage-edit-text-landing-page/manage-edit-landing-page.component').then(m => m.ManageEditLandingPageComponent)
      },
      {
        path: 'edit-landing-page2',
        loadComponent: () => import('./admin/edit/edit.component').then(m => m.AdminDashboardComponent)
      }
    ]
  }
]
