import { Routes } from '@angular/router';
import { UserConfigsComponent } from './user-configs.component';

export const userConfigsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'pre-cadastros',
    pathMatch: 'full'
  },
  {
    path: '',
    component: UserConfigsComponent,
    children: [
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
];
