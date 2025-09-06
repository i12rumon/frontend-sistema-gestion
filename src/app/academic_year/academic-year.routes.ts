import { Routes } from '@angular/router';
import { ListAcademicYearComponent } from './pages/list-academic-year/list-academic-year.component';
import { CreateAcademicYearComponent } from './pages/create-academic-year/create-academic-year.component';
export const yearRoutes: Routes = [
  {
    path: '',
    component: ListAcademicYearComponent,
  },
  {
    path: 'new',
    component: CreateAcademicYearComponent,
  }
];
export default yearRoutes;
