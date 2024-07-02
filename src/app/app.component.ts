import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { ProductDetailsComponent } from './product-details/product-details.component';
import {  HttpClientModule } from '@angular/common/http';
import { EditProductComponent } from './edit-product/edit-product.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [CommonModule, RouterOutlet, HomeComponent, ProductDetailsComponent, HttpClientModule, EditProductComponent]
})
export class AppComponent {
  title = 'my-app';
}