import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RequestService } from '../../service/request.service';
import { FinancingRequestUser, FinancingRequestUserResponse } from '../../interfaces/financing-request.interface';
import { CurrencyPipe, NgClass } from '@angular/common';
import { UserService } from '../../../user/services/user.service';
import { ImprovementPlansService } from '../../../improvement-plan/services/improvement-plans.service';
import { Router } from '@angular/router';
import { UserItem } from '../../../shared/interfaces/user-item.interface';


@Component({
  selector: 'app-list-request-financing',
  imports: [NgClass, CurrencyPipe],
  templateUrl: './list-request-financing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListRequestFinancingComponent {

  requestService = inject(RequestService);
  message = signal<string>('');
  requestsArray = signal<FinancingRequestUser[]|null>(null)
  userService = inject(UserService);
  planService = inject(ImprovementPlansService);
  router = inject(Router);
  user = signal <UserItem|null>(null);

  ngOnInit(){

    this.userService.getProfileUser().subscribe({
      next : (user) =>{
        this.user.set(user);
      }
    })

    this.requestService.viewRequests().subscribe({
      next : (requests) =>{
        if(this.user()?.role_id===2){
          this.requestsArray.set(requests.requests);
          if(requests.Message!==undefined){
            this.message.set(requests.Message)
          }
        }
        if(this.user()?.role_id===3){
          this.requestsArray.set(requests.requests.filter((request) => request.user_id === this.user()?.user_id));
        }

      }
    })
  }

  addRequest(id: number){
    this.router.navigateByUrl(`/financing/${id}/financing_pdf`);
  }

  downloadRequest(id: number){
    this.requestService.downloadPaymentReceipt(id).subscribe({
      next: (blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financing_${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el PDF:', err);
      }
    })
  }

  changeStatusRequest(id: number, status: string){
    this.requestService.changeStatusRequest(id, status).subscribe({
    next: (res) => {
      if(res.message){
        alert(res.message);
      }
    },
    error: (err) => {
      alert(err.error?.Error || 'Ocurrió un error inesperado');
    }
  });
  }

}
