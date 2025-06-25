import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { IBlogResponse } from '../../../core/interfaces/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogServiceService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient)

  getPosts(): Observable<IBlogResponse> {
    return this.http.get<IBlogResponse>(`${this.apiUrl}blog-section/get`);
  }
}
