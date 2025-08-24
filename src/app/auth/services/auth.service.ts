import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../../shared/interfaces/response-login.interface';

interface JwtToken {
  exp: number;
  role_id: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  setTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtToken>(token);
      switch (decoded.role_id) {
        case '1': return 'ADMIN';
        case '2': return 'QUALITY';
        case '3': return 'RESPONSABLE';
        default: return null;
      }
    } catch {
      return null;
    }
  }

  loggedIn(): boolean {
    return !!this.getToken() && this.validateToken();
  }

  validateToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<JwtToken>(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return throwError(() => new Error('No refresh token'));

    return this.http.post<LoginResponse>(`${environment.baseUrl}/login`, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    }).pipe(
      tap((res: any) => {
        this.setTokens(res.access_token);
      })
    );
  }
}
