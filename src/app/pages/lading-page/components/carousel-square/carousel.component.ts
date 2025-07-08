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
  slideWidth = 516; // 500px + 16px gap
  containerWidth = 500;
  isMobile = false;
  visibleSlides = 1;
  maxIndex = 0;

  slides = [
    {
      type: 'image',
      imageUrl: './kits/7Afiliadodeinfoprodutos.jpg',
      text: 'Afiliados infoprodutores',
    },
    {
      type: 'image',
      imageUrl: './kits/8AfiliadosEncapsulados.jpg',
      text: 'Afiliados encapsulados',
    },
    {
      type: 'image',
      imageUrl: './kits/2CapaModelodenegóciosCanvas.jpg',
      text: 'Business CANVAS'
    },
    {
      type: 'image',
      imageUrl: './CapaPersona.jpg',
      text: 'Cooperativismo de plataforma',
    },
    {
      type: 'image',
      imageUrl: './kits/19.jpeg',
      text: 'Copywriting'
    },
    {
      type: 'image',
      imageUrl: './kits/24.jpeg',
      text: 'Digital influencer'
    },
    {
      type: 'image',
      imageUrl: './kits/1CapaEmpreendedorismo.jpg',
      text: 'Técnicas de empreendedorismo'
    },
    {
      type: 'image',
      imageUrl: './CapaPersona.jpg',
      text: 'Ferramentas de IA'
    },
    {
      type: 'image',
      imageUrl: './kits/4CapaMarketing.jpg',
      text: 'Marketing'
    },
    {
      type: 'image',
      imageUrl: './CapaPersona.jpg',
      text: 'Personograma'
    },
    {
      type: 'image',
      imageUrl: './kits/22.jpeg',
      text: 'Social media'
    },
    {
      type: 'image',
      imageUrl: './kits/23.jpeg',
      text: 'Técnicas de design'
    },
    {
      type: 'image',
      imageUrl: './kits/13TráfegoPago.jpg',
      text: 'Tráfego pago'
    },
    {
      type: 'image',
      imageUrl: './kits/18.jpeg',
      text: 'UI/UX'
    },
    {
      type: 'image',
      imageUrl: './kits/5CapaVendasdropshipping.jpg',
      text: 'Vendas dropshipping'
    },
    {
      type: 'image',
      imageUrl: './kits/9VendasE-commerceemercadodigital.jpg',
      text: 'Vendas de e-commerce'
    },
    {
      type: 'image',
      imageUrl: './kits/11VendasFacebook.jpg',
      text: 'Vendas no Facebook'
    },
    {
      type: 'image',
      imageUrl: './kits/16VendasIfod.jpg',
      text: 'Vendas no iFood'
    },
    {
      type: 'image',
      imageUrl: './kits/10VendasInstagram.jpg',
      text: 'Vendas no Instagram'
    },
    {
      type: 'image',
      imageUrl: './kits/17VendasMercadoLivre.jpg',
      text: 'Vendas no Mercado Livre'
    },
    {
      type: 'image',
      imageUrl: './kits/14VendasTikTok.jpg',
      text: 'Vendas no TikTok',
    },
    {
      type: 'image',
      imageUrl: './kits/12VendasWhatsApp.jpg',
      text: 'Vendas no WhatsApp'
    },
    {
      type: 'image',
      imageUrl: './kits/15VendasYoutube.jpg',
      text: 'Vendas no YouTube'
    },
    {
      type: 'image',
      imageUrl: './kits/6CapaVendasPLR.jpg',
      text: 'Vendas PLR'
    },
  ];

  ngOnInit() {
    this.checkScreenSize();
    this.updateSlideWidth();
    this.calculateVisibleSlides();
    this.calculateMaxIndex();
    this.updateTransform();
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
    this.isMobile = window.innerWidth <= 1000;
  }

  private updateSlideWidth() {
    if (this.isMobile) {
      // Mobile: 1 slide por vez ocupando toda a largura disponível
      this.slideWidth = window.innerWidth - 120; // Largura total menos espaço das setas
      this.containerWidth = this.slideWidth;
    } else {
      // Desktop: largura do slide + gap menor
      this.slideWidth = 252; // 244px (card) + 8px (gap)
      this.containerWidth = window.innerWidth - 200; // Largura disponível menos espaço das setas
    }
  }

  private calculateVisibleSlides() {
    if (this.isMobile) {
      this.visibleSlides = 1;
    } else {
      // Desktop: calcula quantos slides cabem na tela
      const availableWidth = window.innerWidth - 200; // Menos espaço das setas
      this.visibleSlides = Math.floor(availableWidth / this.slideWidth);
      if (this.visibleSlides === 0) this.visibleSlides = 1;
    }
  }

  private calculateMaxIndex() {
    // Calcula o índice máximo baseado nos slides visíveis
    this.maxIndex = Math.max(0, this.slides.length - this.visibleSlides);
  }

  private adjustCurrentIndex() {
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
  }

  previous() {
    if (this.currentIndex > 0) {
      // Ainda há slides anteriores
      this.currentIndex--;
    } else {
      // Chegou no primeiro, volta para o último
      this.currentIndex = this.maxIndex;
    }
    this.updateTransform();
  }

  next() {
    // Verifica se chegou no último conjunto de slides visíveis
    if (this.isAtLastPosition()) {
      // Chegou no último, volta para o primeiro
      this.currentIndex = 0;
    } else {
      // Ainda há slides para frente
      this.currentIndex++;
    }
    this.updateTransform();
  }

  private isAtLastPosition(): boolean {
    if (this.isMobile) {
      // Mobile: verifica se é o último slide individual
      return this.currentIndex >= this.slides.length - 1;
    } else {
      // Desktop: verifica se chegou no último conjunto de slides visíveis
      return this.currentIndex >= this.maxIndex;
    }
  }

  private updateTransform() {
    // Garante que o currentIndex está dentro dos limites válidos
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.maxIndex));
    
    // Calcula o translateX
    this.translateX = -this.currentIndex * this.slideWidth;
    
    // Debug logs
    console.log('Current Index:', this.currentIndex);
    console.log('Max Index:', this.maxIndex);
    console.log('Is at last position:', this.isAtLastPosition());
    console.log('Visible Slides:', this.visibleSlides);
    console.log('Total Slides:', this.slides.length);
    console.log('Translate X:', this.translateX);
    console.log('---');
  }
}