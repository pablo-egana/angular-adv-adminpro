import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImageService {

  private _ocultarModal: boolean = true;
  public type!: 'users' | 'doctors' | 'hospitals';
  public id: string = '';
  public image: string = '';
  public newImage: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  get hideModal() {
    return this._ocultarModal;
  }

  openModal(type: 'users' | 'doctors' | 'hospitals',
    id: string = '', image: string = 'no-image') {
    
    this._ocultarModal = false;
    this.type = type;
    this.id = id;

    if (image.includes('https')) {
      this.image = image;
    } else {
      this.image = `${ baseUrl }/upload/${ type }/${ image }`;
    }
    
  }

  closeModal() {
    this._ocultarModal = true;
  }

}
