import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SearchesService {

  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  private transformUsers(results: any[]): User[] {
    
    return results.map(user =>
      new User(user.name, user.email, '', user.image, user.google, user.role, user.uid));

  }
  
  search(type: 'users' | 'doctors' | 'hospitals', term: string = '') {

    const url = `${ baseUrl }/all/collection/${ type }/${ term }`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(map((resp: any) => {
        
        switch (type) {
          case 'users':
            return this.transformUsers(resp.results);
          /*
          case 'doctors':
            return this.transformUsers(resp);
          case 'hospitals':
            return this.transformUsers(resp);
          */
          default:
            return [];
        }

      }));
    
  }

}
