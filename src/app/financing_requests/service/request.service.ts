import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CallsMessageResponse } from '../../shared/interfaces/call-messages-response';
import { FinancingRequestUserResponse } from '../interfaces/financing-request.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private http = inject(HttpClient);

  createRequest(planId: string, payload:any, userId: number) : Observable<CallsMessageResponse>{
    return this.http.post<CallsMessageResponse>(`${environment.baseUrl}/financing-requests/${planId}`,
      {
        "detailsFinancing": payload.detailsFinancing,
        "estimatedDate": payload.estimatedDate,
        "solicitedAmount": payload.solicitedAmount,
        "user_id": userId,
        "action_id": payload.action
      });
  }

  viewRequests() : Observable<FinancingRequestUserResponse>{
    return this.http.get<FinancingRequestUserResponse>(`${environment.baseUrl}/financing-requests/responsable`)
  }

  uploadPaymentReceipt(financingId: number, file: File) {
    const formData = new FormData();
    formData.append('paymentReceipt', file);
    return this.http.post<{ message: string; filename: string }>(`${environment.baseUrl}/financing-requests/${financingId}/upload-pdf`,formData);
  }

  downloadPaymentReceipt(financingId: number){
    return this.http.get(`${environment.baseUrl}/financing-requests/${financingId}/download-pdf`,
    {
      responseType: 'blob' as 'json'
    });
  }

}
