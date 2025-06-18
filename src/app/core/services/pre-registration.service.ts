import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IPreRegistration } from '../interfaces/pre-registration.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPreRegistrationResponse } from '../interfaces/pre-registration.interface';

@Injectable({
  providedIn: 'root'
})
export class PreRegistrationService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient)

  makePreRegistration(payload: IPreRegistration): Observable<IPreRegistrationResponse> {
    return this.http.post<IPreRegistrationResponse>(`${this.apiUrl}pre-inscricao/inicial`, payload);
  }

  verifyPreRegistration(token: string): Observable<IPreRegistration> {
    return this.http.get<IPreRegistration>(`${this.apiUrl}pre-inscricao/continuar/${token}`);
  }
}
