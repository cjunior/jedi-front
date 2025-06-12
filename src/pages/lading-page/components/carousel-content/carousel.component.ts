import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselContentComponent {
  items = [
    '/diva2.svg',
    '/divos2.png',
    '/diva2.svg',
    '/divos2.png',
    '/diva2.svg'
  ];
}