import { Component, OnInit } from '@angular/core';
import { Product } from "../shared/models/product.model";
import { Review } from "../shared/models/review.model";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from "@angular/common";
import { CartService } from '../shared/cart.service';
import { HeaderComponent } from '../header/header.component';
import { Cart } from '../shared/models/cart.model';
import { ProductService } from '../shared/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgIf, NgFor, HeaderComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private cartService: CartService, private productService: ProductService) { }

  product: Product | null = null;
  stockPresenceMessage: string = '';
  id: number = +this.route.snapshot.params['id'];
  cart: Cart | null = null;
  reviews: Review[] = [];

  ngOnInit(): void {
    this.fetchProduct();
    this.fetchReviews();
    this.fetchCart();
  }

  fetchProduct(): void {
    this.productService.getProductById(this.id).subscribe(product => {
      this.product = product;
      if (this.product == null) return;
      this.stockPresenceMessage =
        this.product.stock > 10
          ? 'In stock'
          : this.product.stock === 0
            ? 'Out of stock'
            : 'Almost sold out';
      if (this.cart) {
        this.cart.title = product.title;
        this.cart.price = product.price;
      }
    });
  }

  fetchCart(): void {
    this.cartService.getProduct(this.id).subscribe(data => {
      this.cart = data.length > 0 ? data[0] : { id: this.id, title: this.product?.title ? this.product.title : '', count: 0, price: 0 };
    });
  }

  fetchReviews(): void {
    this.productService.fetchReviewsById(this.id).subscribe(
      reviews => {
        if (Array.isArray(reviews)) {
          this.reviews = reviews;
        }
        else {
          this.reviews.push(reviews);
        }
      },
      error => console.error('Error fetching reviews:', error)
    );
  }

  isOutOfStock(): boolean {
    return this.product ? this.product.stock === 0 : true;
  }

  addToCart(): void {
    if (this.cart && this.product) {
      if (this.cart.count !== 0) {
        this.cart.count += 1;
        this.cartService.updateCart(this.cart).subscribe(() => {
        });
      } else {
        this.cart = new Cart(this.product.id, this.product.title, 1, this.product.price)
        this.cartService.addToCart(this.cart).subscribe(() => {
        });
      }
    }
  }

  isInCart(): boolean {
    return this.cart ? this.cart.count !== 0 : false;
  }

  removeFromCart(): void {
    if (!this.cart) return;
      if (this.cart.count !== 0) {
        if (this.cart.count > 1) {
          this.cart.count -= 1;
          this.cartService.updateCart(this.cart).subscribe(() => {
          });
        } 
        else {
          this.cart.count -= 1;
          this.cartService.removeFromCart(this.id).subscribe(() => {
          });
        }
    }
  }
}
