import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ResultFile } from '../results-data';
import { resultsData, slugToCategory } from '../results-data';

@Component({
  selector: 'app-results-detail',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent
  ],
  templateUrl: './results-detail.component.html',
  styleUrl: './results-detail.component.scss'
})
export class ResultsDetailComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  protected showBackToTop = signal(false);
  protected isMobileMenuOpen = signal(false);
  protected loadingFile = signal<number | null>(null);
  protected categoryName = signal<string>('');
  protected files = signal<ResultFile[]>([]);
  protected categorySlug = signal<string>('');

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.categorySlug.set(slug);
        this.loadCategoryData(slug);
      }
    });

    window.addEventListener('scroll', () => {
      this.showBackToTop.set(window.pageYOffset > 300);
    });
  }

  private loadCategoryData(slug: string): void {
    const categoryName = slugToCategory[slug];
    if (categoryName) {
      this.categoryName.set(categoryName);
      const files = resultsData[slug] || [];
      this.files.set(files);
    } else {
      // Categoria não encontrada, redirecionar
      this.router.navigate(['/resultados']);
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

  viewFile(file: ResultFile): void {
    if (file.fileUrl && file.fileUrl !== '#') {
      window.open(file.fileUrl, '_blank');
    }
  }

  async downloadFile(file: ResultFile): Promise<void> {
    if (!file.fileUrl || file.fileUrl === '#') {
      return;
    }

    try {
      this.loadingFile.set(file.id);
      
      // Fazer requisição para obter o arquivo como blob
      const blob = await firstValueFrom(this.http.get(file.fileUrl, { responseType: 'blob' }));
      
      if (blob) {
        // Criar URL temporária para o blob
        const url = window.URL.createObjectURL(blob);
        
        // Criar elemento <a> temporário para download
        const link = document.createElement('a');
        link.href = url;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        
        // Limpar
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
