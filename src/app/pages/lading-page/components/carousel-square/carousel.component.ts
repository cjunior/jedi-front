import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { landingPageService } from '../../services/lading-page.service';

@Component({
  selector: 'app-carousel-square',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselSquareComponent implements OnInit {
  private readonly landingPageService = inject(landingPageService);

  items = [
    { image: './conteudo.png', alt: 'Banner 1', text: 'Seu Produto na Internet' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Venda Mais na Internet' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Apoio Digital ao Negócio' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Apoio Digital ao Negócio' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Apoio ' }
  ];

  isMobile = false;

  ngOnInit() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 990;
  }

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}