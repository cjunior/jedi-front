import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class formPageService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;


postcontact(payload: any): Observable<any> {
  const formData = new FormData();
  Object.keys(payload).forEach(key => {
    formData.append(key, payload[key]);
  });
  return this.http.post(`${this.apiUrl}contact/email`, formData,  { responseType: 'text' });
}
 
}
