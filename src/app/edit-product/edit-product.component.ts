import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../shared/product.service';
import {  FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Product } from '../shared/models/product.model';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  imports: [FormsModule, NgIf, HeaderComponent]
})

export class EditProductComponent implements OnInit {
  pricePattern = '^[0-9]*(\.[0-9]{1,2})?$';
  productId: number = this.route.snapshot.params['id'];
  product: Product = {
    title: 'No product found',
    rating: {
      rate: 0,
      count: 10
    },
    id: 0,
    price: 0,
    description: '',
    image: '',
    featured: false,
    stock: 0
  };

  constructor(private route: ActivatedRoute, private productService: ProductService) { 
    
  }

  ngOnInit(): void {
    this.productService.getProductById(this.productId).subscribe(product => {
      this.product = product;
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.productService.updateProduct(this.productId, form.value).subscribe(response => {
        console.log('Product updated successfully', response);
      }, error => {
        console.error('Error updating product', error);
      });
  }
  }
}
