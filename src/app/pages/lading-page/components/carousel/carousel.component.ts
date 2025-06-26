import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { landingPageService } from '../../services/lading-page.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, TagModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  private readonly landingPageService = inject(landingPageService);

  items: { image: string; alt: string }[] = [
    { image: '/equipe1.jpeg', alt: 'Equipe 1' },
    { image: '/equipe2.jpeg', alt: 'Equipe 2' },
    { image: '/equipe3.jpeg', alt: 'Equipe 3' },
    { image: '/equipe4.jpg', alt: 'Equipe 4' },
    { image: '/equipe6.jpg', alt: 'Equipe 6' },
    { image: '/equipe5.jpg', alt: 'Equipe 5' },
  ];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  ngOnInit() {}
}
