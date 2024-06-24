import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './models/product.model';
import { Review } from './models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8000/products';

  private reviewUrl = 'http://localhost:8000/reviews';

  constructor(private http: HttpClient) { }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateProduct(id: number, product: { [key: string]: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(`${this.baseUrl}/${id}`, product, {headers});
  }

  getProducts(params: HttpParams): Observable<any> {
    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  fetchReviewsById(id: number): Observable<any> {
    return this.http.get<Review[]>(`${this.reviewUrl}/${id}`)
  }
 
}
