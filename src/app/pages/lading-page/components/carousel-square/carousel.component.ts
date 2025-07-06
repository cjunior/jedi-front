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

  slides = [
    {
      type: 'gradient',
      gradient: 'bg-gradient-to-r from-white to-lime-500',
      text: 'KIT DE APRENDIZAGEM',
    },
    {
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      text: 'KIT DE APRENDIZAGEM',
    },
    {
      type: 'gradient',
      gradient: 'bg-gradient-to-r from-orange-200 to-orange-500',
      text: 'KIT DE APRENDIZAGEM',
    },
  ];

  
  previous() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }
}
