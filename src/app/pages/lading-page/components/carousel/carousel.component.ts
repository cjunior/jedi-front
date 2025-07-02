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
export class CarouselComponent implements OnInit {
  private readonly landingPageService = inject(landingPageService);
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

  get displayItems() {
    if (this.currentNumVisible === 3) {
      return this.items;
    } else {
      return this.items.filter(item => !item.isInvisible);
    }
  }

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
    },
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
      breakpoint: '770px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  ngOnInit() {
    this.updateNumVisible();
    this.updateCurrentMiddleItem();
    window.addEventListener('resize', () => {
      this.updateNumVisible();
      this.updateCurrentMiddleItem();
    });
  }



  onPageChange(event: any) {
    this.pauseAutoplayPermanently();

    this.updateNumVisible();

    let targetPage = event.page;

    if (this.currentNumVisible === 3) {
      const totalItems = this.items.length;
      if (targetPage >= totalItems) {
        targetPage = targetPage % totalItems;
      }
    } else {
      const visibleItemsCount = this.displayItems.length;
      if (targetPage >= visibleItemsCount) {
        targetPage = targetPage % visibleItemsCount;
      }
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
    const previousNumVisible = this.currentNumVisible;

    if (width <= 770) {
      this.currentNumVisible = 1;
    } else {
      this.currentNumVisible = 3;
    }

    if (previousNumVisible !== this.currentNumVisible) {
      this.currentPage = 0;
    }
  }

  updateCurrentMiddleItem() {
    const currentDisplayItems = this.displayItems;

    if (currentDisplayItems.length === 0) {
      return;
    }

    if (this.currentPage >= currentDisplayItems.length) {
      this.currentPage = 0;
    }

    if (this.currentNumVisible === 3) {
      const allItems = this.items;
      const startIndex = this.currentPage;
      const middleIndex = startIndex + 1;

      if (middleIndex < allItems.length && !allItems[middleIndex].isInvisible) {
        this.currentMiddleItem = allItems[middleIndex];
      } else {
        const visibleItems = allItems.filter(item => !item.isInvisible);
        if (visibleItems.length > 0) {
          this.currentMiddleItem = visibleItems[this.currentPage % visibleItems.length];
        }
      }
    } else {
      this.currentMiddleItem = currentDisplayItems[this.currentPage];
    }
  }
}
