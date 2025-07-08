import { Component, OnInit, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ContentItem {
  title: string;
  image: string;
}

@Component({
  selector: 'app-carousel-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselContentComponent implements OnInit {
  @Input() contentItems: ContentItem[] = [];

  currentIndex = 0;
  translateX = 0;
  slideWidth = 600;
  containerWidth = 600;
  isMobile = false;

  // Array de conteúdo padrão
  defaultContentItems: ContentItem[] = [
    {
      title: 'Passo 1 : Sua Ideia de Negócio',
      image: './step/Passo1.svg',
    },
    {
      title: 'Passo 2 : Seu produto na internet',
      image: './step/Passo2.svg',
    },
    {
      title: 'Passo 3 : Venda mais na internet',
      image: './step/Passo3.svg',
    },
    {
      title: 'Passo 4 : Ferramentas de apoio ao seu negócio',
      image: './step/Passo4.svg',
    },
  ];

  ngOnInit() {
    // Se não recebeu contentItems via @Input, usa o array padrão
    if (this.contentItems.length === 0) {
      this.contentItems = this.defaultContentItems;
    }
    
    this.checkScreenSize();
    this.updateSlideWidth();
    this.updateTransform();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
    this.updateSlideWidth();
    this.updateTransform();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 1000;
  }

  private updateSlideWidth() {
    if (window.innerWidth <= 480) {
      this.containerWidth = window.innerWidth - 80;
      this.slideWidth = this.containerWidth;
    } else if (window.innerWidth <= 768) {
      this.containerWidth = window.innerWidth - 100;
      this.slideWidth = this.containerWidth;
    } else if (window.innerWidth <= 1000) {
      this.containerWidth = window.innerWidth - 120;
      this.slideWidth = this.containerWidth;
    } else if (window.innerWidth <= 1200) {
      this.slideWidth = 320;
      this.containerWidth = 320;
    } else if (window.innerWidth <= 1400) {
      this.slideWidth = 350;
      this.containerWidth = 350;
    } else if (window.innerWidth <= 1600) {
      this.slideWidth = 380;
      this.containerWidth = 380;
    } else {
      this.slideWidth = 600;
      this.containerWidth = 600;
    }
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.contentItems.length) % this.contentItems.length;
    this.updateTransform();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.contentItems.length;
    this.updateTransform();
  }

  private updateTransform() {
    // IMPORTANTE: Usar exatamente a mesma largura do CSS
    this.translateX = -this.currentIndex * this.slideWidth;
  }
}