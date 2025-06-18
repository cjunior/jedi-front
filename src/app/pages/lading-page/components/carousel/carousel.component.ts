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

  items: { image: string; alt: string }[] = [];

  ngOnInit() {
    this.landingPageService.getdados().subscribe({
      next: (dados) => {
        this.items = dados.teamResponseDto.items.map((item: any) => {
          return {
            image: item.imgUrl,
            alt: item.name || 'Foto da equipe'
          };
        });
      }
    });
  }

  products = [
    { name: 'Product 1', price: 100, image: 'product1.jpg', inventoryStatus: 'In Stock' },
    { name: 'Product 2', price: 200, image: 'product2.jpg', inventoryStatus: 'Low Stock' },
    { name: 'Product 3', price: 300, image: 'product3.jpg', inventoryStatus: 'Out of Stock' },
    { name: 'Product 4', price: 400, image: 'product4.jpg', inventoryStatus: 'In Stock' },
    { name: 'Product 5', price: 500, image: 'product5.jpg', inventoryStatus: 'Low Stock' }
  ];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  getSeverity(status: string): string {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'danger';
      default:
        return '';
    }
  }
}