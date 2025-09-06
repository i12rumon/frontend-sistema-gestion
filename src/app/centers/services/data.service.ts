import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Degrees } from '../../shared/interfaces/degrees.interface';
import { Observable } from 'rxjs';
import { responseCreate } from '../../shared/interfaces/response-create-user';
import { responseModCreDegree } from '../../shared/interfaces/responseModCre.interface';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  degrees() : Observable<Degrees> {
    return this.http.get<Degrees>(`${environment.baseUrl}/degrees`);
  }

  create(name: string, type:string): Observable<responseCreate>{
    return this.http.post<responseCreate>(`${environment.baseUrl}/new-degree`,{name,type});
  }

  deleteDegree(id: number){
    return this.http.delete<responseCreate>(`${environment.baseUrl}/degree/${id}`);
  }

  modifyDegree(id: number, name: string, type: string): Observable<responseModCreDegree>{
    return this.http.put<responseModCreDegree>(`${environment.baseUrl}/degree/${id}`,{name,type});
  }

  getDegree(id:string): Observable<responseModCreDegree>{
    return this.http.get<responseModCreDegree>(`${environment.baseUrl}/degree/${id}`);
  }


}
