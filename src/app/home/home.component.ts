import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Product} from "../shared/models/product.model";
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../shared/cart.service';
import {KeyValue} from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [NgFor, RouterModule, NgIf, ReactiveFormsModule, KeyValuePipe, HeaderComponent]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  cart: { [id: number]: number } = {};
  filterForm: FormGroup;
  filterBadges: { [key: string]: null | number | boolean } = {};
  filteredProductsLength: number = 0;

  constructor(private http: HttpClient, private cartService: CartService,  private fb: FormBuilder, private route: ActivatedRoute,  private router: Router) {
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

    this.cart = this.cartService.getCartItems()
  }

  fetchProducts(): void {
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

    this.http.get<Product[]>('http://localhost:8000/products', { params }).subscribe(
      products => {
        this.products = products;
        this.updateFilteredProducts();
      },
      error => console.error('Error fetching products:', error)
    );
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