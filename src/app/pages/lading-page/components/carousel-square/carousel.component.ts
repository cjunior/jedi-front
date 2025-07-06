import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel-square',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselSquareComponent {
  currentIndex = 0;
  translateX = 0;
  slideWidth = 380 + 16; // largura do slide + gap (ajustado para 3 cards)

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

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateTransform();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateTransform();
  }

  private updateTransform() {
    this.translateX = -this.currentIndex * this.slideWidth;
  }
}