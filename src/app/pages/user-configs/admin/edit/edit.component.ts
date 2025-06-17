import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { FilePreviewPipe } from './utils/pipe';
import { editService } from './service/edit.service';

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
export class AdminDashboardComponent implements OnInit {
  previewVisible = false;
  previewImage = '';
  private readonly serviceapi = inject(editService);

  logo = '';
  menu = {
    headerFile: '',
    headerText1: '',
    headerText2: '',
    headerText3: '',
    headerText4: '',
    headerButtonText: '',

  };

  logoImagem: File | null = null;


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

  ngOnInit() {
    this.serviceapi.getdados().subscribe({
      next: (dados) => {
        console.log('Dados recebidos:', dados);
        this.carregarDados(dados);
      },
      error: (err) => {
        console.error('Erro ao buscar dados:', err);
      }
    });
  }

  carregarDados(dados: any) {
    this.logo = dados.logo || '';
    this.menu = dados.menu || {headerFile: '', headerText1: '', headerText2: '', headerText3: '', headerText4: '', headerButtonText: '' };
    this.manifestoImagem = dados.manifestoImagem || null;
    this.chamada = dados.chamada || { titulo: '', subtitulo: '' };
    this.bolas = dados.bolas || { titulo1: '', titulo2: '', descricao: '' };
    this.bolasImagem = dados.bolasImagem || null;
    this.equipeCarrossel = dados.equipeCarrossel || [];
    this.conteudo = dados.conteudo || { nome: '', titulo: '', subtitulo: '' };
    this.conteudoImagem = dados.conteudoImagem || null;
    this.outroCarrossel = dados.outroCarrossel || [];
    this.acordions = dados.acordions || [];
    this.footer = dados.footer || { titulo: '', subtitulo: '', descricao: '' };
    this.carrosselFinal = dados.carrosselFinal || [];
    this.logoImagem = null; 

  }

  openPreview() {
    this.previewImage = '/header.png';
    this.previewVisible = true;
  }

  closePreview() {
    this.previewVisible = false;
  }

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
      } else if (destino === this.logoImagem) {
        this.logoImagem = file;
      }
    }
  }
  

  removerImagem(lista: File[], index: number) {
    lista.splice(index, 1);
  }

  salvar() {
    const dados = [
      {
        
        logo: this.logoImagem ? this.logoImagem.name || this.logoImagem.toString() : '',
        menu: this.menu,
        manifestoImagem: this.manifestoImagem ? this.manifestoImagem.toString() : null,
        chamada: this.chamada,
        bolas: this.bolas,
        bolasImagem: this.bolasImagem ? this.bolasImagem.toString() : null,
        equipeCarrossel: this.equipeCarrossel.map(file => file.name || file.toString()),
        conteudo: this.conteudo,
        conteudoImagem: this.conteudoImagem ? this.conteudoImagem.toString() : null,
        outroCarrossel: this.outroCarrossel.map(file => file.name || file.toString()),
        acordions: this.acordions,
        footer: this.footer,
        carrosselFinal: this.carrosselFinal.map(file => file.name || file.toString())
      }
    ];
  
    console.log('Dados enviados:', JSON.stringify(dados, null, 2));
  
    this.serviceapi.putdados(dados).subscribe({
      next: (response) => {
        console.log('✅ Dados atualizados com sucesso:', response);
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar dados:', err);
      }
    });
  }
}