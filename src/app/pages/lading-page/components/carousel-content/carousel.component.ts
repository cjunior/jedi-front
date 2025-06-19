import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { landingPageService } from '../../services/lading-page.service';

@Component({
  selector: 'app-carousel-content',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselContentComponent implements OnInit {
  private readonly landingPageService = inject(landingPageService);
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

  ngOnInit(): void {
    this.landingPageService.getdados().subscribe({
      next: (response) => {
          
        this.items = response.redeJediSectionDto.imagens.map((slide: any) => ({
          image: slide.url,
        
        
        }));
      },
      error: (error) => {
        console.error('Error fetching carousel data:', error);
      }
    })
  }

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