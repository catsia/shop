import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: { [id: number]: number } = {};

  addToCart(productId: number): void {
    if (!this.cart[productId]) {
      this.cart[productId] = 1;
    } else {
      this.cart[productId]++;
    }
  }

  removeFromCart(productId: number): void {
    if (this.cart[productId] > 1) {
      this.cart[productId]--;
    } else {
      delete this.cart[productId];
    }
  }

  isInCart(productId: number): boolean {
    return !!this.cart[productId];
  }

  getCartItems(): {} {
    return this.cart;
  }

  getCartItem(productId: number): number {
    return this.cart[productId];
  }

}
