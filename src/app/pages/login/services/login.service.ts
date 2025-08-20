import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly authUrl = environment.authUrl;
  private readonly resetPasswordUrl = `https://c3851dc25a03.ngrok-free.app/`;

  constructor(private readonly httpClient: HttpClient){}

  login (email: string, password: string) {
    return this.httpClient.post<{ token: string }>(`${this.authUrl}/login`, {email, password});
  }
  forgotPassword(email: string): Observable<string> {
    return this.httpClient.post(`${this.resetPasswordUrl}auth/forgot-password`, 
      { email }, 
      { responseType: 'text' }
    );
  }
 
  validateResetToken(token: string): Observable<any> {
    return this.httpClient.get(`${this.resetPasswordUrl}auth/reset-password/${token}`, 
      { responseType: 'text' }
    );
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    return this.httpClient.put(`${this.resetPasswordUrl}auth/reset-password/${token}`, 
      { newPassword }, 
      { responseType: 'text' }
    );
  }
}
