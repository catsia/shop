import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Product} from "../shared/models/product.model";
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { CartService } from '../shared/cart.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [NgFor, RouterModule, NgIf]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  cart: { [id: number]: number } = {};

  constructor(private http: HttpClient, private cartService: CartService) {
    
  }
 
  ngOnInit(): void {
    
    this.fetchProducts();

    this.cart = this.cartService.getCartItems()
  }

  fetchProducts(): void {
    
    this.http.get<Product[]>('http://localhost:8000/products').subscribe(
      products => {
        this.products = products;
      },
      error => console.error('Error fetching products:', error)
    );
  }
  
  addToCart(productId: number): void {
    this.cartService.addToCart(productId);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  deleteProduct(productId: number): void {
    this.http.delete(`http://localhost:8000/products/${productId}`).subscribe(() => {
      this.products = this.products.filter(p => p.id !== productId);
    },
    error => console.error('Error deleting product:', error));
  }
}