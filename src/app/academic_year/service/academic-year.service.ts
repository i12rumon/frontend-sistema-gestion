import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AcademicYears } from '../interfaces/academic_years.interface';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { responseCreate } from '../../shared/interfaces/response-create-user';

@Injectable({
  providedIn: 'root'
})
export class AcademicYearService {
private http= inject(HttpClient);

academic_years(): Observable<AcademicYears>{
  return this.http.get<AcademicYears>(`${environment.baseUrl}/academic-years`);
}

set_active_academic_year(year: string): Observable<responseCreate>{
  return this.http.post<responseCreate>(`${environment.baseUrl}/academic-years/new`,{year: year})
}

}
