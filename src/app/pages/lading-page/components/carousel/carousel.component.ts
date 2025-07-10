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

  items: {
    image: string;
    alt: string;
    name: string;
    role: string;
    isInvisible?: boolean;
  }[] = [
    {
      image: '/igor.jpeg',
      alt: 'Equipe 1',
      name: 'Prof. Igor Paim',
      role: 'Coordenador-geral',
    },
    {
      image: '/equipe3.jpeg',
      alt: 'Equipe 3',
      name: 'Prof. Gleydson Silva',
      role: 'Coordenador-regional',
    },
    {
      image: '/equipe6.jpg',
      alt: 'Equipe 2',
      name: 'Prof.ª Gilmara Oliveira',
      role: 'Coordenadora-regional',
    },
    {
      image: '/equipe4.jpg',
      alt: 'Equipe 6',
      name: 'Prof.ª Albene Liz Both',
      role: 'Conteudista',
    },
    {
      image: '/equipe5.jpg',
      alt: 'Equipe 4',
      name: 'Prof.ª Amanda Conrado',
      role: 'Conteudista',
    },
    {
      image: '/equipe1.jpeg',
      alt: 'Equipe 4',
      name: 'Prof. Eder Oliveira',
      role: 'Conteudista',
    },
    {
      image: '/eq.jpeg',
      alt: 'Equipe 4',
      name: 'Prof.ª Rejane Santiago',
      role: 'Conteudista',
    },
    {
      image: '/ProfessorSávio.jpeg',
      alt: 'Equipe 4',
      name: 'Prof. Sávio Soares',
      role: 'Conteudista',
    },
    {
      image: '/equipe2.jpeg',
      alt: 'Equipe 5',
      name: 'Prof. Weliton Araújo',
      role: 'Conteudista',
    },
  ];

  itemsLooped: typeof this.items = [];
  currentMiddleItem = this.items[0];

  get displayItems() {
    return this.itemsLooped;
  }

  currentPage = 0;
  currentNumVisible = 3;
  isAutoplayPaused = false;
  isAutoplayPermanentlyPaused = false;
  autoplayIntervalId: any = null;

  responsiveOptions = [
    {
      breakpoint: '1200px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '1000px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '770px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  ngOnInit() {
    this.updateNumVisible();
    this.itemsLooped = this.createInfiniteItems(this.items);
    this.updateCurrentMiddleItem();
    window.addEventListener('resize', this.handleResize);
    this.startAutoplay();
  }

  ngOnDestroy() {
    if (this.autoplayIntervalId) {
      clearInterval(this.autoplayIntervalId);
    }
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.updateNumVisible();
    this.updateCurrentMiddleItem();
  };

  createInfiniteItems(items: typeof this.items): typeof this.items {
    const loops = 4; // número de repetições para parecer "infinito"
    let repeated: typeof this.items = [];
    for (let i = 0; i < loops; i++) {
      repeated = repeated.concat(items.map(item => ({ ...item })));
    }
    return repeated;
  }

  onPageChange(event: any) {
    this.pauseAutoplayPermanently();
    this.updateNumVisible();

    let targetPage = event.page;

    if (targetPage >= this.displayItems.length) {
      targetPage = 0;
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

  startAutoplay() {
    this.autoplayIntervalId = setInterval(() => {
      if (!this.isAutoplayPaused && !this.isAutoplayPermanentlyPaused) {
        this.currentPage = (this.currentPage + 1) % this.displayItems.length;
        this.updateCurrentMiddleItem();
      }
    }, 3000); // tempo entre trocas
  }

  updateNumVisible() {
    const width = window.innerWidth;
    const previousNumVisible = this.currentNumVisible;

    this.currentNumVisible = width <= 1000 ? 1 : 3;

    if (previousNumVisible !== this.currentNumVisible) {
      this.currentPage = 0;
    }
  }

  updateCurrentMiddleItem() {
    const currentDisplayItems = this.displayItems;

    if (currentDisplayItems.length === 0) return;

    if (this.currentPage >= currentDisplayItems.length) {
      this.currentPage = 0;
    }

    const middleIndex = this.currentNumVisible === 3 ? this.currentPage + 1 : this.currentPage;

    if (middleIndex < currentDisplayItems.length) {
      this.currentMiddleItem = currentDisplayItems[middleIndex];
    }
  }
}
