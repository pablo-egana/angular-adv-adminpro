import { environment } from '../../environments/environment';
const baseUrl = environment.base_url;

export class User {
  constructor
  (
    public name: string,
    public email: string,
    public password?: string,
    public image?: string,
    public google?: boolean,
    public role?: string,
    public uid?: string
  ) 
  {}

  get getImageUrl() {
    
    if (this.image?.includes('https')) {
      return this.image;
    }

    if (this.image) {
      return `${ baseUrl }/upload/users/${ this.image }`;
    } else {
      return `${ baseUrl }/upload/users/no-image`;
    }

  }
  
}