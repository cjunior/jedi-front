import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { landingPageService } from '../../services/lading-page.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, TagModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, OnDestroy {
  private readonly landingPageService = inject(landingPageService);

  // Propriedade para armazenar o item atual
  currentMiddleItem: {
    image: string;
    alt: string;
    name: string;
    role: string;
    isInvisible?: boolean;
  } = {
    image: '/igor.jpeg',
    alt: 'Equipe 1',
    name: 'Professor Igor Paim',
    role: 'Coordenador geral',
  };

  items: {
    image: string;
    alt: string;
    name: string;
    role: string;
    isInvisible?: boolean;
  }[] = [
    {
      image: '',
      alt: 'Invisible Start',
      name: 'Invisible Start',
      role: '',
      isInvisible: true,
    }, // Item invisível no início
    {
      image: '/igor.jpeg',
      alt: 'Equipe 1',
      name: 'Professor Igor Paim',
      role: 'Coordenador geral',
    },
      {
      image: '/equipe3.jpeg',
      alt: 'Equipe 3',
      name: 'Professor Gleydson Silva',
      role: 'Coordenador regional',
    },
    {
      image: '/equipe6.jpg',
      alt: 'Equipe 2',
      name: 'Professora Gilmara Oliveira',
      role: 'Coordenadora regional',
    },
     {
      image: '/equipe4.jpg',
      alt: 'Equipe 6',
      name: 'Professora Albene Liz Both',
      role: 'Conteudista',
    },
  
    {
      image: '/equipe5.jpg',
      alt: 'Equipe 4',
      name: 'Professora Amanda Conrado',
      role: 'Conteudista',
    },

    {
      image: '/equipe1.jpeg',
      alt: 'Equipe 4',
      name: 'Professor Éder Oliveira',
      role: 'Conteudista',
    },
      {
      image: '/eq.jpeg',
      alt: 'Equipe 4',
      name: 'Professora Rejane Santiago',
      role: 'Conteudista',
    },
      {
      image: '/ProfessorSávio.jpeg',
      alt: 'Equipe 4',
      name: 'Professor Sávio Soares',
      role: 'Conteudista',
    },
   
    {
      image: '/equipe2.jpeg',
      alt: 'Equipe 5',
      name: 'Professor Weliton Araújo',
      role: 'Conteudista',
    },
    {
      image: '',
      alt: 'Invisible End',
      name: 'Invisible End',
      role: '',
      isInvisible: true,
    }, 
  ];

  currentPage = 0;
  currentNumVisible = 3;
  isAutoplayPaused = false;
  isAutoplayPermanentlyPaused = false;

  responsiveOptions = [
    {
      breakpoint: '1200px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '480px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  ngOnInit() {
    this.updateNumVisible();
    this.updateCurrentMiddleItem();
    window.addEventListener('resize', () => this.updateNumVisible());
  }

  ngOnDestroy() {
    // Cleanup se necessário
  }

  onPageChange(event: any) {
    this.pauseAutoplayPermanently();

    let targetPage = event.page;
    const visibleItems = this.items.filter((item) => !item.isInvisible);

    if (targetPage >= visibleItems.length) {
      targetPage = targetPage % visibleItems.length;
    }

    this.currentPage = targetPage;
    this.updateCurrentMiddleItem();
  }

  pauseAutoplay() {
    this.isAutoplayPaused = true;
  }

  resumeAutoplay() {
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

  updateCurrentMiddleItem() {
    const visibleItems = this.items.filter((item) => !item.isInvisible);
    let itemIndex = this.currentPage;
    
    if (itemIndex >= visibleItems.length) {
      itemIndex = itemIndex % visibleItems.length;
    }

    const currentItem = visibleItems[itemIndex];
    this.currentMiddleItem = currentItem || visibleItems[0];
  }
}
