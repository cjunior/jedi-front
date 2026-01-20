import { Component, inject, signal, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BannerMultiploService } from '../../../../core/services/banner-multiplo.service';
import type { IBanner } from '../../../../core/interfaces/banner.interface';

import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdicionarBannerComponent } from './components/adicionar-banner/adicionar-banner.component';
import { EditarBannerComponent } from './components/editar-banner/editar-banner.component';

@Component({
  selector: 'app-manage-banner-multiplo',
  standalone: true,
  templateUrl: './manage-banner-multiplo.component.html',
  styleUrl: './manage-banner-multiplo.component.scss',
  providers: [ConfirmationService, MessageService],
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    PanelModule,
    ToastModule,
    ConfirmDialog,
    DialogModule,
    CommonModule,
    AdicionarBannerComponent,
    EditarBannerComponent
  ]
})
export class ManageBannerMultiploComponent implements OnInit {
  private readonly bannerService = inject(BannerMultiploService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected banners = signal<IBanner[]>([]);
  protected selectedBanner: IBanner | null = null;

  protected showAddBannerModal = false;
  protected showEditBannerModal = false;
  protected showReorderModal = false;
  protected loadingTable = true;
  protected isSavingOrder = false;
  protected reorderBanners: IBanner[] = [];
  protected draggedIndex: number | null = null;
  protected dragOverIndex: number | null = null;
  
  // Variáveis para suporte touch (mobile)
  private touchStartY = 0;
  private touchStartIndex = -1;
  private touchCurrentIndex = -1;
  private touchElement: HTMLElement | null = null;
  private touchClone: HTMLElement | null = null;

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.loadingTable = true;
    this.bannerService.getBanners().subscribe({
      next: (response) => {
        this.banners.set(response);
        this.loadingTable = false;
      },
      error: () => {
        this.loadingTable = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os banners.'
        });
      }
    });
  }

  closeAddBannerModal(): void {
    this.showAddBannerModal = false;
  }

  closeEditBannerModal(): void {
    this.selectedBanner = null;
    this.showEditBannerModal = false;
  }

  onEditBanner(banner: IBanner): void {
    this.selectedBanner = banner;
    this.showEditBannerModal = true;
  }

  onDeleteBanner(event: Event, bannerId: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você tem certeza que deseja excluir este banner?',
      header: 'Aviso',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Apagar', severity: 'danger' },
      accept: () => {
        this.loadingTable = true;
        this.bannerService.deleteBanner(bannerId).subscribe({
          next: () => {
            this.loadBanners();
            this.messageService.add({
              severity: 'success',
              summary: 'Banner excluído',
              detail: 'Banner removido com sucesso.'
            });
          },
          error: () => {
            this.loadingTable = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível excluir o banner.'
            });
          }
        });
      }
    });
  }

  reloadBanners(event: boolean): void {
    if (!event) return;
    this.loadBanners();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Previne loop infinito verificando se já tentou carregar o placeholder
    if (!img.src.includes('data:image')) {
      // Usa uma imagem transparente 1x1 como fallback
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E';
      img.style.opacity = '0.3';
    }
  }

  openReorderModal(): void {
    // Copia os banners para o array de reordenação
    this.reorderBanners = [...this.banners()];
    this.showReorderModal = true;
    this.draggedIndex = null;
    this.dragOverIndex = null;
  }

  closeReorderModal(): void {
    this.showReorderModal = false;
    this.reorderBanners = [];
    this.draggedIndex = null;
    this.dragOverIndex = null;
  }

  onDragStart(event: DragEvent, index: number): void {
    this.draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', index.toString());
    }
    if (event.target) {
      (event.target as HTMLElement).style.opacity = '0.5';
    }
  }

  onDragEnd(event: DragEvent): void {
    if (event.target) {
      (event.target as HTMLElement).style.opacity = '1';
    }
    this.draggedIndex = null;
    this.dragOverIndex = null;
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    
    if (this.draggedIndex !== null && this.draggedIndex !== index) {
      this.dragOverIndex = index;
    }
  }

  onDragLeave(event: DragEvent): void {
    this.dragOverIndex = null;
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    
    if (this.draggedIndex === null || this.draggedIndex === dropIndex) {
      this.dragOverIndex = null;
      return;
    }

    // Reordena os banners
    const draggedBanner = this.reorderBanners[this.draggedIndex];
    const newBanners = [...this.reorderBanners];
    
    // Remove o item da posição original
    newBanners.splice(this.draggedIndex, 1);
    
    // Insere na nova posição
    newBanners.splice(dropIndex, 0, draggedBanner);
    
    this.reorderBanners = newBanners;
    this.draggedIndex = null;
    this.dragOverIndex = null;
  }

  saveNewOrder(): void {
    this.isSavingOrder = true;
    
    const bannerIds = this.reorderBanners.map(b => b.id);
    this.bannerService.updateBannersOrder(bannerIds).subscribe({
      next: () => {
        // Recarrega os banners do backend para garantir que as posições estão atualizadas
        this.loadingTable = true;
        this.bannerService.getBanners().subscribe({
          next: (response) => {
            this.banners.set(response);
            this.loadingTable = false;
            this.isSavingOrder = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Ordem atualizada',
              detail: 'A nova ordem dos banners foi salva com sucesso.'
            });
            this.closeReorderModal();
          },
          error: () => {
            this.loadingTable = false;
            this.isSavingOrder = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'A ordem foi salva, mas não foi possível recarregar os banners.'
            });
            this.closeReorderModal();
          }
        });
      },
      error: () => {
        this.isSavingOrder = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível salvar a nova ordem.'
        });
      }
    });
  }

  // Métodos para suporte touch (mobile)
  onTouchStart(event: TouchEvent, index: number): void {
    // Previne comportamento padrão do touch (scroll, zoom)
    event.preventDefault();
    event.stopPropagation();
    
    const touch = event.touches[0];
    if (!touch) return;
    
    this.touchStartY = touch.clientY;
    this.touchStartIndex = index;
    this.touchCurrentIndex = index;
    this.draggedIndex = index;
    
    const element = event.currentTarget as HTMLElement;
    if (!element) return;
    
    this.touchElement = element;
    element.style.opacity = '0.6';
    element.style.transition = 'none';
    element.style.transform = '';
    
    // Previne scroll durante o arraste
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }

  onTouchMove(event: TouchEvent, index: number): void {
    if (this.touchStartIndex === -1 || !this.touchElement) return;
    
    event.preventDefault();
    event.stopPropagation();
    const touch = event.touches[0];
    const currentY = touch.clientY;
    const deltaY = currentY - this.touchStartY;
    
    // Move visualmente o elemento
    if (this.touchElement) {
      this.touchElement.style.transform = `translateY(${deltaY}px)`;
      this.touchElement.style.zIndex = '1000';
    }
    
    // Calcula qual elemento está sendo sobreposto baseado na posição Y
    const container = this.touchElement.parentElement;
    if (!container) return;
    
    const elements = Array.from(container.children) as HTMLElement[];
    let newIndex = this.touchStartIndex;
    
    // Remove classes anteriores
    elements.forEach(el => {
      if (el !== this.touchElement) {
        el.classList.remove('drag-over');
      }
    });
    
    // Encontra o novo índice baseado na posição Y
    let found = false;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i] === this.touchElement) continue;
      
      const rect = elements[i].getBoundingClientRect();
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      const elementCenter = elementTop + rect.height / 2;
      
      // Se o toque está sobre este elemento
      if (currentY >= elementTop && currentY <= elementBottom) {
        if (currentY < elementCenter) {
          newIndex = i < this.touchStartIndex ? i : i;
          found = true;
          break;
        } else {
          newIndex = i + 1;
          found = true;
          break;
        }
      }
    }
    
    // Se não encontrou nenhum elemento, verifica se está acima ou abaixo da lista
    if (!found) {
      const firstElement = elements.find((el, i) => el !== this.touchElement && i < this.touchStartIndex);
      const lastElement = elements.find((el, i) => el !== this.touchElement && i > this.touchStartIndex);
      
      if (firstElement) {
        const firstRect = firstElement.getBoundingClientRect();
        if (currentY < firstRect.top) {
          newIndex = 0;
        }
      }
      
      if (lastElement) {
        const lastRect = lastElement.getBoundingClientRect();
        if (currentY > lastRect.bottom) {
          newIndex = elements.length - 1;
        }
      }
    }
    
    // Garante que o índice está dentro dos limites válidos
    newIndex = Math.max(0, Math.min(newIndex, elements.length - 1));
    
    // Atualiza apenas se mudou
    if (newIndex !== this.touchCurrentIndex) {
      this.touchCurrentIndex = newIndex;
      
      // Remove indicadores visuais anteriores
      elements.forEach(el => {
        if (el !== this.touchElement) {
          el.style.transform = '';
          el.style.transition = '';
        }
      });
      
      // Adiciona indicadores visuais para os elementos que serão deslocados
      const actualIndex = newIndex > this.touchStartIndex ? newIndex - 1 : newIndex;
      if (actualIndex >= 0 && actualIndex < elements.length && elements[actualIndex] !== this.touchElement) {
        elements[actualIndex].classList.add('drag-over');
        this.dragOverIndex = actualIndex;
      }
      
      // Desloca visualmente os elementos entre a posição inicial e final
      const startIdx = Math.min(this.touchStartIndex, newIndex);
      const endIdx = Math.max(this.touchStartIndex, newIndex);
      
      for (let i = startIdx; i <= endIdx; i++) {
        if (i === this.touchStartIndex) continue;
        
        const element = elements[i];
        if (!element) continue;
        
        if (newIndex > this.touchStartIndex) {
          // Movendo para baixo
          if (i > this.touchStartIndex && i <= newIndex) {
            element.style.transform = 'translateY(-100%)';
            element.style.transition = 'transform 0.15s ease-out';
          }
        } else {
          // Movendo para cima
          if (i >= newIndex && i < this.touchStartIndex) {
            element.style.transform = 'translateY(100%)';
            element.style.transition = 'transform 0.15s ease-out';
          }
        }
      }
    }
  }

  onTouchEnd(event: TouchEvent, index: number): void {
    if (this.touchStartIndex === -1 || !this.touchElement) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    // Restaura scroll do body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    
    const container = this.touchElement.parentElement;
    if (!container) {
      this.resetTouchState();
      return;
    }
    
    const elements = Array.from(container.children) as HTMLElement[];
    
    // Aplica a reordenação se houve mudança
    if (this.touchCurrentIndex !== this.touchStartIndex && this.touchCurrentIndex !== -1 && this.touchCurrentIndex >= 0) {
      const draggedBanner = this.reorderBanners[this.touchStartIndex];
      const newBanners = [...this.reorderBanners];
      
      newBanners.splice(this.touchStartIndex, 1);
      const finalIndex = this.touchCurrentIndex > this.touchStartIndex ? this.touchCurrentIndex - 1 : this.touchCurrentIndex;
      newBanners.splice(finalIndex >= 0 ? finalIndex : 0, 0, draggedBanner);
      
      this.reorderBanners = newBanners;
    }
    
    // Restaura todos os elementos visualmente
    elements.forEach(el => {
      el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
      el.style.transform = '';
      el.style.zIndex = '';
      el.style.opacity = '';
      el.classList.remove('drag-over');
    });
    
    // Reset após um pequeno delay para animação suave
    setTimeout(() => {
      this.resetTouchState();
    }, 200);
  }

  private resetTouchState(): void {
    if (this.touchElement) {
      this.touchElement.style.opacity = '1';
      this.touchElement.style.transform = '';
      this.touchElement.style.zIndex = '';
      this.touchElement.style.transition = '';
    }
    
    this.touchElement = null;
    this.draggedIndex = null;
    this.dragOverIndex = null;
    this.touchStartIndex = -1;
    this.touchCurrentIndex = -1;
    this.touchStartY = 0;
  }

  onTouchCancel(event: TouchEvent): void {
    if (this.touchStartIndex === -1) return;
    event.preventDefault();
    event.stopPropagation();
    
    // Restaura scroll do body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    
    // Restaura elementos visuais
    const currentTarget = event.currentTarget as HTMLElement;
    if (currentTarget) {
      const container = currentTarget.parentElement;
      if (container) {
        const elements = Array.from(container.children) as HTMLElement[];
        elements.forEach(el => {
          el.style.transition = '';
          el.style.transform = '';
          el.style.zIndex = '';
          el.style.opacity = '';
          el.classList.remove('drag-over');
        });
      }
    }
    
    this.resetTouchState();
  }
}
