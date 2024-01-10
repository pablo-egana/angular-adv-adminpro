import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() {}

  async updatePhoto(file: File, type: 'users' | 'doctors' | 'hospitals', id: string) {

    try {

      const url = `${ baseUrl }/upload/${ type }/${ id }`;
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await response.json();
      if (data.ok) {
        return data.fileName;
      } else {
        console.log(data.message);
        return false;
      }

    } catch (error) {
      console.log(error);
      return false;
    }

  }

}
