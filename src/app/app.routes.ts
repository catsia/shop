// import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './home/home.component';
// import { ProductDetailsComponent } from './product-details/product-details.component';
// import { NgModule } from '@angular/core';


// export const routes: Routes = [
//     { path: '', component: HomeComponent },
//     { path: 'product/:id', component: ProductDetailsComponent },
//     { path: '**', redirectTo: '', pathMatch: 'full' }
//   ];
// //export const routes: Routes = [];

// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule]
//   })
//   export class AppRoutingModule { }

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./product-details/product-details.component').then((m)=> m.ProductDetailsComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
];