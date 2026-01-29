import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pasta, Arquivo } from '../../pages/results/results-data';

@Injectable({
  providedIn: 'root'
})
export class PastaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Pastas
  getPastas(parentId?: number | null): Observable<Pasta[]> {
    const params: any = {};
    if (parentId !== undefined && parentId !== null) {
      params.parentId = parentId.toString();
    }
    return this.http.get<Pasta[]>(`${this.apiUrl}pastas`, { params });
  }

  getPastaById(pastaId: number): Observable<Pasta> {
    return this.http.get<Pasta>(`${this.apiUrl}pastas/${pastaId}`);
  }

  createPasta(nome: string, parentId: number | null = null, slug?: string, descricao?: string): Observable<Pasta> {
    const body: any = { nome, parentId };
    if (slug) {
      body.slug = slug;
    }
    if (descricao) {
      body.descricao = descricao;
    }
    return this.http.post<Pasta>(`${this.apiUrl}pastas`, body);
  }

  updatePasta(pastaId: number, nome: string, slug?: string, descricao?: string): Observable<Pasta> {
    const body: any = { nome };
    if (slug !== undefined) {
      body.slug = slug;
    }
    if (descricao !== undefined) {
      body.descricao = descricao;
    }
    return this.http.put<Pasta>(`${this.apiUrl}pastas/${pastaId}`, body);
  }

  deletePasta(pastaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}pastas/${pastaId}`);
  }

  // Arquivos
  getArquivosByPasta(pastaId: number): Observable<Arquivo[]> {
    return this.http.get<Arquivo[]>(`${this.apiUrl}pastas/${pastaId}/arquivos`);
  }

  uploadArquivos(pastaId: number, files: File[], nomes: string[]): Observable<Arquivo[]> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('files', file);
      formData.append('nomes', nomes[index] || file.name);
    });

    return this.http.post<Arquivo[]>(`${this.apiUrl}pastas/${pastaId}/arquivos`, formData);
  }

  getArquivoById(arquivoId: number): Observable<Arquivo> {
    return this.http.get<Arquivo>(`${this.apiUrl}pastas/arquivos/${arquivoId}`);
  }

  updateArquivo(arquivoId: number, nome: string): Observable<Arquivo> {
    return this.http.put<Arquivo>(`${this.apiUrl}pastas/arquivos/${arquivoId}`, { nome });
  }

  deleteArquivo(arquivoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}pastas/arquivos/${arquivoId}`);
  }
}
