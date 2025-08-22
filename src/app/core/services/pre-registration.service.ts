import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IPreRegistration } from '../interfaces/pre-registration.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPreRegistrationResponse } from '../interfaces/pre-registration.interface';

@Injectable({
  providedIn: 'root'
})
export class PreRegistrationService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  // Headers padrão para todas as requisições
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': '1',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'User-Agent': 'Mozilla/5.0 (compatible; JovensEmpreendedores/1.0)'
    });
  }

  // Headers específicos para FormData
  private getFormDataHeaders(): HttpHeaders {
    return new HttpHeaders({
      'ngrok-skip-browser-warning': '1',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'User-Agent': 'Mozilla/5.0 (compatible; JovensEmpreendedores/1.0)'
      // Não adiciona Content-Type para FormData - deixa o browser definir
    });
  }

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

    return this.http.get<any>(`${this.apiUrl}management/pre-inscricoes`, { 
      params,
      headers: this.getHeaders()
    });
  }

  makePreRegistration(payload: IPreRegistration): Observable<IPreRegistrationResponse> {
    return this.http.post<IPreRegistrationResponse>(`${this.apiUrl}pre-inscricao/inicial`, payload, {
      headers: this.getHeaders()
    });
  }

  completeRegistration(payload: FormData, token: string): Observable<any> {
    return this.http.put(`${this.apiUrl}pre-inscricao/continuar/${token}`, payload, { 
      responseType: 'text',
      headers: this.getFormDataHeaders() // Headers específicos para FormData
    });
  }

  verifyPreRegistration(token: string): Observable<IPreRegistration> {
    return this.http.get<IPreRegistration>(`${this.apiUrl}pre-inscricao/continuar/${token}`, {
      headers: this.getHeaders()
    });
  }

  downloadRegistrations(status: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}management/relatorio/pre-inscricoes/pdf`, { 
      responseType: 'blob', 
      params: { status },
      headers: this.getHeaders()
    });
  }

  deleteRegistration(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}pre-inscricao/soft/${id}`, {
      headers: this.getHeaders()
    });
  }
}