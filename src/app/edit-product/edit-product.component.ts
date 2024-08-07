import { Component, OnInit, ViewChild } from '@angular/core';
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
  imports: [FormsModule, NgIf]
})

export class EditProductComponent implements OnInit {
  @ViewChild('editForm') editForm!: NgForm;
  pricePattern = '[0-9]+(\.[0-9]{1,2})?';
  productId: number = this.route.snapshot.params['id'];
  product: Product;

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

  get image() {
    return this.editForm?.controls['image'];
  }

  get title() {
    return this.editForm?.controls['title'];
  }
  get price() {
    return this.editForm?.controls['price'];
  }
  get stock() {
    return this.editForm?.controls['stock'];
  }

  get description() {
    return this.editForm?.controls['description'];
  }

}
