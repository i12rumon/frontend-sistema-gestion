import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Calls } from '../../shared/interfaces/calls.interface';
import { environment } from '../../../environments/environment';
import { CallsMessageResponse } from '../../shared/interfaces/call-messages-response';
import { CreateCall } from '../../shared/interfaces/create-calls-params.interface';

@Injectable({
  providedIn: 'root'
})
export class CallsService {

  constructor(private http: HttpClient) {}

  calls() : Observable<Calls> {
    return this.http.get<Calls>(`${environment.baseUrl}/calls`);
  }

  create_calls(call : CreateCall) : Observable<CallsMessageResponse>{
    return this.http.post<CallsMessageResponse>(`${environment.baseUrl}/calls`, call);
  }

  close_call(call: number) :Observable<CallsMessageResponse>{
    return this.http.put(`${environment.baseUrl}/calls/${call}/close`,{});
  }

  modify_call(id: number, data: { title: string; start_date: Date; end_date: Date; description: string }){
    return this.http.put<CallsMessageResponse>(`${environment.baseUrl}/calls/${id}/edit`,data);
  }

}
