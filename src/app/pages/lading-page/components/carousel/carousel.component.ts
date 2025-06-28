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

  items: { image: string; alt: string; name: string; role: string }[] = [
    { image: '/equipe1.jpeg', alt: 'Equipe 1', name: 'Professor Igor Paim', role: 'Coordenador geral' }, 
    { image: '/equipe6.jpg', alt: 'Equipe 2', name: 'Professora Gilmara Oliveira', role: 'Coordenadora regional' },
    { image: '/equipe3.jpeg', alt: 'Equipe 3', name: 'Professor Gleydson Silva', role: 'Coordenador refional' },
    { image: '/equipe5.jpg', alt: 'Equipe 4', name: 'Professora Amanda Conrado', role: 'Conteudista' },
    { image: '/equipe4.jpg', alt: 'Equipe 6', name: 'Professora Albene Liz Both', role: 'Conteudista' },
    { image: '/equipe2.jpeg', alt: 'Equipe 5', name: 'Professor Weliton Araújo', role: 'Conteudista' },
  ];

  currentPage = 0;
  currentNumVisible = 3;
  isAutoplayPaused = false;

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
    this.currentPage = event.page;
  }

  pauseAutoplay() {
    this.isAutoplayPaused = true;
  }

  resumeAutoplay() {
    this.isAutoplayPaused = false;
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
    const startIndex = this.currentPage * this.currentNumVisible;
    let middleIndex;
    
    if (this.currentNumVisible === 1) {
      middleIndex = startIndex; // Se só tem 1, esse é o do meio
    } else if (this.currentNumVisible === 2) {
      middleIndex = startIndex; // Se tem 2, pega o primeiro (ou você pode pegar o segundo com startIndex + 1)
    } else {
      middleIndex = startIndex + 1; // Se tem 3, pega o do meio (índice 1)
    }
    
    return this.items[middleIndex] || this.items[0];
  }

  onPersonClick(item: any, relativeIndex: number) {
    const globalIndex = this.getPersonIndex(item);
    
    if (this.currentNumVisible === 3) {
      // Se clicou na primeira posição (esquerda)
      if (relativeIndex === 0) {
        // Queremos que esta pessoa vá para o meio (posição 1)
        // Então precisamos encontrar a página onde globalIndex - 1 = startIndex
        // startIndex = currentPage * 3, então: globalIndex - 1 = currentPage * 3
        // currentPage = (globalIndex - 1) / 3
        const targetPage = Math.max(0, Math.floor((globalIndex - 1) / 3));
        this.currentPage = targetPage;
        
        // Se é a primeira pessoa (índice 0), ela nunca pode ir para o meio naturalmente
        // Então vamos usar navegação circular: vai para a penúltima página
        if (globalIndex === 0) {
          const totalPages = Math.ceil(this.items.length / 3);
          this.currentPage = Math.max(0, totalPages - 2);
        }
      }
      // Se clicou na última posição (direita)
      else if (relativeIndex === 2) {
        // Queremos que esta pessoa vá para o meio (posição 1)
        const targetPage = Math.floor((globalIndex - 1) / 3);
        const maxPages = Math.ceil(this.items.length / 3) - 1;
        
        if (targetPage <= maxPages) {
          this.currentPage = targetPage;
        } else {
          // Se não consegue ir para o meio, volta para o início
          this.currentPage = 0;
        }
      }
      // Se clicou no meio (relativeIndex === 1), não faz nada
    } else {
      // Para mobile (1 item) ou tablet (2 itens)
      this.currentPage = Math.floor(globalIndex / this.currentNumVisible);
    }
  }

  getPersonIndex(item: any): number {
    return this.items.findIndex(person => person === item);
  }
}