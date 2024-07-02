import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../shared/models/user.model';
import { NgIf } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, NgIf, HeaderComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  @ViewChild('authForm') loginForm!: NgForm;
  user: User = {
    email: '',
    password: ''
  };

  isSignUpMode = true;

  toggleAuthMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }
 
  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {
    const user: User = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
    }
    if (form.valid) {
      if (this.isSignUpMode) {
        this.authService.register(user);
      } else {
        this.authService.login(user);
      }
    }
  }
}
