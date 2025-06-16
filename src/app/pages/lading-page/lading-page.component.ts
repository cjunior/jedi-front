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
    red: '#RedeJED'
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
  
        // Verifica se 'dados' existe e contém pelo menos um item
        if (dados && dados.length > 0 && dados[0] && dados[0]["0"]) {
          const menuData = dados[0]["0"].menu; // Acessa o objeto 'menu' dentro de dados[0]["0"]
          console.log('Dados do menu:', menuData);
  
          if (menuData) {
            // Atualiza os valores do menu com os dados recebidos
            this.menu.projeto = menuData.projeto || 'Projeto Padrão';
            this.menu.conteudo = menuData.conteudo || 'Conteúdo Padrão';
            this.menu.ajuda = menuData.ajuda || 'Ajuda Padrão';
            this.menu.red = menuData.red || '#RedeJED';
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
