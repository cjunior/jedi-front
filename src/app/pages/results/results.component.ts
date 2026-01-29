import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Pasta } from './results-data';
import { environment } from '../../../environments/environment';
import { generateSlugFromNome } from '../../core/utils/slug-helper';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  protected showBackToTop = signal(false);
  protected isMobileMenuOpen = signal(false);
  protected pastas = signal<Pasta[]>([]);
  protected loading = signal(false);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPastas();
    
    window.addEventListener('scroll', () => {
      this.showBackToTop.set(window.pageYOffset > 300);
    });
  }

  async loadPastas(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      
      const pastas = await firstValueFrom(
        this.http.get<Pasta[]>(`${this.apiUrl}pastas`)
      );
      
      const pastasRaiz = (pastas || []).filter(p => !p.parentId || p.parentId === 0);
      const pastasOrdenadas = pastasRaiz.sort((a, b) => b.id - a.id);
      this.pastas.set(pastasOrdenadas);
    } catch (error) {
      console.error('Erro ao carregar pastas:', error);
      this.error.set('Erro ao carregar pastas. Tente novamente mais tarde.');
    } finally {
      this.loading.set(false);
    }
  }

  navigateToPasta(pasta: Pasta): void {
    const routeParam = pasta.slug || generateSlugFromNome(pasta.nome) || pasta.id.toString();
    this.router.navigate(['/resultados', routeParam]);
  }

  redirectToInitialPage(): void {
    this.router.navigate(['/']);
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
}
