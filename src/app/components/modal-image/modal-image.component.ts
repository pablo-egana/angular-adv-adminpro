import { Component, OnInit } from '@angular/core';
import { ModalImageService } from '../../services/modal-image.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [
  ]
})
export class ModalImageComponent implements OnInit {

  public uploadImage!: File;
  public temporalImage: any = null;

  constructor(public modalImageService: ModalImageService,
    private fileUploadService: FileUploadService) {}

  ngOnInit(): void {
  }

  closeModal() {
    this.temporalImage = null;
    this.modalImageService.closeModal();
  }

  changeImage(event: any) {

    const file: File = event.target.files[0];
    this.uploadImage = file;

    if (!file) {
      return this.temporalImage = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.temporalImage = reader.result;
    };
    return true;

  }

  saveImage() {
    
    const id = this.modalImageService.id;
    const type = this.modalImageService.type;

    this.fileUploadService.updatePhoto(this.uploadImage, type, id)
      .then(image => {
        Swal.fire('Guardado', 'Imagen actualizada', 'success');
        this.modalImageService.newImage.emit(image);
        this.closeModal();
      }).catch(error => {
        console.log(error);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });

  }

}
