import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const BASE_URL = 'http://localhost:3000/api';
export const LOGIN = 'login';

export interface LoginForm {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(loginForm: LoginForm) {
    return this.http
      .post<any>(`${BASE_URL}/users/${LOGIN}`, {
        email: loginForm.email,
        password: loginForm.password,
      })
      .pipe(
        map((token) => {
          console.log('success', token);
          localStorage.setItem('access_token', token.access_token);
          return token;
        })
      );
  }
}
