import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { FilePreviewPipe } from './utils/pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FileUploadModule,
    DialogModule,
    AccordionModule,
    FilePreviewPipe
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class AdminDashboardComponent {
  previewVisible = false; 
  previewImage = ''; 

  openPreview() {
    
    this.previewImage = '/header.png'; 
    this.previewVisible = true; 
  }

  closePreview() {
    this.previewVisible = false; 
  }

  logo = '';
  menu = {
    projeto: '',
    conteudo: '',
    ajuda: '',
    red: ''
  };

  manifestoImagem: File | null = null;

  chamada = {
    titulo: '',
    subtitulo: ''
  };

  bolas = {
    titulo1: '',
    titulo2: '',
    descricao: ''
  };
  bolasImagem: File | null = null;

  equipeCarrossel: File[] = [];

  conteudo = {
    nome: '',
    titulo: '',
    subtitulo: ''
  };
  conteudoImagem: File | null = null;

  outroCarrossel: File[] = [];

  acordions: { titulo: string; subtitulo: string; texto: string }[] = [];

  footer = {
    titulo: '',
    subtitulo: '',
    descricao: ''
  };

  carrosselFinal: File[] = [];

  accordionItems = [
    { key: 'logoNav', label: 'Logo e Navegação' },
    { key: 'manifesto', label: 'Imagem Manifesto' },
    { key: 'chamada', label: 'Chamada Principal' },
    { key: 'bolas', label: 'Destaques do Projeto' },
    { key: 'equipe', label: 'Carrossel Equipe' },
    { key: 'conteudo', label: 'Conteúdo com Imagem' },
    { key: 'diverso', label: 'Carrossel Diverso' },
    { key: 'accordions', label: 'Acordions Dinâmicos' },
    { key: 'footer', label: 'Rodapé' },
    { key: 'carrosselFinal', label: 'Carrossel Final de Imagens' }
  ];

  adicionarAccordion() {
    this.acordions.push({ titulo: '', subtitulo: '', texto: '' });
  }

  removerAccordion(index: number) {
    this.acordions.splice(index, 1);
  }

  onFileSelect(event: any, destino: File[] | File | null) {
    const file = event.target.files[0];
    if (!file) return;

    if (Array.isArray(destino)) {
      destino.push(file);
    } else {
      if (destino === this.manifestoImagem) {
        this.manifestoImagem = file;
      } else if (destino === this.bolasImagem) {
        this.bolasImagem = file;
      } else if (destino === this.conteudoImagem) {
        this.conteudoImagem = file;
      }
    }
  }

  removerImagem(lista: File[], index: number) {
    lista.splice(index, 1);
  }

  salvar() {
    const dados = {
      logo: this.logo,
      menu: this.menu,
      manifestoImagem: this.manifestoImagem,
      chamada: this.chamada,
      bolas: this.bolas,
      bolasImagem: this.bolasImagem,
      equipeCarrossel: this.equipeCarrossel,
      conteudo: this.conteudo,
      conteudoImagem: this.conteudoImagem,
      outroCarrossel: this.outroCarrossel,
      acordions: this.acordions,
      footer: this.footer,
      carrosselFinal: this.carrosselFinal
    };

    console.log('✅ Dados salvos:', dados);
  }
}