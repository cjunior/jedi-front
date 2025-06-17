import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly router = inject(Router)

  login(token: string) {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }
}
