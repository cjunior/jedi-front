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
    return this.http.get<IBanner[]>(`${this.apiUrl}bannermultiplo`, {
      headers: {
        'ngrok-skip-browser-warning': '1'
      }
    });
  }

  getBannerById(id: number): Observable<IBanner> {
    return this.http.get<IBanner>(`${this.apiUrl}bannermultiplo/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': '1'
      }
    });
  }

  createBanner(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}bannermultiplo`, formData, {
      responseType: 'text',
      headers: {
        'ngrok-skip-browser-warning': '1'
      }
    });
  }

  updateBanner(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}bannermultiplo/${id}`, formData, {
      responseType: 'text',
      headers: {
        'ngrok-skip-browser-warning': '1'
      }
    });
  }

  deleteBanner(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}bannermultiplo/${id}`, {
      responseType: 'text',
      headers: {
        'ngrok-skip-browser-warning': '1'
      }
    });
  }

  updateBannersOrder(orderedIds: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}bannermultiplo/order`, {
      orderedIds
    }, {
      responseType: 'text',
      headers: {
        'ngrok-skip-browser-warning': '1',
        'Content-Type': 'application/json'
      }
    });
  }
}
