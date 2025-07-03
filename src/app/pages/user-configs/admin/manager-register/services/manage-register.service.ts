import { HttpClient, HttpParams } from '@angular/common/http';
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


  getManagerRegister(page: number = 0, size: number = 10, searchTerm: string = '') {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (searchTerm && searchTerm.trim() !== '') {
      params = params.set('searchTerm', searchTerm.trim());
    }
    
    return this.http.get(`${this.apiUrl}management/users`, { params });
  }

  getManagerRegisterById(id: string) {
    return this.http.get(`${this.apiUrl}management/register/${id}`);
  }
  putManagerRegister(id: string, data: FormData) {
    return this.http.put(`${this.apiUrl}management/register/${id}`, data);
  }
  deleteManagerRegister(id: string) {
    return this.http.delete(`${this.apiUrl}management/register/${id}`);
  }
}
