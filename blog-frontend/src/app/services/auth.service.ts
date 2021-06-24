import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<any>('http://localhost:3000/api/users/login', {
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
