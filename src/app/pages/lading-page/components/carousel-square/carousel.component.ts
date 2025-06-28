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
      image: './Seuprodutonainternet.jpg',
      alt: 'Banner',
      text: 'Seu produto na internet',
    },
    {
      image: './Vendamaisnainternet.jpg',
      alt: 'Banner',
      text: 'Venda mais na internet',
    },
    {
      image: './apoio.jpg',
      alt: 'Banner',
      text: 'Apoio Digital ao Negócio',
    },
    {
      image: './Afiliadosinfoprodutores.jpg',
      alt: 'Banner',
      text: 'Afiliados infoprodutores',
    },
    {
      image: './Afiliadosencapsulados.jpg',
      alt: 'Banner',
      text: 'Afiliados encapsulados',
    },
    { 
      image: './BusinessCANVAS.png', 
      alt: 'Banner', 
      text: 'Business CANVAS' 
    },
    {
      image: './cooperativismo.jpeg',
      alt: 'Banner',
      text: 'Cooperativismo de plataforma',
    },
    { 
      image: './Copywriting.jpg', 
      alt: 'Banner', 
      text: 'Copywriting' 
    },
    { 
      image: './Digitalinfluencer.jpg', 
      alt: 'Banner', 
      text: 'Digital influencer' 
    },
    { 
      image: './conteudo.png', 
      alt: 'Banner', 
      text: 'Técnicas de empreendedorismo' 
    },
    { 
      image: './FerramentasdeIA.jpg', 
      alt: 'Banner', 
      text: 'Ferramentas de IA' 
    },
    { 
      image: './Marketing.jpg', 
      alt: 'Banner', 
      text: 'Marketing' 
    },
    { 
      image: './Personograma.png', 
      alt: 'Banner', 
      text: 'Personograma' 
    },
    { 
      image: './Socialmedia.jpg', 
      alt: 'Banner', 
      text: 'Social media' 
    },
    { 
      image: './tecnicas.jpg', 
      alt: 'Banner', 
      text: 'Técnicas de design' 
    },
    { 
      image: './TráfegoPago.png', 
      alt: 'Banner', 
      text: 'Tráfego pago' 
    },
    { 
      image: './ux.jpg', 
      alt: 'Banner', 
      text: 'UI/UX' 
    },
    { 
      image: './conteudo.png', 
      alt: 'Banner', 
      text: 'Vendas dropshipping' 
    },
    { 
      image: './vendas.jpg', 
      alt: 'Banner', 
      text: 'Vendas de e-commerce' 
    },
    { 
      image: './facebook.jpg', 
      alt: 'Banner', 
      text: 'Vendas no Facebook' 
    },
    { 
      image: './ifood.jpeg', 
      alt: 'Banner', 
      text: 'Vendas no iFood' 
    },
    { 
      image: './instagram.jpg', 
      alt: 'Banner', 
      text: 'Vendas no Instagram' 
    },
    { 
      image: './mercadolivre.jpg', 
      alt: 'Banner', 
      text: 'Vendas no Mercado Livre' 
    },
    {
      image: './tiktok.jpg',
      alt: 'Banner',
      text: 'Vendas no TikTok',
    },
    { 
      image: './whatsapp.jpg', 
      alt: 'Banner', 
      text: 'Vendas no WhatsApp' 
    },
    { 
      image: './youtube.jpg', 
      alt: 'Banner', 
      text: 'Vendas no YouTube' 
    },
    { 
      image: './VendasPLR.jpeg', 
      alt: 'Banner', 
      text: 'Vendas PLR' 
    },
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
