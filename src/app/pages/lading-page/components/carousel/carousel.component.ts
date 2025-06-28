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
    { image: '/equipe1.jpeg', alt: 'Equipe 1', name: 'Nome 1', role: 'Desenvolvedor Frontend' },
    { image: '/equipe2.jpeg', alt: 'Equipe 2', name: 'Nome 2', role: 'Designer UX/UI' },
    { image: '/equipe3.jpeg', alt: 'Equipe 3', name: 'Nome 3', role: 'Gerente de Projeto' },
    { image: '/equipe4.jpg', alt: 'Equipe 4', name: 'Nome 4', role: 'Desenvolvedor Backend' },
    { image: '/equipe6.jpg', alt: 'Equipe 6', name: 'Nome 6', role: 'Marketing Digital' },
    { image: '/equipe5.jpg', alt: 'Equipe 5', name: 'Nome 5', role: 'Analista de Dados' },
  ];

  currentPage = 0;
  itemsPerPage = 3;

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
    this.updateCurrentPage();
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
  }

  updateCurrentPage() {
    // Método para atualizar a página atual quando necessário
  }

  isMiddleItem(index: number): boolean {
    const startIndex = this.currentPage * this.itemsPerPage;
    const middleIndex = startIndex + Math.floor(this.itemsPerPage / 2);
    return index === middleIndex;
  }

  getCurrentMiddleItem() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const middleIndex = startIndex + Math.floor(this.itemsPerPage / 2);
    return this.items[middleIndex];
  }
}
