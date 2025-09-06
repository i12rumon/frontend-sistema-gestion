import { Routes } from '@angular/router';
import { CreateUserComponent } from '../admin/pages/create-user/create-user.component';
import { ListUsersComponent } from '../admin/pages/list-users/list-users.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { InfoUserComponent } from './pages/info-user/info-user.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: ListUsersComponent,
  },
  {
    path: 'new',
    component: CreateUserComponent
  },
  {
    path: 'edit/:user_id',
    component: CreateUserComponent
  },
  {
    path: ':user_id',
    component: InfoUserComponent
  },


];
export default userRoutes;
