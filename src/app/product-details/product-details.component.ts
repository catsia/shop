import { Component, OnInit } from '@angular/core';
import {Product} from "../shared/models/product.model";
import {Review} from "../shared/models/review.model";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {NgIf, NgFor} from "@angular/common";
import { CartService } from '../shared/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {

  constructor(private http: HttpClient,  private route: ActivatedRoute, private cartService: CartService) {  }

  product: Product = {
    title: 'No product found',
    rating: {
      rate: 0,
      count: 10
    },
    id: 0,
    price: 0,
    description: '',
    image: '',
    featured: false,
    stock: 0
  };

  stockPresenceMessage: string = '';
  id: number = this.route.snapshot.params['id'];
  cartCount: number = 0;
  reviews: Review[] = [];

  ngOnInit(): void {
    this.fetchProduct();
    this.fetchReviews();
    this.cartCount = this.cartService.getCartItem(this.id);
  }

  fetchProduct(): void {
    this.http.get<Product>('http://localhost:8000/products/' + this.id).subscribe(
      product => {
        this.product = product; 
        this.stockPresenceMessage =
        this.product.stock > 10
          ? 'In stock'
          : this.product.stock === 0
          ? 'Out of stock'
          : 'Almost sold out';
      },
      error => console.error('Error fetching product' + this.id, error)
    );
   
  }

  fetchReviews(): void {
    this.http.get<Review[]>(`http://localhost:8000/reviews?productId=${this.id}`).subscribe(
      reviews => {
        this.reviews = reviews;
      },
      error => console.error('Error fetching reviews:', error)
    );
  }

  isOutOfStock(): boolean {
    return this.product.stock === 0;
  }

  addToCart(productId: number): void {
    this.cartService.addToCart(productId);
    this.cartCount = this.cartService.getCartItem(this.id);
  }

  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.cartCount = this.cartService.getCartItem(this.id);
  }

}
