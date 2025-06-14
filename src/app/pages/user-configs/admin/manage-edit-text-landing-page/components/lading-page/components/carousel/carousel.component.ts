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

  onFileSelected(event: Event, item: { image: string; alt: string }) {
    const index = this.items.indexOf(item); // Calcula o índice do item
    if (index !== -1) { // Verifica se o item existe no array
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.items[index].image = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    } else {
      console.error(`Índice inválido: ${index}`);
    }
  }
}