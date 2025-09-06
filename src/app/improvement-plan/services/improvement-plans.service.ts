import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Plan, Plans } from '../interfaces/list-plans.interface';
import { map, Observable } from 'rxjs';
import { ImprovementPlan } from '../interfaces/create-plan.interface';

@Injectable({
  providedIn: 'root'
})
export class ImprovementPlansService {
  private http = inject(HttpClient);

  plans(): Observable<Plans>{
    return this.http.get<Plans>(`${environment.baseUrl}/plans-user`);
  }

  nPlans(): Observable<Plans>{
    return this.http.get<Plans>(`${environment.baseUrl}/plans`);
  }

  create_plan(plan: ImprovementPlan){
    return this.http.post<ImprovementPlan>(`${environment.baseUrl}/plans/new`, plan);
  }

  generatePDF(planId: number) {
    return this.http.get(`${environment.baseUrl}/plans/${planId}/pdf`, {
      responseType: 'blob'
    });
  }

  approvePlan(planId: number) {
    const today = new Date().toISOString().split('T')[0];
    const approvalUrl = `${environment.baseUrl}/plans/${planId}`;
    return this.http.put<any>(`${environment.baseUrl}/plans/${planId}/approve`, {
      approval_date: today,
      approval_url: approvalUrl
    });
  }

  get_plan(planId : number): Observable<Plan>{
    return this.http.get<{plan: Plan}>(`${environment.baseUrl}/plans/${planId}`)
    .pipe(map(resp => resp.plan));
  }

  update_plan(planId: number, plan: ImprovementPlan){
    return this.http.put(`${environment.baseUrl}/plans/${planId}`, plan);
  }

}
