import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hero-section bg-primary text-white py-5">
      <div class="container">
        <h1 class="display-4 mb-3">Welcome to eCommerce Store</h1>
        <p class="lead mb-4">Discover amazing products at unbeatable prices</p>
        <a routerLink="/products" class="btn btn-light btn-lg">
          <i class="fas fa-shopping-bag"></i> Start Shopping
        </a>
      </div>
    </div>

    <div class="container mt-5">
      <div class="row mb-5">
        <div class="col-md-4 text-center">
          <div class="feature-box">
            <i class="fas fa-shipping-fast fa-3x text-primary mb-3"></i>
            <h5>Fast Shipping</h5>
            <p>Get your orders delivered quickly and safely</p>
          </div>
        </div>
        <div class="col-md-4 text-center">
          <div class="feature-box">
            <i class="fas fa-lock fa-3x text-primary mb-3"></i>
            <h5>Secure Payment</h5>
            <p>Your payment information is protected</p>
          </div>
        </div>
        <div class="col-md-4 text-center">
          <div class="feature-box">
            <i class="fas fa-undo fa-3x text-primary mb-3"></i>
            <h5>Easy Returns</h5>
            <p>Hassle-free returns within 30 days</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 offset-md-3 text-center">
          <h2 class="mb-4">Featured Products</h2>
          <p class="text-muted mb-4">Browse our latest collection</p>
          <a routerLink="/products" class="btn btn-primary"> View All Products </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .hero-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .feature-box {
        padding: 20px;
        border-radius: 8px;
        transition: transform 0.3s;
      }
      .feature-box:hover {
        transform: translateY(-5px);
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class HomeComponent {}
