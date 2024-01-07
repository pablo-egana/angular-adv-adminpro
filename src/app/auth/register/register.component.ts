import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.formBuilder.group({
    name: ['Test16', Validators.required],
    email: ['test16@gmail.com', [ Validators.required, Validators.email ]],
    password: ['123456', Validators.required],
    password2: ['123456', Validators.required],
    terms: [true, Validators.required]
  }, {
    validators: this.samePasswords('password', 'password2')
  });

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService) {}

  createUser(): void {
    this.formSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    // Realizar el posteo o creación
    this.userService.createUser(this.registerForm.value)
      .subscribe(resp => {
        // Navegar al dashboard
        this.router.navigateByUrl('/');
      }, (err) => {
        // Si sucede un error
        Swal.fire('Error', err.error.message, 'error');
      });
  }

  invalidInput(input: string): boolean {
    if (this.registerForm.get(input)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  invalidPasswords(): boolean {
    const inputPassword1 = this.registerForm.get('password')?.value;
    const inputPassword2 = this.registerForm.get('password2')?.value;

    if ((inputPassword1 !== inputPassword2) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  samePasswords(password: string, password2: string) {
    return (formGroup: FormGroup) => {
      const password1Control = formGroup.get(password);
      const password2Control = formGroup.get(password2);

      if (password1Control?.value === password2Control?.value) {
        password2Control?.setErrors(null);
      } else {
        password2Control?.setErrors({ notEqual: true });
      }
    }
  }

  acceptTerms(): boolean {
    return !this.registerForm.get('terms')?.value && this.formSubmitted;
  }
  
}
