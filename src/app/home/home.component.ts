import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Product} from "../shared/models/product.model";
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../shared/cart.service';
import { HeaderComponent } from '../header/header.component';
import { Cart } from '../shared/models/cart.model';
import { ProductService } from '../shared/product.service';
import { HomeService } from './home.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [NgFor, RouterModule, NgIf, ReactiveFormsModule, KeyValuePipe, HeaderComponent]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  cartCount = new Map<number, number>();
  cart: Cart[] = [];
  filterForm: FormGroup;
  filterBadges: { [key: string]: null | number | boolean } [] = [];

  constructor(private http: HttpClient, private cartService: CartService,  private fb: FormBuilder, private route: ActivatedRoute,  private router: Router, private productService: ProductService, private homeService: HomeService) {
    this.filterForm = this.fb.group({
      priceFrom: ['', Validators.min(0)],
      priceTo: ['', Validators.min(0)],
      ratingFrom: ['', [Validators.min(0), Validators.max(5)]],
      ratingTo: ['', [Validators.min(0), Validators.max(5)]],
      inStock: [false],
      hasReviews: [false],
    },
  );
  }
 
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterForm.setValue({
        priceFrom: params['priceFrom'] || '',
        priceTo: params['priceTo'] || '',
        ratingFrom: params['ratingFrom'] || '',
        ratingTo: params['ratingTo'] || '',
        inStock: params['inStock']  === 'true' || false,
        hasReviews: params['hasReviews']  === 'true' || false
      });
      this.fetchProducts();


      this.filterBadges = {
        ...(params['priceFrom'] && { priceFrom: `Price from: ${params['priceFrom']}` }),
        ...(params['priceTo'] && { priceTo: `Price to: ${params['priceTo']}` }),
        ...(params['ratingFrom'] && { ratingFrom: `Rating from: ${params['ratingFrom']}` }),
        ...(params['ratingTo'] && { ratingTo: `Rating to: ${params['ratingTo']}` })
      };
      
    });
    this.fetchCart();
  }

  fetchCart(): void {
    this.cartService.getCart().subscribe(data => {
      this.cart = data;
      this.cart.forEach(item => this.cartCount.set(item.id, item.count));
    });
  }

  fetchProducts(): void {
    this.productService.getProducts(this.homeService.getHttpParams(this.filterForm)).subscribe(products => {
      this.products = products;
    })
  }

  updateFilteredProducts(): void {
    const { priceFrom, priceTo, ratingFrom, ratingTo, inStock, hasReviews } = this.filterForm.value;
  
    this.filterBadges = {
      ...(priceFrom && { priceFrom: `Price from: ${priceFrom}` }),
      ...(priceTo && { priceTo: `Price to: ${priceTo}` }),
      ...(ratingFrom && { ratingFrom: `Rating from: ${ratingFrom}` }),
      ...(ratingTo && { ratingTo: `Rating to: ${ratingTo}` })
    };
  
    const queryParams: any = {};
  
    if (priceFrom) queryParams.priceFrom = priceFrom;
    if (priceTo) queryParams.priceTo = priceTo;
    if (ratingFrom) queryParams.ratingFrom = ratingFrom;
    if (ratingTo) queryParams.ratingTo = ratingTo;
    if (inStock) queryParams.inStock = inStock;
    if (hasReviews) queryParams.hasReviews = hasReviews;
  
    this.router.navigate([], { queryParams });
  }
  

  removeFilter(filter: string): void {
    this.filterForm.patchValue({ [filter]: filter === 'inStock' || filter === 'hasReviews' ? false : '' });
    this.updateFilteredProducts();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.updateFilteredProducts();
  }

  addToCart(product: Product): void {
    const cartItem = this.cart.find(item => item.id === product.id);
    if (cartItem) {
      this.cartService.updateCart({ ...cartItem, count: cartItem.count + 1 }).subscribe(() => {
        this.fetchCart();
      });
    } else {
      this.cartService.addToCart(new Cart(product.id, product.title, 1, product.price)).subscribe(() => {
        this.fetchCart();
      });
    }
  }

  removeFromCart(productId: number): void {
    const cartItem = this.cart.find(item => item.id === productId);
    if (cartItem) {
      if (cartItem.count > 1) {
        this.cartService.updateCart({ ...cartItem, count: cartItem.count - 1 }).subscribe(() => {
          this.fetchCart();
        });
      } else {
        this.cartService.removeFromCart(productId).subscribe(() => {
          this.fetchCart();
        });
      }
    }
  }

  isInCart(productId: number): boolean {
    return !!this.cart.find(item => item.id === productId);
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.products = this.products.filter(p => p.id !== productId);
    },
    error => console.error('Error deleting product:', error));
  }

  get priceFrom() {
    return this.filterForm.value.priceFrom;
  }

  get priceTo() {
    return this.filterForm.value.priceTo;
  }

  get ratingFrom() {
    return this.filterForm.value.ratingFrom;
  }

  get ratingTo() {
    return this.filterForm.value.ratingTo;
  }
}