import { Component } from '@angular/core';
import { CarouselComponent } from "./components/carousel/carousel.component";

import { AcordionComponent } from "./components/acordion/acordion.component";
import { FormComponent } from "./components/form/form.component";
import { CarouselContentComponent } from './components/carousel-content/carousel.component';
import { CarouselSquareComponent } from "./components/carousel-square/carousel.component";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lading-edit-page',
  imports: [
    AcordionComponent,
    FormComponent,
    CarouselContentComponent,
    CarouselSquareComponent,
    DropdownComponent,
    CarouselComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './lading-page.component.html',
  styleUrl: './lading-page.component.scss'
})
export class LadingPageeditComponent {
  menuAberto = false;

 
  title = 'DÊ UM PLAY NO SEU FUTURO';
  subtitle = 'Curso online com formação personalizada para você empreender de forma inteligente e estratégica';
  projectText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac ullamcorper metus.';
  editingTitle = false;
  editingSubtitle = false;
  editingProjectText = false;
  editingCards: boolean[] = [];

  cards = [
    {
      imagem: './fotoend3.svg',
      titulo: 'Lorem ipsum dolor sit amet, consec...',
      autor: 'Maria',
      data: '08 de Abril',
      tempoLeitura: '2min de leitura'
    },
    {
      imagem: './fotoend3.svg',
      titulo: 'Lorem ipsum dolor sit amet, consec...',
      autor: 'Maria',
      data: '08 de Abril',
      tempoLeitura: '2min de leitura'
    },
    {
      imagem: './fotoend3.svg',
      titulo: 'Lorem ipsum dolor sit amet, consec...',
      autor: 'Maria',
      data: '08 de Abril',
      tempoLeitura: '2min de leitura'
    }
  ];

  toggleEdit(field: string) {
    if (field === 'title') {
      this.editingTitle = !this.editingTitle;
      if (!this.editingTitle) {
        this.saveData({ title: this.title });
      }
    } else if (field === 'subtitle') {
      this.editingSubtitle = !this.editingSubtitle;
      if (!this.editingSubtitle) {
        this.saveData({ subtitle: this.subtitle });
      }
    } else if (field === 'projectText') {
      this.editingProjectText = !this.editingProjectText;
      if (!this.editingProjectText) {
        this.saveData({ projectText: this.projectText });
      }
    }
  }

  toggleEditCard(index: number) {
    this.editingCards[index] = !this.editingCards[index];
    if (!this.editingCards[index]) {
      this.saveData({ card: this.cards[index] });
    }
  }

  saveData(data: any) {
    console.log('Dados enviados para o backend:', data);

  }
}