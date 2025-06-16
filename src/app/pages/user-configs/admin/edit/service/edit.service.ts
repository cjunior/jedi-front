import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class editService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000';


    getdados(): Observable<any> {
        return this.http.get(`${this.apiUrl}/clientes/1`);
      }
      
      putdados(dados: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/clientes/1`, dados, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
 
}
