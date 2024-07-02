import { Component, OnInit } from '@angular/core';
import { CartService } from '../shared/cart.service';
import { Cart } from '../shared/models/cart.model';
import { CommonModule, NgFor } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [NgFor, HeaderComponent, CommonModule],
  animations: [
  trigger('rowAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(-100%)' }),
      animate('0.7s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
    ,
    transition(':leave', [
      animate('1s ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
    ])
  ])
]
})


export class CartComponent implements OnInit {
  cart: Cart[] = [];
  
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(data => {
      this.cart = data;
    });

  }

  addToCart(product: Cart): void {
    this.cartService.addToCart(product).subscribe(() => {
      this.loadCart();
    });
  }

  updateCart(product: Cart, count: number): void {
    product.count = count;
    if (count == 0) {
      this.removeFromCart(product.id);
      return;
    }
    this.cartService.updateCart(product).subscribe(() => {
    });
  }

  removeFromCart(id: number): void {
    this.cart = this.cart.filter(item => item.id != id);
    this.cartService.removeFromCart(id).subscribe(() => {
    });
  }
}
