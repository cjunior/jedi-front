import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ResultFile } from './results-data';

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
export class ResultsComponent {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  protected showBackToTop = signal(false);
  protected isMobileMenuOpen = signal(false);
  protected loadingFile = signal<number | null>(null);

  // Lista de arquivos PDF
  protected files: ResultFile[] = [
    {
      id: 1,
      title: 'Lista de cadastro de reserva - Jovens Empreendedores Digitais - Fortaleza - Turmas 1 e 2',
      fileName: 'Lista de cadastro de reserva - Jovens Empreendedores Digitais - Fortaleza.pdf',
      fileUrl: '/Lista de cadastro de reserva - Jovens Empreendedores Digitais - Fortaleza.pdf',
      category: 'Resultados | Fortaleza - Ceará'
    },
    {
      id: 2,
      title: 'Lista de classificados - Jovens Empreendedores Digitais - Fortaleza - Turmas 1 e 2',
      fileName: 'Lista de classificados - Jovens Empreendedores Digitais - Fortaleza.pdf',
      fileUrl: '/Lista de classificados - Jovens Empreendedores Digitais - Fortaleza.pdf',
      category: 'Resultados | Fortaleza - Ceará'
    },
    {
      id: 3,
      title: 'Lista de indeferidos - Jovens Empreendedores Digitais - Fortaleza - Turmas 1 e 2',
      fileName: 'Lista de indeferidos - Jovens Empreendedores Digitais - Fortaleza.pdf',
      fileUrl: '/Lista de indeferidos - Jovens Empreendedores Digitais - Fortaleza.pdf',
      category: 'Resultados | Fortaleza - Ceará'
    }
  ];

  constructor() {
    window.addEventListener('scroll', () => {
      this.showBackToTop.set(window.pageYOffset > 300);
    });
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
