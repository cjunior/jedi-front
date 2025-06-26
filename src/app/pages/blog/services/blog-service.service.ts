import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import type { IPost, IBlogResponse } from '../../../core/interfaces/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogServiceService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient)

  private posts$ = new BehaviorSubject<IPost[]>([]);

  get getPosts$(): Observable<IPost[]> {
    return this.posts$.asObservable();
  }

  getPosts() {
    this.http.get<IBlogResponse>(`${this.apiUrl}blog-section/get`).subscribe({
      next: (response) => {
        this.posts$.next(response.items);
      },
      error: (error) => {
        console.error('Erro ao buscar posts do blog:', error);
      }
    })
  }

  getUniquePost(id: number): Observable<IPost> {
    return this.http.get<IPost>(`${this.apiUrl}blog-section/item/${id}`);
  }

  createPost(payload: FormData) {
    return this.http.post(`${this.apiUrl}blog-section/item`, payload, { responseType: 'text' });
  }

  updatePost(id: number, payload: FormData) {
    return this.http.put(`${this.apiUrl}blog-section/item/${id}`, payload, { responseType: 'text' });
  }

  deletePost(id: number) {
    return this.http.delete(`${this.apiUrl}blog-section/item/${id}`, { responseType: 'text' });
  }
}
