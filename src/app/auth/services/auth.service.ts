import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  setToken ( token: string ){
    localStorage.setItem('token', token);
  }

  getToken(): string | null{
    return localStorage.getItem('token');
  }

  logout(){
    localStorage.removeItem('token');
  }

  getRole(): string | null{
    const token = this.getToken();
    if(!token){
      return null;
    }
    try {
      const decoded = jwtDecode<JwtToken>(token);
      if(decoded.role_id == '1'){
        return "ADMIN";
      }
      if(decoded.role_id == '2'){
        return "QUALITY";
      }
      if(decoded.role_id == '3'){
        return "RESPONSABLE";
      }
      return null;
    }
    catch (error){
      return null;
    }
  }

  loggedIn(): boolean{
    return !!this.getToken() && this.validateToken();
  }

  validateToken(): boolean{
    const token = this.getToken();
    if(!token){
      return false;
    }
    try{
      const token_decoded = jwtDecode<JwtToken>(token);
      const date_now = Date.now().valueOf() / 1000;
      return token_decoded.exp > date_now;
    }
    catch(error){
      return false;
    }
  }

}
