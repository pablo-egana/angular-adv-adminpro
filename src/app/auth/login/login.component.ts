import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginForm } from '../../interfaces/login-form.interface';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleButton') googleButton: ElementRef | undefined;

  public formSubmitted = false;
  public loginFormData?: LoginForm;

  public loginForm = this.formBuilder.group({
    email: [ localStorage.getItem('email') || '', [ Validators.required, Validators.email ]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor(private router: Router, private formBuilder: FormBuilder,
    private userService: UserService, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit(): void {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: "1097985235574-heqvp10f9b7kvchlbv8ad2nmcraec88q.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    // @ts-ignore
    google.accounts.id.renderButton(
      this.googleButton?.nativeElement,
      { theme: "dark", size: "medium" }  // customization attributes
    );
  }

  handleCredentialResponse(response: any): void {
    // console.log("Encoded JWT ID token: " + response.credential);
    this.userService.loginGoogle(response.credential)
      .subscribe(resp => {
        this.ngZone.run(() => {
          // Navegar al dashboard
          localStorage.setItem('email', resp.email);
          this.router.navigateByUrl('/');
        });
      });
  }

  login(): void {
    this.formSubmitted = true;
    const emailForm = this.loginForm.get('email');
    const passwordForm = this.loginForm.get('password');
    const rememberForm = this.loginForm.get('remember');
    this.loginFormData = { 
      email: emailForm?.value || '',
      password: passwordForm?.value || '',
      remember: rememberForm?.value || false
    };
    // Realizar el posteo de Login Usuario
    this.userService.loginUser(this.loginFormData)
      .subscribe(resp => {
        if (this.loginFormData?.remember) {
          localStorage.setItem('email', this.loginFormData?.email || '');
        } else {
          localStorage.removeItem('email');
        }
        // Navegar al dashboard
        this.router.navigateByUrl('/');
      }, (err) => {
        // Si sucede un error
        Swal.fire('Error', err.error.message, 'error');
      });
  }

}
