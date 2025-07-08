import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel-square',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselSquareComponent implements OnInit {
  currentIndex = 0;
  translateX = 0;
  slideWidth = 252;
  containerWidth = 500;
  isMobile = false;
  visibleSlides = 1;
  maxIndex = 0;
  transitionEnabled = true;

  // Quantas vezes duplicar (1x antes e 1x depois = 3 blocos)
  duplicateCount = 1;

  originalSlides = [
    { type: 'image', imageUrl: './kits/7Afiliadodeinfoprodutos.jpg', text: 'Afiliados infoprodutores' },
    { type: 'image', imageUrl: './kits/8AfiliadosEncapsulados.jpg', text: 'Afiliados encapsulados' },
    { type: 'image', imageUrl: './kits/2CapaModelodenegóciosCanvas.jpg', text: 'Business CANVAS' },
    { type: 'image', imageUrl: './kits/18CooperativismodePlataforma.jpg', text: 'Cooperativismo de plataforma' },
    { type: 'image', imageUrl: './kits/19.jpeg', text: 'Copywriting' },
    { type: 'image', imageUrl: './kits/24.jpeg', text: 'Digital influencer' },
    { type: 'image', imageUrl: './kits/1CapaEmpreendedorismo.jpg', text: 'Técnicas de empreendedorismo' },
    { type: 'image', imageUrl: './kits/20.jpeg', text: 'Ferramentas de IA' },
    { type: 'image', imageUrl: './kits/4CapaMarketing.jpg', text: 'Marketing' },
    { type: 'image', imageUrl: './CapaPersona.jpg', text: 'Personograma' },
    { type: 'image', imageUrl: './kits/22.jpeg', text: 'Social media' },
    { type: 'image', imageUrl: './kits/23.jpeg', text: 'Técnicas de design' },
    { type: 'image', imageUrl: './kits/13TráfegoPago.jpg', text: 'Tráfego pago' },
    { type: 'image', imageUrl: './kits/18.jpeg', text: 'UI/UX' },
    { type: 'image', imageUrl: './kits/5CapaVendasdropshipping.jpg', text: 'Vendas dropshipping' },
    { type: 'image', imageUrl: './kits/9VendasE-commerceemercadodigital.jpg', text: 'Vendas de e-commerce' },
    { type: 'image', imageUrl: './kits/11VendasFacebook.jpg', text: 'Vendas no Facebook' },
    { type: 'image', imageUrl: './kits/16VendasIfod.jpg', text: 'Vendas no iFood' },
    { type: 'image', imageUrl: './kits/10VendasInstagram.jpg', text: 'Vendas no Instagram' },
    { type: 'image', imageUrl: './kits/17VendasMercadoLivre.jpg', text: 'Vendas no Mercado Livre' },
    { type: 'image', imageUrl: './kits/14VendasTikTok.jpg', text: 'Vendas no TikTok' },
    { type: 'image', imageUrl: './kits/12VendasWhatsApp.jpg', text: 'Vendas no WhatsApp' },
    { type: 'image', imageUrl: './kits/15VendasYoutube.jpg', text: 'Vendas no YouTube' },
    { type: 'image', imageUrl: './kits/6CapaVendasPLR.jpg', text: 'Vendas PLR' },
  ];

  slides = [...this.originalSlides]; // vai ser preenchido com duplicados

  ngOnInit() {
    this.setupSlides();
    this.checkScreenSize();
    this.updateSlideWidth();
    this.calculateVisibleSlides();
    this.calculateMaxIndex();
    this.setInitialPosition();
    this.updateTransform();
  }

  setupSlides() {
    const prefix = [...this.originalSlides];
    const suffix = [...this.originalSlides];
    this.slides = [...suffix, ...this.originalSlides, ...prefix];
  }

  setInitialPosition() {
    this.currentIndex = this.originalSlides.length; // posição do primeiro slide "real"
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
    this.updateSlideWidth();
    this.calculateVisibleSlides();
    this.calculateMaxIndex();
    this.updateTransform();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 1000;
  }

  updateSlideWidth() {
    if (this.isMobile) {
      this.containerWidth = window.innerWidth - 120;
      this.slideWidth = this.containerWidth;
    } else {
      this.slideWidth = 252;
      this.containerWidth = window.innerWidth - 200;
    }
  }

  calculateVisibleSlides() {
    if (this.isMobile) {
      this.visibleSlides = 1;
    } else {
      const availableWidth = window.innerWidth - 200;
      this.visibleSlides = Math.floor(availableWidth / this.slideWidth);
      if (this.visibleSlides < 1) this.visibleSlides = 1;
    }
  }

  calculateMaxIndex() {
    this.maxIndex = this.slides.length - this.visibleSlides;
  }

  previous() {
    this.transitionEnabled = true;
    this.currentIndex--;
    this.updateTransform();

    // Loop visual
    if (this.currentIndex < this.originalSlides.length) {
      setTimeout(() => {
        this.transitionEnabled = false;
        this.currentIndex = this.originalSlides.length * 2 - 1;
        this.updateTransform();
      }, 500);
    }
  }

  next() {
    this.transitionEnabled = true;
    this.currentIndex++;
    this.updateTransform();

    // Loop visual
    if (this.currentIndex >= this.originalSlides.length * 2) {
      setTimeout(() => {
        this.transitionEnabled = false;
        this.currentIndex = this.originalSlides.length;
        this.updateTransform();
      }, 500);
    }
  }

  updateTransform() {
    this.translateX = -this.currentIndex * this.slideWidth;
  }
}
