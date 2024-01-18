import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FileUploadService } from '../../services/file-upload.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  public profileForm!: FormGroup;
  public user!: User;
  public uploadImage!: File;
  public temporalImage: any = null;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private fileUploadService: FileUploadService) {
    this.user = userService.user;
  }

  ngOnInit(): void {

    this.profileForm = this.formBuilder.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]]
    });

  }

  updateProfile() {
    
    this.userService.updateUserProfile(this.profileForm.value)
      .subscribe(() => {
        const { name, email } = this.profileForm.value;
        this.user.name = name;
        this.user.email = email;
        Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
      }, (error) => {
        Swal.fire('Error', error.error.message, 'error');
      });
    
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
    
    this.fileUploadService.updatePhoto(this.uploadImage, 'users', this.user.uid || '')
      .then(image => {
        this.user.image = image;
        Swal.fire('Guardado', 'Imagen actualizada', 'success');
      }).catch(error => {
        console.log(error);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
      
  }

}
