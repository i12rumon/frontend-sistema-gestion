import { Routes } from '@angular/router';
import { ListPlansComponent } from './pages/list-plans/list-plans.component';
import { CreatePlanComponent } from './pages/create-plan/create-plan.component';
import { PlanInfoComponent } from './pages/plan-info/plan-info.component';
export const improvementPlansRoutes: Routes = [
  {
    path: '',
    component: ListPlansComponent,
  },
  {
    path: 'new',
    component: CreatePlanComponent
  },
  {
    path: ':id',
    component: PlanInfoComponent,
  },

];
export default improvementPlansRoutes;
