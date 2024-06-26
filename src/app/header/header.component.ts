import { Component } from '@angular/core';
import { RouterModule} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
}
