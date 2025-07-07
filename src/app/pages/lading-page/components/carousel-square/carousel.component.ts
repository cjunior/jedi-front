import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-carousel-square',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselSquareComponent implements OnInit {
  currentIndex = 0;
  translateX = 0;
  slideWidth = 380 + 16;
  isMobile = false;
  visibleSlides = 1;
  maxIndex = 0;

  slides = [
    {
      type: 'image',
      imageUrl: './Afiliadosinfoprodutores.jpg',
      text: 'Afiliados infoprodutores',
    },
    {
      type: 'image',
      imageUrl: './Afiliadosencapsulados.jpg',
      text: 'Afiliados encapsulados',
    },
    { 
      type: 'image',
      imageUrl: './BusinessCANVAS.png', 
      text: 'Business CANVAS' 
    },
    {
      type: 'image',
      imageUrl: './cooperativismo.jpeg',
      text: 'Cooperativismo de plataforma',
    },
    { 
      type: 'image',
      imageUrl: './Copywriting.jpg', 
      text: 'Copywriting' 
    },
    { 
      type: 'image',
      imageUrl: './Digitalinfluencer.jpg', 
      text: 'Digital influencer' 
    },
    { 
      type: 'image',
      imageUrl: './tecmemp.jpeg', 
      text: 'Técnicas de empreendedorismo' 
    },
    { 
      type: 'image',
      imageUrl: './FerramentasdeIA.jpg', 
      text: 'Ferramentas de IA' 
    },
    { 
      type: 'image',
      imageUrl: './Marketing.jpg', 
      text: 'Marketing' 
    },
    { 
      type: 'image',
      imageUrl: './Personograma.png', 
      text: 'Personograma' 
    },
    { 
      type: 'image',
      imageUrl: './Socialmedia.jpg', 
      text: 'Social media' 
    },
    { 
      type: 'image',
      imageUrl: './tecnicas.jpg', 
      text: 'Técnicas de design' 
    },
    { 
      type: 'image',
      imageUrl: './TráfegoPago.png', 
      text: 'Tráfego pago' 
    },
    { 
      type: 'image',
      imageUrl: './ux.jpg', 
      text: 'UI/UX' 
    },
    { 
      type: 'image',
      imageUrl: './businessman-planning-strategy.jpg', 
      text: 'Vendas dropshipping' 
    },
    { 
      type: 'image',
      imageUrl: './vendas.jpg', 
      text: 'Vendas de e-commerce' 
    },
    { 
      type: 'image',
      imageUrl: './facebook.jpg', 
      text: 'Vendas no Facebook' 
    },
    { 
      type: 'image',
      imageUrl: './ifood.jpeg', 
      text: 'Vendas no iFood' 
    },
    { 
      type: 'image',
      imageUrl: './instagram.jpg', 
      text: 'Vendas no Instagram' 
    },
    { 
      type: 'image',
      imageUrl: './mercadolivre.jpg', 
      text: 'Vendas no Mercado Livre' 
    },
    {
      type: 'image',
      imageUrl: './tiktok.jpg',
      text: 'Vendas no TikTok',
    },
    { 
      type: 'image',
      imageUrl: './whatsapp.jpg', 
      text: 'Vendas no WhatsApp' 
    },
    { 
      type: 'image',
      imageUrl: './youtube.jpg', 
      text: 'Vendas no YouTube' 
    },
    { 
      type: 'image',
      imageUrl: './VendasPLR.jpeg', 
      text: 'Vendas PLR' 
    },
  ];

  ngOnInit() {
    this.checkScreenSize();
    this.updateSlideWidth();
    this.calculateVisibleSlides();
    this.calculateMaxIndex();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
    this.updateSlideWidth();
    this.calculateVisibleSlides();
    this.calculateMaxIndex();
    this.adjustCurrentIndex();
    this.updateTransform();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 600;
  }

  private updateSlideWidth() {
    if (window.innerWidth <= 600) {
      this.slideWidth = Math.min(window.innerWidth * 0.8, 300) + 16;
    } else if (window.innerWidth <= 980) {
      this.slideWidth = Math.min(window.innerWidth * 0.9, 350) + 16;
    } else {
      this.slideWidth = 500 + 16;
    }
  }

  private calculateVisibleSlides() {
    const containerWidth = window.innerWidth > 980 ? 
      window.innerWidth - 128 : // Desktop: considera os botões laterais
      window.innerWidth; // Mobile: usa toda a largura
    
    this.visibleSlides = Math.floor(containerWidth / this.slideWidth);
    if (this.visibleSlides === 0) this.visibleSlides = 1;
  }

  private calculateMaxIndex() {
    this.maxIndex = Math.max(0, this.slides.length - this.visibleSlides);
  }

  private adjustCurrentIndex() {
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.maxIndex;
    }
    this.updateTransform();
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateTransform();
  }

  private updateTransform() {
    this.translateX = -this.currentIndex * this.slideWidth;
  }
}