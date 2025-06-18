import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class landingPageService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;


    getdados(): Observable<any> {
        return this.http.get(`${this.apiUrl}loadlandpage/get`);
      }
 
}
