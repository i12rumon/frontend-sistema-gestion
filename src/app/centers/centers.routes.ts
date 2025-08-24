import { Routes } from '@angular/router';
import { ListCentersComponent } from './pages/list-centers/list-centers.component';
import { CreateCenterComponent } from './pages/create-center/create-center.component';

export const centerRoutes: Routes = [
  {
    path: '',
    component: ListCentersComponent,
  },
  {
    path: 'create-center',
    component: CreateCenterComponent
  },
  {
    path: 'edit-center/:degree_id',
    component: CreateCenterComponent
  },

];
export default centerRoutes;
