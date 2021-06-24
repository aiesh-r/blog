import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const BASE_URL = 'http://localhost:3000/api';
export const LOGIN = 'login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<any>(`${BASE_URL}/users/${LOGIN}`, {
        email,
        password,
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
