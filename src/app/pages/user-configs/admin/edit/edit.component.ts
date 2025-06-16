import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { FilePreviewPipe } from './utils/pipe'; // pipe para visualizar os arquivos locais

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
  // Seção 1: Logo e menu
  logo = '';
  menu = {
    projeto: '',
    conteudo: '',
    ajuda: '',
    red: ''
  };

  // Seção 2: Manifesto
  manifestoImagem: File | null = null;

  // Seção 3: Chamada
  chamada = {
    titulo: '',
    subtitulo: ''
  };

  // Seção 4: Destaques
  bolas = {
    titulo1: '',
    titulo2: '',
    descricao: ''
  };
  bolasImagem: File | null = null;

  // Seção 5: Equipe Carrossel
  equipeCarrossel: File[] = [];

  // Seção 6: Conteúdo com Imagem
  conteudo = {
    nome: '',
    titulo: '',
    subtitulo: ''
  };
  conteudoImagem: File | null = null;

  // Seção 7: Outro Carrossel
  outroCarrossel: File[] = [];

  // Seção 8: Acordions Dinâmicos
  acordions: { titulo: string; subtitulo: string; texto: string }[] = [];

  adicionarAccordion() {
    this.acordions.push({ titulo: '', subtitulo: '', texto: '' });
  }

  removerAccordion(index: number) {
    this.acordions.splice(index, 1);
  }

  // Seção 9: Rodapé
  footer = {
    titulo: '',
    subtitulo: '',
    descricao: ''
  };

  // Seção 10: Carrossel Final
  carrosselFinal: File[] = [];

  onFileSelect(event: any, destino: File[] | File | null) {
    const file = event.target.files[0];
    if (!file) return;
  
    if (Array.isArray(destino)) {
      destino.push(file);
    } else {
      // Checagem explícita para os campos únicos
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

  // Salvar
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

    // Aqui você pode enviar para sua API, ex:
    // this.apiService.salvarDashboard(dados).subscribe(...)
  }
}
