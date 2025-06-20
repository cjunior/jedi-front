import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { landingPageService } from '../../services/lading-page.service';

@Component({
  selector: 'app-carousel-square',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselSquareComponent implements OnInit {
  private readonly landingPageService = inject(landingPageService);
  items: { image: string; alt: string; text: string }[] = [];

ngOnInit() {
  this.landingPageService.getdados().subscribe({
    next: (dados) => {
      this.items = (dados.contentResponseDto.items || []).map((img: any) => ({
        image: img.imgUrl,
        alt: img.publicId || 'Imagem do item',
        text: img.publicId || ''
      }));
    }
  });
}

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}