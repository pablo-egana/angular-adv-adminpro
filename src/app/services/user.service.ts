import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, Observable, catchError, of } from 'rxjs';

const baseUrl = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {}

  validateToken(): Observable<boolean> {

    const token = localStorage.getItem('token') || '';
    return this.http.get(`${ baseUrl }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(tap((resp: any) => {
      localStorage.setItem('token', resp.token);
    }),
    map(resp => true),
    catchError(error => of(false))
    );

  }

  createUser(formData: RegisterForm) {
    
    const token = localStorage.getItem('token') || '';
    return this.http.post(`${ baseUrl }/users`, formData, {
      headers: {
        'x-token': token
      }
    }).pipe(tap((resp: any) => {
        localStorage.setItem('token', resp.token);
    }));

  }

  loginUser(formData: LoginForm) {

    return this.http.post(`${ baseUrl }/login`, formData)
      .pipe(tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }));

  }

  loginGoogle(token: string) {

    return this.http.post(`${ baseUrl }/login/google`, { token })
      .pipe(tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }));

  }

  logoutUser() {
    
    const emailUser = localStorage.getItem('email');
    google.accounts.oauth2.revoke(emailUser, () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
      });
    });

  }
  
}
