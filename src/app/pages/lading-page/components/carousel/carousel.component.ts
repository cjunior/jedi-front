import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, TagModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  items = [
    { image: '/fotoend2.png', alt: 'Foto End 2' },
    { image: '/diva2.svg', alt: 'Diva 2' },
    { image: '/divos.svg', alt: 'Divos' },
    { image: '/cap.png', alt: 'Cap' },
    { image: '/divos.svg', alt: 'Divos' },
    { image: '/fotoend2.png', alt: 'Foto End 2' },
    { image: '/cap.png', alt: 'Cap' },
    { image: '/divos.svg', alt: 'Divos' },
    { image: '/fotoend2.png', alt: 'Foto End 2' },
    { image: '/divos.svg', alt: 'Divos' }
  ];

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