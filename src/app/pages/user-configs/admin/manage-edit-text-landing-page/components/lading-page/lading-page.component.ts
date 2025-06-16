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
  title = 'DÊ UM PLAY NO SEU FUTURO';
  subtitle = 'Curso online com formação personalizada para você empreender de forma inteligente e estratégica';
  projectText1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac ullamcorper metus. Nunc cursus orci tortor, sed interdum mi commodo a.';
  projectText2 = 'Duis fermentum velit at sapien iaculis tincidunt. Integer ultrices mollis sagittis. Nulla facilisi. Nulla facilisi.';
  editingTitle = false;
  editingSubtitle = false;
  editingProjectText1 = false;
  editingProjectText2 = false;

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

  editingCards: boolean[] = Array(this.cards.length).fill(false);

  toggleEdit(field: string) {
    if (field === 'title') {
      this.editingTitle = !this.editingTitle;
    } else if (field === 'subtitle') {
      this.editingSubtitle = !this.editingSubtitle;
    } else if (field === 'projectText1') {
      this.editingProjectText1 = !this.editingProjectText1;
    } else if (field === 'projectText2') {
      this.editingProjectText2 = !this.editingProjectText2;
    }
  }

  toggleEditCard(index: number) {
    this.editingCards[index] = !this.editingCards[index];
  }
}