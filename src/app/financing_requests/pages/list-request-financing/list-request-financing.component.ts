import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RequestService } from '../../service/request.service';
import { FinancingRequestUserResponse } from '../../interfaces/financing-request.interface';
import { CurrencyPipe, NgClass } from '@angular/common';
import { UserService } from '../../../user/services/user.service';
import { ImprovementPlansService } from '../../../improvement-plan/services/improvement-plans.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-request-financing',
  imports: [NgClass, CurrencyPipe],
  templateUrl: './list-request-financing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListRequestFinancingComponent {

  requestService = inject(RequestService);
  requests = signal<FinancingRequestUserResponse|null>(null);
  userService = inject(UserService);
  planService = inject(ImprovementPlansService);
  router = inject(Router);

  ngOnInit(){
    this.requestService.viewRequests().subscribe({
      next : (requests) =>{
        this.requests.set(requests);
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
}
