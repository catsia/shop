import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Cart } from './models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:8000/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.baseUrl);
  }

  getProduct(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/${id}`);
  }

  addToCart(product: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.baseUrl, product);
  }

  updateCart(product: Cart): Observable<Cart> {
    return this.http.put<Cart>(`${this.baseUrl}/${product.id}`, product);
  }

  removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  isInCart(productId: number): Observable<boolean> {
    return this.http.get<Cart[]>(this.baseUrl).pipe(
      map((cart: { id: number; }[]) => cart.some((item: { id: number; }) => item.id === productId))
    );
  }
}
