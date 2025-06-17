import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ManageCarouselModalComponent } from '../../../modal/modal';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, TagModule, ManageCarouselModalComponent],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  showModal = false;
  modalVisible = false;

  items = [
    { image: '/fotoend2.png', alt: 'Foto End 2' },
    { image: '/diva2.svg', alt: 'Diva 2' },
    { image: '/divos.svg', alt: 'Divos' },
    { image: '/divos.svg', alt: 'Divos' },
    { image: '/divos.svg', alt: 'Divos' },
    { image: '/divos.svg', alt: 'Divos' },
  
  ];

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5, numScroll: 1 },
    { breakpoint: '768px', numVisible: 3, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  modalItems: any[] = [];

  openModal() {
    this.modalItems = [...this.items]; // Clona o array
    this.modalVisible = true; // <- CORRETO
  }
  
  onSave(newItems: any[]) {
    this.items = [...newItems];
  }
  
  updateItems(updatedItems: any[]) {
    this.items = [...updatedItems];
  }
}