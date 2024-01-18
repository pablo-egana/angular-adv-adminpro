import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

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

  loadDoctors() {

    const url = `${ baseUrl }/doctors`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, doctors: Doctor[] }) => resp.doctors)
      );
  
  }

  loadDoctorById(id: string) {

    const url = `${ baseUrl }/doctors/${ id }`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, doctor: Doctor }) => resp.doctor)
      );
  
  }

  createDoctor(doctor: { name: string, hospital: string }) {

    const url = `${ baseUrl }/doctors`;
    return this.http.post(url, doctor, this.headers);
  
  }

  updateDoctor(doctor: Doctor) {

    const url = `${ baseUrl }/doctors/${ doctor._id }`;
    return this.http.put(url, doctor, this.headers);
  
  }

  deleteDoctor(id: string) {

    const url = `${ baseUrl }/doctors/${ id }`;
    return this.http.delete(url, this.headers);
  
  }

}
