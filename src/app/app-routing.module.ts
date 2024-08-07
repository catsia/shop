import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'edit', component: EditProductComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: '/home', component: HomeComponent },
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
