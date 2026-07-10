import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
  side: 'PAYLINE' | 'CLIENT';
  clientId: number | null;
  clientName: string | null;
}

const TOKEN_KEY = 'payline_token';
const USER_KEY = 'payline_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(tap(res => {
        sessionStorage.setItem(TOKEN_KEY, res.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(res));
      }));
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  get token(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  get currentUser(): LoginResponse | null {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) as LoginResponse : null;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get isPaylineSide(): boolean {
    return this.currentUser?.side === 'PAYLINE';
  }
}
