import { Routes } from '@angular/router';
import { HomeComponent } from './shared/pages/home/home.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { AboutUsComponent } from './shared/pages/about-us/about-us.component';
import { ProfilePageComponent } from './user/pages/profile-page/profile-page.component';
import { roleGuard } from './shared/guards/role.guard';
import { ModifyProfileComponent } from './user/pages/modify-profile/modify-profile.component';
import { guestGuard } from './shared/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },
  {
    path: 'login',
    component : LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'admin',
    loadChildren: ()=> import('./admin/admin.routes'),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN']}
  },
  {
    path: 'service',
    loadChildren: ()=> import('./quality_service/quality_service.routes'),
    canActivate: [roleGuard],
    data: {roles: ['QUALITY']}
  },
  {
    path: 'responsable',
    loadChildren: ()=> import('./responsable/responsable.routes'),
    canActivate: [roleGuard],
    data: {roles: ['RESPONSABLE']}
  },
  {
    path: 'centers',
    loadChildren: ()=> import('./centers/centers.routes'),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN']}
  },
  {
    path: 'users',
    loadChildren: ()=> import('./user/users.routes'),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN']}
  },
  {
    path: 'financing',
    loadChildren: ()=> import('./financing_requests/financing.routes'),
    canActivate: [roleGuard],
    data: {roles: ['RESPONSABLE','QUALITY']}
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [roleGuard],
    data: {roles: ['ADMIN','RESPONSABLE','QUALITY']}
  },
  {
    path: 'modify-profile',
    component: ModifyProfileComponent,
    canActivate: [roleGuard],
    data: {roles: ['ADMIN','RESPONSABLE','QUALITY']}
  },
  {
    path: 'plans',
    loadChildren: ()=> import('./improvement-plan/improvement-plans.routes'),
    canActivate: [roleGuard],
    data: {roles: ['RESPONSABLE']}
  },
  {
    path: 'academic-years',
    loadChildren: ()=> import('./academic_year/academic-year.routes'),
    canActivate: [roleGuard],
    data: {roles: ['ADMIN']}
  },
  {
    path: 'calls-for-proposals',
    loadChildren: () => import('./calls_for_proposals/calls.routes'),
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];
