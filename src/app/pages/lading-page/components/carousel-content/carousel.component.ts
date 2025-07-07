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
  slideWidth = 600; // Aumentado para maior
  containerWidth = 600; // Largura do wrapper
  isMobile = false;

  ngOnInit() {
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
    this.isMobile = window.innerWidth <= 768;
  }

  private updateSlideWidth() {
    if (window.innerWidth <= 768) {
      this.slideWidth = Math.min(window.innerWidth * 0.8, 320);
      this.containerWidth = this.slideWidth;
    } else if (window.innerWidth <= 1024) {
      this.slideWidth = 450;
      this.containerWidth = 450;
    } else if (window.innerWidth <= 1200) {
      this.slideWidth = 500;
      this.containerWidth = 500;
    } else if (window.innerWidth <= 1400) {
      this.slideWidth = 550;
      this.containerWidth = 550;
    } else {
      this.slideWidth = 600; // Aumentado significativamente
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
    // Centralização perfeita - mostra apenas um card por vez
    // O translateX move o track para que o card atual fique centralizado no wrapper
    this.translateX = -this.currentIndex * this.slideWidth;
  }
}
