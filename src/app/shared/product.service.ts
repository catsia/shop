import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8000/products';

  constructor(private http: HttpClient) { }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateProduct(id: number, product: { [key: string]: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(`${this.baseUrl}/${id}`, product, {headers});
  }
}
