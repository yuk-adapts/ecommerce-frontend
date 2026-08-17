import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/api/cart`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}`).pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  addToCart(productId: string, quantity: number): Observable<Cart> {
    return this.http
      .post<Cart>(`${this.apiUrl}/items`, { productId, quantity })
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  removeFromCart(productId: string): Observable<Cart> {
    return this.http
      .delete<Cart>(`${this.apiUrl}/items/${productId}`)
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  updateQuantity(productId: string, quantity: number): Observable<Cart> {
    return this.http
      .put<Cart>(`${this.apiUrl}/items/${productId}`, { quantity })
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`).pipe(tap(() => this.cartSubject.next(null)));
  }

  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }

  private loadCart(): void {
    this.getCart().subscribe({
      error: () => this.cartSubject.next(null),
    });
  }
}
