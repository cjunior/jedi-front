import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageRegisterService {

  private readonly apiUrl = environment.apiUrl; 
  private readonly http = inject(HttpClient);

  postManagerRegister(data: FormData) {
    return this.http.post(`${this.apiUrl}management/register`, data);
  }
}
