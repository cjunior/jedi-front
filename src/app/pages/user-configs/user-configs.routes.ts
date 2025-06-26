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
        path: 'edit-landing-page2',
        loadComponent: () => import('./admin/edit/edit.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'pre-cadastros',
        loadComponent: () => import('./admin/manage-pre-registrations/manage-pre-registrations.component').then(m => m.ManagePreRegistrationsComponent)
      },
      {
        path: 'gerenciar-blog',
        loadComponent: () => import('./admin/manage-blog/manage-blog.component').then(m => m.ManageBlogComponent)
      }
    ]
  }
]
