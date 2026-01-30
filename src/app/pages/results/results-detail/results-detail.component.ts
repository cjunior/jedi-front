import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Arquivo, Pasta } from '../results-data';
import { environment } from '../../../../environments/environment';
import { slugToId, generateSlugFromNome } from '../../../core/utils/slug-helper';

@Component({
  selector: 'app-results-detail',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './results-detail.component.html',
  styleUrl: './results-detail.component.scss'
})
export class ResultsDetailComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  protected showBackToTop = signal(false);
  protected isMobileMenuOpen = signal(false);
  protected loadingFile = signal<number | null>(null);
  protected pastaNome = signal<string>('');
  protected pastaDescricao = signal<string | undefined>(undefined);
  protected arquivos = signal<Arquivo[]>([]);
  protected pastaId = signal<number | null>(null);
  protected loading = signal(false);
  protected error = signal<string | null>(null);
  private allPastas = signal<Pasta[]>([]);

  ngOnInit(): void {
    this.loadAllPastas().then(() => {
      this.route.paramMap.subscribe(params => {
        const pastaParam = params.get('pastaId');
        if (pastaParam) {
          const pastaId = this.resolvePastaId(pastaParam);
          if (pastaId) {
            this.pastaId.set(pastaId);
            this.loadPastaData(pastaId);
          } else {
            this.router.navigate(['/resultados']);
          }
        } else {
          this.router.navigate(['/resultados']);
        }
      });
    });

    window.addEventListener('scroll', () => {
      this.showBackToTop.set(window.pageYOffset > 300);
    });
  }

  private async loadAllPastas(): Promise<void> {
    try {
      const pastas = await firstValueFrom(
        this.http.get<Pasta[]>(`${this.apiUrl}pastas`)
      );
      this.allPastas.set(pastas || []);
    } catch (error) {
      console.error('Erro ao carregar pastas para lookup:', error);
    }
  }

  private resolvePastaId(param: string): number | null {
    const numericId = parseInt(param, 10);
    if (!isNaN(numericId)) {
      return numericId;
    }

    const pastas = this.allPastas();
    const pasta = pastas.find(p => 
      p.slug === param || 
      generateSlugFromNome(p.nome) === param
    );
    
    return pasta?.id || null;
  }

  async loadPastaData(pastaId: number): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);

      const pasta = await firstValueFrom(
        this.http.get<Pasta>(`${this.apiUrl}pastas/${pastaId}`)
      );
      
      this.pastaNome.set(pasta.nome);
      this.pastaDescricao.set(pasta.descricao ?? undefined);

      const arquivos = await firstValueFrom(
        this.http.get<Arquivo[]>(`${this.apiUrl}pastas/${pastaId}/arquivos`)
      );
      
      const arquivosConvertidos = arquivos || [];
      
      const arquivosOrdenados = arquivosConvertidos.sort((a, b) => {
        const dateA = new Date(a.uploadedAt).getTime();
        const dateB = new Date(b.uploadedAt).getTime();
        return dateB - dateA;
      });
      
      this.arquivos.set(arquivosOrdenados);
    } catch (error) {
      console.error('Erro ao carregar dados da pasta:', error);
      this.error.set('Erro ao carregar dados da pasta. Tente novamente mais tarde.');
    } finally {
      this.loading.set(false);
    }
  }

  redirectToInitialPage(): void {
    this.router.navigate(['/']);
  }

  redirectToResults(): void {
    this.router.navigate(['/resultados']);
  }

  toggleMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewFile(arquivo: Arquivo): void {
    if (arquivo.url) {
      window.open(arquivo.url, '_blank');
    }
  }

  async downloadFile(arquivo: Arquivo): Promise<void> {
    if (!arquivo.url) {
      return;
    }

    try {
      this.loadingFile.set(arquivo.id);
      
      const blob = await firstValueFrom(
        this.http.get(arquivo.url, {
          responseType: 'blob'
        })
      );
      
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = arquivo.nome;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
    } finally {
      this.loadingFile.set(null);
    }
  }
}
