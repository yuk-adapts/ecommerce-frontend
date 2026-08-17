import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: string;
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

export interface PaymentResponse {
  transactionId: string;
  status: string;
  amount: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/api/payments`;

  constructor(private http: HttpClient) {}

  processPayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}`, request);
  }

  getPaymentStatus(transactionId: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/${transactionId}`);
  }

  getSupportedPaymentMethods(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/methods`);
  }
}
