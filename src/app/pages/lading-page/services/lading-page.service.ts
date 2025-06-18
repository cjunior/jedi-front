import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class landingPageService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000';


    getdados(): Observable<any> {
        return this.http.get(`${this.apiUrl}/clientes`);
      }
 
}
