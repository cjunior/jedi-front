import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { IBanner } from '../interfaces/banner.interface';

@Injectable({
  providedIn: 'root'
})
export class BannerMultiploService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getBanners(): Observable<IBanner[]> {
    return this.http.get<IBanner[]>(`${this.apiUrl}bannermultiplo`);
  }

  getBannerById(id: number): Observable<IBanner> {
    return this.http.get<IBanner>(`${this.apiUrl}bannermultiplo/${id}`);
  }

  createBanner(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}bannermultiplo`, formData, {
      responseType: 'text'
    });
  }

  updateBanner(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}bannermultiplo/${id}`, formData, {
      responseType: 'text'
    });
  }

  deleteBanner(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}bannermultiplo/${id}`, {
      responseType: 'text'
    });
  }

  updateBannersOrder(orderedIds: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}bannermultiplo/order`, {
      orderedIds
    }, {
      responseType: 'text',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
