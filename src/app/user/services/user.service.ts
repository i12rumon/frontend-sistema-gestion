import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../shared/interfaces/response-login.interface';
import { UsersResponse } from '../../shared/interfaces/usersResponse.interface';
import { responseCreate } from '../../shared/interfaces/response-create-user';
import { environment } from '../../../environments/environment';
import {  responseModCreUser } from '../../shared/interfaces/responseModCre.interface';
import { UserItem } from '../../shared/interfaces/user-item.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}
  login(username: string, password:string): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${environment.baseUrl}/login`,{username,password});
  }

  register(email: string, password:string, username: string,name: string,degree: string){
    return this.http.post<responseCreate>(`${environment.baseUrl}/register`,{email,password,username,name,degree});
  }

  users(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${environment.baseUrl}/users`);
  }

  deleteUser(id: number){
    return this.http.delete<responseCreate>(`${environment.baseUrl}/user/${id}`);
  }

  modifyUser(id: number, data: { email: string; password: string; username: string; name: string; degree: string }){
    return this.http.put<responseCreate>(`${environment.baseUrl}/user/${id}`,data);
  }

  getUser(id:string|null): Observable<responseModCreUser>{
    return this.http.get<responseModCreUser>(`${environment.baseUrl}/user/${id}`);
  }

  getProfileUser(): Observable<UserItem>{
      return this.http.get<UserItem>(`${environment.baseUrl}/user`);
  }

}
