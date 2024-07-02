import {  HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;

  private baseUrl = 'http://localhost:8000/users';

  constructor(private router: Router, private http: HttpClient) {}

  login(user: User) {
    let params = new HttpParams();
    params = params.set('email', user.email);
    params = params.set('password', user.password);

    this.http.get<any[]>(this.baseUrl, { params })
      .pipe(
        map(users => users.length > 0),
        catchError(() => of(false))
      )
      .subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.router.navigate(['/home']);
        } else {
          alert('Invalid email or password');
        }
      });
  }

  register(user: User) {
    this.http.post(this.baseUrl, user)
      .subscribe(() => {
        this.isAuthenticated = true;
        this.router.navigate(['/home']);
      }, error => {
        alert('Registration failed');
      });
  }

  logout() {
    this.isAuthenticated = false;
    this.router.navigate(['/auth']);
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }
}
