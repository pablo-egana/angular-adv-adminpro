import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const baseUrl = environment.base_url;

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(image: string, type: 'users'|'doctors'|'hospitals'): string {
    
    if (!image) {
      return `${ baseUrl }/upload/users/no-image`;
    } else if (image?.includes('https')) {
      return image;
    } else if (image) {
      return `${ baseUrl }/upload/${ type }/${ image }`;
    } else {
      return `${ baseUrl }/upload/${ type }/no-image`;
    }

  }

}
