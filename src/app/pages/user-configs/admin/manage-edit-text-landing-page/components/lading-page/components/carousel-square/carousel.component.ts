import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-carousel-square',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselSquareComponent {
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

  constructor(private cdr: ChangeDetectorRef) {}

  onFileSelected(event: Event, item: { image: string; alt: string }) {
    const index = this.items.indexOf(item); // Calcula o índice do item
    if (index !== -1) { // Verifica se o item existe no array
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.items[index].image = reader.result as string; // Atualiza a imagem no array
          this.cdr.detectChanges(); // Força a detecção de mudanças
        };
        reader.readAsDataURL(file);
      }
    } else {
      console.error(`Índice inválido: ${index}`);
    }
  }
}