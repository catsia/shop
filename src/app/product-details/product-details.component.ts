import { Component, OnInit } from '@angular/core';
import {Product} from "../shared/models/product.model";
import {Review} from "../shared/models/review.model";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {NgIf, NgFor} from "@angular/common";
import { CartService } from '../shared/cart.service';
import { HeaderComponent } from '../header/header.component';
import { Cart } from '../shared/models/cart.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgIf, NgFor, HeaderComponent],
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
  cart: Cart = {
    id: this.id,
    title: '',
    count: 0,
    price: 0
  };
  reviews: Review[] = [];

  ngOnInit(): void {
    this.fetchProduct();
    this.fetchReviews();
    this.fetchCart();
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
          this.cart.title = product.title;
          this.cart.price = product.price;
      },
      error => console.error('Error fetching product' + this.id, error)
    );
   
  }

  fetchCart(): void {
    this.cartService.getProduct(this.id).subscribe(data => {
      if (data != null) {
        this.cart = data;
      }
    });
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

  addToCart(): void {
    if (this.cart.count != 0) {
      this.cartService.updateCart({ ...this.cart, count: this.cart.count + 1 }).subscribe(() => {
        this.fetchCart();
      });
    } else {
      this.cartService.addToCart(new Cart(this.id, this.product.title, 1, this.product.price)).subscribe(() => {
        this.fetchCart();
      });
    }
  }

  isInCart(): boolean {
    return this.cart.count != 0;
  }

  removeFromCart(): void {
    if (this.cart.count != 0) {
      if (this.cart.count > 1) {
        this.cartService.updateCart({ ...this.cart, count: this.cart.count - 1 }).subscribe(() => {
          this.fetchCart();
        });
      } else {
        this.cartService.removeFromCart(this.id).subscribe(() => {
          this.fetchCart();
        });
      }
    }
  }

}
