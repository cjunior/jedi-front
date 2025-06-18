import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly authUrl = environment.authUrl;

  constructor(private readonly httpClient: HttpClient){}

  login (email: string, password: string) {
    return this.httpClient.post<{ token: string }>(`${this.authUrl}/login`, {email, password});
  }
}
