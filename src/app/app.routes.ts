import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard.service';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'product/edit/:id',
    loadComponent: () =>
      import('./edit-product/edit-product.component').then((m)=> m.EditProductComponent),
    canActivate: [authGuard]
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./product-details/product-details.component').then((m)=> m.ProductDetailsComponent)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart.component').then((m)=> m.CartComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
];