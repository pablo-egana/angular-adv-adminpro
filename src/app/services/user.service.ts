import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { LoadUsers } from '../interfaces/load-users.interface';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { tap, map, Observable, catchError, of, delay } from 'rxjs';

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

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }
  
  validateToken(): Observable<boolean> {

    return this.http.get(`${ baseUrl }/login/renew`, this.headers).pipe(map((resp: any) => {
      const { name, email, image = '', google, role, uid } = resp.user;
      this.user = new User(name, email, '', image, google, role, uid);
      localStorage.setItem('token', resp.token);
      return true;
    }),
    catchError(error => of(false))
    );

  }

  createUser(formData: RegisterForm) {
    
    return this.http.post(`${ baseUrl }/users`, formData, this.headers).pipe(tap((resp: any) => {
        localStorage.setItem('token', resp.token);
    }));

  }

  updateUserProfile(data: { name: string, email: string, role: string }) {
    
    data = { ...data, role: this.user.role || '' };
    return this.http.put(`${ baseUrl }/users/${ this.uid }`, data, this.headers);

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
  
  loadUsers(from: number = 0) {

    const url = `${ baseUrl }/users?from=${ from }`;
    return this.http.get<LoadUsers>(url, this.headers)
      .pipe(delay(1000), map(resp => {
        const users = resp.users.map(user => 
        new User(user.name, user.email, '', user.image, user.google, user.role, user.uid));
        return {
          total: resp.total,
          users 
        };
      }));

  }

  deleteUser(user: User) {

    const url = `${ baseUrl }/users/${ user.uid }`;
    return this.http.delete(url, this.headers);

  }

  saveUser(user: User) {

    return this.http.put(`${ baseUrl }/users/${ user.uid }`, user, this.headers);

  }

}
