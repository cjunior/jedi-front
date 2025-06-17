import { Component, inject, OnInit } from '@angular/core';
import { CarouselComponent } from "./components/carousel/carousel.component";

import { AcordionComponent } from "./components/acordion/acordion.component";
import { FormComponent } from "./components/form/form.component";
import { CarouselContentComponent } from './components/carousel-content/carousel.component';
import { CarouselSquareComponent } from "./components/carousel-square/carousel.component";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { landingPageService } from './services/lading-page.service';

@Component({
  selector: 'app-lading-page',
  imports: [
    CarouselComponent,
    AcordionComponent,
    FormComponent,
    CarouselContentComponent,
    CarouselSquareComponent,
    DropdownComponent,
  ],
  templateUrl: './lading-page.component.html',
  styleUrl: './lading-page.component.scss'
})
export class LadingPageComponent implements OnInit {


  private readonly landingPageService = inject(landingPageService);
  menuAberto = false;
  menu = {
    projeto: 'O Projeto',
    conteudo: 'Conteúdo',
    ajuda: 'Ajuda',
    red: '#RedeJED',
    buttontext: 'Entrar'
  };

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
  ngOnInit(): void {
    this.landingPageService.getdados().subscribe({
      next: (dados) => {
        console.log('Dados recebidos da API:', dados);
  
        if (dados && dados.length > 0 && dados[0] && dados[0]["0"]) {
          const menuData = dados[0]["0"].menu; 
          console.log('Dados do menu:', menuData);
  
          if (menuData) {
            this.menu.projeto = menuData.headerText1 || 'Projeto Padrão';
            this.menu.conteudo = menuData.headerText2 || 'Conteúdo Padrão';
            this.menu.ajuda = menuData.headerText3 || 'Ajuda Padrão';
            this.menu.red = menuData.headerText4 || '#RedeJED';
            this.menu.buttontext = menuData.headerButtonText || 'Entrar';
          } else {
            console.warn('O objeto "menu" está ausente em dados[0]["0"].');
          }
        } else {
          console.warn('A API retornou um array vazio ou indefinido.');
        }
      },
      error: (err) => {
        console.error('Erro ao buscar dados:', err);
      }
    });
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

}
