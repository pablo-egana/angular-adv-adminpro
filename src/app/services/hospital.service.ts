import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hospital } from '../models/hospital.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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

  loadHospitals() {

    const url = `${ baseUrl }/hospitals`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, hospitals: Hospital[] }) => resp.hospitals)
      );
  
  }

  createHospital(name: string) {

    const url = `${ baseUrl }/hospitals`;
    return this.http.post(url, { name }, this.headers);
  
  }

  updateHospital(id: string, name: string) {

    const url = `${ baseUrl }/hospitals/${ id }`;
    return this.http.put(url, { name }, this.headers);
  
  }

  deleteHospital(id: string) {

    const url = `${ baseUrl }/hospitals/${ id }`;
    return this.http.delete(url, this.headers);
  
  }

}
