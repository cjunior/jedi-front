import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { landingPageService } from '../../services/lading-page.service';

@Component({
  selector: 'app-carousel-square',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselSquareComponent implements OnInit {
  private readonly landingPageService = inject(landingPageService);

  items = [
    {
      image: './conteudo.png',
      alt: 'Banner 1',
      text: 'Seu Produto na Internet',
    },
    {
      image: './conteudo.png',
      alt: 'Banner 1',
      text: 'Venda Mais na Internet',
    },
    {
      image: './conteudo.png',
      alt: 'Banner 1',
      text: 'Apoio Digital ao Negócio',
    },
   

    { image: './conteudo.png', alt: 'Banner 1', text: 'Empreendedorismo' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Business CANVAS ' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Personograma ' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Marketing ' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Vendas dropshipping ' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Vendas PLR ' },
    {
      image: './conteudo.png',
      alt: 'Banner 1',
      text: 'Afiliados infoprodutores ',
    },
    {
      image: './conteudo.png',
      alt: 'Banner 1',
      text: 'Afiliados encapsulados ',
    },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Digital influencer ' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Vendas no Instagram ' },
    {
      image: './conteudo.png',
      alt: 'Banner 1',
      text: 'Cooperativismo de Plataforma ',
    },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Copywriting ' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Ferramentas de IA ' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Vendas no Facebook ' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'UI/UX ' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Vendas no WPP ' },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Social mídia ' },
    {
      image: './conteudo.png',
      alt: 'Banner 1',
      text: 'Vendas utilizando o TikTok ',
    },
    { image: './conteudo.png', alt: 'Banner 1', text: 'Técnicas de design ' },

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
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
}
