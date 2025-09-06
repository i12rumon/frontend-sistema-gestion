import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user/userLayout.component';
import { NotFoundComponent } from '../shared/pages/not-found/not-found.component';
import { AdministratorHomeComponent } from './pages/home/administrator-home/administrator-home.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children:[

      {
        path:'',
        component: AdministratorHomeComponent
      },
      {
        path:'**',
        component: NotFoundComponent
      }
    ]
  }

];
export default userRoutes;
