import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { landingPageService } from '../../services/lading-page.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, TagModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  private readonly landingPageService = inject(landingPageService);

  items: { image: string; alt: string; name: string; role: string; isInvisible?: boolean }[] = [
    { image: '', alt: 'Invisible Start', name: 'Invisible Start', role: '', isInvisible: true }, // Item invisível no início
    { image: '/equipe1.jpeg', alt: 'Equipe 1', name: 'Professor Igor Paim', role: 'Coordenador geral' }, 
    { image: '/equipe6.jpg', alt: 'Equipe 2', name: 'Professora Gilmara Oliveira', role: 'Coordenadora regional' },
    { image: '/equipe3.jpeg', alt: 'Equipe 3', name: 'Professor Gleydson Silva', role: 'Coordenador refional' },
    { image: '/equipe5.jpg', alt: 'Equipe 4', name: 'Professora Amanda Conrado', role: 'Conteudista' },
    { image: '/equipe4.jpg', alt: 'Equipe 6', name: 'Professora Albene Liz Both', role: 'Conteudista' },
    { image: '/equipe2.jpeg', alt: 'Equipe 5', name: 'Professor Weliton Araújo', role: 'Conteudista' },
    { image: '', alt: 'Invisible End', name: 'Invisible End', role: '', isInvisible: true }, // Item invisível no fim
  ];

  currentPage = 0;
  currentNumVisible = 3;
  isAutoplayPaused = false;
  isAutoplayPermanentlyPaused = false;

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  ngOnInit() {
    this.updateNumVisible();
    window.addEventListener('resize', () => this.updateNumVisible());
  }

  onPageChange(event: any) {
    console.log('Page change detected - stopping autoplay permanently');
    
    // Para o autoplay permanentemente quando usuário navega manualmente (setas)
    this.pauseAutoplayPermanently();
    
    // Ajusta a página para pular itens invisíveis
    let targetPage = event.page;
    const visibleItems = this.items.filter(item => !item.isInvisible);
    
    // Garante que não ultrapasse o número de itens visíveis
    if (targetPage >= visibleItems.length) {
      targetPage = targetPage % visibleItems.length;
    }
    
    this.currentPage = targetPage;
    
    console.log('Manual navigation to page:', targetPage, 'Autoplay permanently stopped:', this.isAutoplayPermanentlyPaused);
  }

  pauseAutoplay() {
    this.isAutoplayPaused = true;
  }

  resumeAutoplay() {
    // Só retoma se não foi pausado permanentemente
    if (!this.isAutoplayPermanentlyPaused) {
      this.isAutoplayPaused = false;
    }
  }

  pauseAutoplayPermanently() {
    this.isAutoplayPermanentlyPaused = true;
    this.isAutoplayPaused = true;
  }

  updateNumVisible() {
    const width = window.innerWidth;
    if (width <= 768) {
      this.currentNumVisible = 1;
    } else if (width <= 1024) {
      this.currentNumVisible = 2;
    } else {
      this.currentNumVisible = 3;
    }
  }

  getCurrentMiddleItem() {
    // Filtra apenas os itens visíveis
    const visibleItems = this.items.filter(item => !item.isInvisible);
    
    // Lógica simples: pega o item baseado na página atual
    // Página 0 = Igor (índice 0), Página 1 = Gilmara (índice 1), etc.
    let itemIndex = this.currentPage;
    
    // Se ultrapassar o array, volta ao início
    if (itemIndex >= visibleItems.length) {
      itemIndex = itemIndex % visibleItems.length;
    }
    
    const currentItem = visibleItems[itemIndex];
    
    console.log('Page:', this.currentPage, 'ItemIndex:', itemIndex, 'Person:', currentItem?.name);
    console.log('Visible items:', visibleItems.map((item, index) => `${index}: ${item.name}`));
    
    return currentItem || visibleItems[0];
  }
}