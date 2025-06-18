import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-carousel-content',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselContentComponent {
  items = [
    { image: '/diva2.svg', alt: 'Diva 2' },
    { image: '/fotoca.png', alt: 'Fotoca' },
    { image: '/diva2.svg', alt: 'Diva 2' },
    { image: '/fotoca.png', alt: 'Fotoca' },
    { image: '/diva2.svg', alt: 'Diva 2' },
    { image: '/fotoca.png', alt: 'Fotoca' },
    { image: '/diva2.svg', alt: 'Diva 2' },
    { image: '/fotoca.png', alt: 'Fotoca' },
    { image: '/diva2.svg', alt: 'Diva 2' },
    { image: '/fotoca.png', alt: 'Fotoca' }
  ];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}