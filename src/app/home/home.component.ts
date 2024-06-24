import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Product} from "../shared/models/product.model";
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../shared/cart.service';
import { HeaderComponent } from '../header/header.component';
import { Cart } from '../shared/models/cart.model';
import { ProductService } from '../shared/product.service';

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
  filterBadges: { [key: string]: null | number | boolean } = {};
  filteredProductsLength: number = 0;

  constructor(private http: HttpClient, private cartService: CartService,  private fb: FormBuilder, private route: ActivatedRoute,  private router: Router, private productService: ProductService) {
    this.filterForm = this.fb.group({
      priceFrom: [''],
      priceTo: [''],
      ratingFrom: [''],
      ratingTo: [''],
      inStock: [false],
      hasReviews: [false]
    });
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
    this.productService.getProducts(this.getHttpParams()).subscribe(products => {
      this.products = products;
    })
  }

  getHttpParams(): HttpParams {
    let params = new HttpParams();

    if (this.filterForm.value.priceFrom) {
      params = params.set('price_gte', this.filterForm.value.priceFrom);
    }
    if (this.filterForm.value.priceTo) {
      params = params.set('price_lte', this.filterForm.value.priceTo);
    }

    if (this.filterForm.value.ratingFrom) {
      params = params.set('rating.rate_gte', this.filterForm.value.ratingFrom);
    }
    if (this.filterForm.value.ratingTo) {
      params = params.set('rating.rate_lte', this.filterForm.value.ratingTo);
    }
    
    if (this.filterForm.value.inStock == true) {
      params = params.set('stock_gt', 0);
    } else {
      params = params.set('stock', 0);
    }
    if (this.filterForm.value.hasReviews == true) {
      params = params.set('rating.count_gt', 0);
    }
    else {
      params = params.set('rating.count', 0);
    }
    
    return params;
  }

  updateFilteredProducts(): void {
    const { priceFrom, priceTo, ratingFrom, ratingTo, inStock, hasReviews } = this.filterForm.value;

    this.filterBadges = {
      ...(priceFrom && { priceFrom: `Price from: ${priceFrom}` }),
      ...(priceTo && { priceTo: `Price to: ${priceTo}` }),
      ...(ratingFrom && { ratingFrom: `Rating from: ${ratingFrom}` }),
      ...(ratingTo && { ratingTo: `Rating to: ${ratingTo}` })
    };

    this.filteredProductsLength = this.products.length;

    const queryParams = { priceFrom, priceTo, ratingFrom, ratingTo, inStock, hasReviews };
    this.router.navigate([], { queryParams });
  }

  removeFilter(filter: string): void {
    this.filterForm.patchValue({ [filter]: filter === 'inStock' || filter === 'hasReviews' ? false : '' });
    this.updateFilteredProducts();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filterForm.value.inStock = true;
    this.filterForm.value.hasReviews = true;
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


}