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

  getRegistrations(
    page = 0,
    size = 10,
    filters: { nome?: string; email?: string; somenteCompletos?: boolean } = {}
  ): Observable<any> {
    const params: any = {
      page: page.toString(),
      size: size.toString(),
      somenteCompletos: filters.somenteCompletos ?? false,
      sort: 'completeName,asc',
    };

    if (filters.nome) params.nome = filters.nome;
    if (filters.email) params.email = filters.email;

    return this.http.get<any>(`${this.apiUrl}management/pre-inscricoes`, { params });
  }
  makePreRegistration(payload: IPreRegistration): Observable<IPreRegistrationResponse> {
    return this.http.post<IPreRegistrationResponse>(`${this.apiUrl}pre-inscricao/inicial`, payload);
  }

  completeRegistration(payload: FormData, token: string): Observable<any> {
    return this.http.put(`${this.apiUrl}pre-inscricao/continuar/${token}`, payload, { responseType: 'text' });
  }

  verifyPreRegistration(token: string): Observable<IPreRegistration> {
    return this.http.get<IPreRegistration>(`${this.apiUrl}pre-inscricao/continuar/${token}`);
  }

  downloadRegistrations(status: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}management/relatorio/pre-inscricoes/pdf`, { responseType: 'blob', params: { status } });
  }
}
