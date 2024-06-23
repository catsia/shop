import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http' ;
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CommonModule, DecimalPipe } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { EditProductComponent } from './edit-product/edit-product.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { CartComponent } from './cart/cart.component';
import { BrowserAnimationsModule, NoopAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductDetailsComponent,
    EditProductComponent,
    HeaderComponent,
    CartComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    HomeComponent,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [HttpClient, provideAnimations()],
  bootstrap: [AppComponent]
})
export class AppModule { }
