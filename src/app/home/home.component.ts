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

interface FilterDefinition {
  name: string;
  type: string;
  validators: any[];
  defaultValue: any;
}

const FILTER_DEFINITIONS: FilterDefinition[] = [
  { name: 'priceFrom', type: 'number', validators: [Validators.min(0)], defaultValue: '' },
  { name: 'priceTo', type: 'number', validators: [Validators.min(0)], defaultValue: '' },
  { name: 'ratingFrom', type: 'number', validators: [Validators.min(0), Validators.max(5)], defaultValue: '' },
  { name: 'ratingTo', type: 'number', validators: [Validators.min(0), Validators.max(5)], defaultValue: '' },
  { name: 'inStock', type: 'boolean', validators: [], defaultValue: false },
  { name: 'hasReviews', type: 'boolean', validators: [], defaultValue: false },
];

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
  filterBadges: { [key: string]: string | null | number | boolean } = {};

  constructor(private http: HttpClient, private cartService: CartService,  private fb: FormBuilder, private route: ActivatedRoute,  private router: Router, private productService: ProductService, private homeService: HomeService) {
  this.filterForm = this.fb.group(
    FILTER_DEFINITIONS.reduce((acc, filter) => {
      acc[filter.name] = [filter.defaultValue, filter.validators];
      return acc;
    }, {} as { [key: string]: any[] })
  );
  }
 
  ngOnInit(): void {
  
    this.route.queryParams.subscribe(params => {
      const formValues = FILTER_DEFINITIONS.reduce((acc, filter) => {
        if (filter.type === 'boolean') {
          acc[filter.name] = params[filter.name] === 'true' || filter.defaultValue;
        } else {
          acc[filter.name] = params[filter.name] || filter.defaultValue;
        }
        return acc;
      }, {} as { [key: string]: any });
      this.filterForm.setValue(formValues);

      this.fetchProducts();

      FILTER_DEFINITIONS.forEach(filter => {
        if (params[filter.name] !== undefined && params[filter.name] !== filter.defaultValue) {
          this.filterBadges[filter.name] = `${capitalize(filter.name.replace(/([A-Z])/g, ' $1'))}: ${params[filter.name]}`;
        } 
      });
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
    FILTER_DEFINITIONS.forEach(filter => {
      this.filterBadges = {};
      const value = this.filterForm.get(filter.name)?.value;

      if (value !== undefined && value !== filter.defaultValue  && value !== '' && value !== false  && value !== null) {
        this.filterBadges[filter.name] = `${capitalize(filter.name.replace(/([A-Z])/g, ' $1'))}: ${value}`;
      } 
    });
  
    const queryParams: any = {};
  
    FILTER_DEFINITIONS.forEach(filter => {
      const value = this.filterForm.get(filter.name)?.value;
      if (value !== null && value !== undefined && value !== '' && value !== false) {
        queryParams[filter.name] = value;
      }
    });
  
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

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
