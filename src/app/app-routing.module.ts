import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'product/edit/:id', component: EditProductComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
