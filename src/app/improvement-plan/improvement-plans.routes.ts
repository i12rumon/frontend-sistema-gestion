import { Routes } from '@angular/router';
import { ListPlansComponent } from './pages/list-plans/list-plans.component';
import { CreatePlanComponent } from './pages/create-plan/create-plan.component';
import { PlanInfoComponent } from './pages/plan-info/plan-info.component';
import { roleGuard } from '../shared/guards/role.guard';
export const improvementPlansRoutes: Routes = [
  {
    path: '',
    component: ListPlansComponent,
    canActivate: [roleGuard],
    data: {roles: ['RESPONSABLE', 'QUALITY']}
  },
  {
    path: 'new',
    component: CreatePlanComponent,
    canActivate: [roleGuard],
    data: {roles: ['RESPONSABLE']}
  },
  {
    path: 'edit/:id',
    component: CreatePlanComponent,
    canActivate: [roleGuard],
    data: {roles: ['RESPONSABLE']}
  },
  {
    path: ':id',
    component: PlanInfoComponent,
    canActivate: [roleGuard],
    data: {roles: ['RESPONSABLE', 'QUALITY']}
  },

];
export default improvementPlansRoutes;
