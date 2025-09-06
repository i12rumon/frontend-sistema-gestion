import { Routes } from '@angular/router';
import { ListCallsComponent } from './pages/list-calls/list-calls.component';
import { CreateCallForProposalsComponent } from './pages/create-call-for-proposals/create-call-for-proposals.component';
import { ModifyCallsComponent } from './pages/modify-calls/modify-calls.component';
import { roleGuard } from '../shared/guards/role.guard';



export const responsableRoutes: Routes = [
  {
    path: '',
    component: ListCallsComponent,
  },
  {
    path: 'create',
    component: CreateCallForProposalsComponent,
    canActivate: [roleGuard],
    data: {roles: ['QUALITY']}
  },
  {
    path: 'edit/:id',
    component: ModifyCallsComponent,
    canActivate: [roleGuard],
    data: {roles: ['QUALITY']}
  }

];
export default responsableRoutes;
