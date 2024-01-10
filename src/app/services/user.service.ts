import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { tap, map, Observable, catchError, of } from 'rxjs';

const baseUrl = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user!: User;

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.user.uid || '';
  }
  
  validateToken(): Observable<boolean> {

    return this.http.get(`${ baseUrl }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(map((resp: any) => {
      const { name, email, image = '', google, role, uid } = resp.user;
      this.user = new User(name, email, '', image, google, role, uid);
      localStorage.setItem('token', resp.token);
      return true;
    }),
    catchError(error => of(false))
    );

  }

  createUser(formData: RegisterForm) {
    
    return this.http.post(`${ baseUrl }/users`, formData, {
      headers: {
        'x-token': this.token
      }
    }).pipe(tap((resp: any) => {
        localStorage.setItem('token', resp.token);
    }));

  }

  updateUserProfile(data: { name: string, email: string, role: string }) {
    
    data = { ...data, role: this.user.role || '' };

    return this.http.put(`${ baseUrl }/users/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    });

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
