import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  availableQuantity: number;
  inStock: boolean;
  imageUrl?: string;
  category?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}`);
  }

  checkAvailability(productId: string, quantity: number): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(
      `${this.apiUrl}/products/${productId}/availability/${quantity}`
    );
  }
}
