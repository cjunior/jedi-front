import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class editService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;


    getdados(): Observable<any> {
        return this.http.get(`${this.apiUrl}loadlandpage/get`);
      }
      
      putdados(formData: FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}loadlandpage/update-all`, formData);
      }
 
}
