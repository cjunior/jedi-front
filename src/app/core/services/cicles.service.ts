import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type { ICicleResponse, ICicle, ICurrentCicleResponse } from '../interfaces/ciclies.interface';

@Injectable({ providedIn: 'root' })
export class CiclesService {
  private readonly http = inject(HttpClient);
  private readonly environment = environment;

  getCicles(): Observable<ICicleResponse[]> {
    return this.http.get<ICicleResponse[]>(`${this.environment.apiUrl}management/ciclo`);
  }

  getCurrentCicle(): Observable<ICurrentCicleResponse> {
    return this.http.get<ICurrentCicleResponse>(`${this.environment.apiUrl}management/ciclo/municipios-ativos`, {
      headers: { 'ngrok-skip-browser-warning': '1' }
    });
  }

  createCicle(cicle: ICicle): Observable<ICicleResponse> {
    return this.http.post<ICicleResponse>(`${this.environment.apiUrl}management/ciclo`, cicle);
  }

  updateCicle(id: string, cicle: ICicle): Observable<ICicleResponse> {
    return this.http.put<ICicleResponse>(`${this.environment.apiUrl}management/ciclo/${id}`, cicle);
  }

  deleteCicle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.environment.apiUrl}management/ciclo/${id}`);
  }

}
