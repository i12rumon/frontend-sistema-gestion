import { Routes } from '@angular/router';
import { ListRequestFinancingComponent } from './pages/list-request-financing/list-request-financing.component';
import { CreateRequestComponent } from './pages/create-request/create-request.component';
import { roleGuard } from '../shared/guards/role.guard';
import { AddReceiptPaymentComponent } from './pages/add_receipt_payment/add_receipt_payment.component';


export const financingRoutes: Routes = [
  {
    path: 'responsable',
    component: ListRequestFinancingComponent,
    canActivate: [roleGuard],
    data: {roles: ['RESPONSABLE']}
  },
  {
    path: 'quality',
    component: ListRequestFinancingComponent,
    canActivate: [roleGuard],
    data: {roles: ['QUALITY']}
  },
  {
      path: ':id/request',
      component: CreateRequestComponent,
      canActivate: [roleGuard],
      data: {roles: ['RESPONSABLE']}
  },
  {
    path: ':id/financing_pdf',
    component: AddReceiptPaymentComponent,
    canActivate: [roleGuard],
    data: {roles: ['RESPONSABLE']}
  }


];
export default financingRoutes;
