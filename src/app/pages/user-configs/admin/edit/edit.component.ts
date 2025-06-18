import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    InputTextModule,
    ButtonModule,
    CardModule,
    FileUploadModule,
    DialogModule,
    AccordionModule,
    FilePreviewPipe,
    FormsModule,
    ReactiveFormsModule
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

manifestoImagens: { file: File, buttonText: string, buttonUrl: string }[] = [];
botaobanner = {
  buttonText: '',
  buttonUrl: ''
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


onManifestoSelect(event: any) {
  if (event.files && event.files.length > 0) {
    for (const file of event.files) {
      this.manifestoImagens.push({
        file,
        buttonText: '',
        buttonUrl: ''
      });
    }
  }
}
onUpload(event: any) {
  console.log('Upload concluído:', event);
}

removerManifestoImagem(index: number) {
  this.manifestoImagens.splice(index, 1);
}

atualizarManifestoImagem(event: any, index: number) {
  const file = event.target.files[0];
  if (file) {
    this.manifestoImagens[index].file = file;
  }
}

onLogoSelect(event: any) {
  if (event.files && event.files.length > 0) {
    this.logoImagem = event.files[0];
  }
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

onFileSelect(event: any, destino: string) {
  const file = event.target.files[0];
  if (!file) return;

  if (destino === 'logoImagem') {
    this.logoImagem = file;
  } else if (destino === 'manifestoImagem') {
    this.manifestoImagem = file;
  } else if (destino === 'bolasImagem') {
    this.bolasImagem = file;
  } else if (destino === 'conteudoImagem') {
    this.conteudoImagem = file;
  } else if (destino === 'equipeCarrossel') {
    this.equipeCarrossel.push(file);
  } else if (destino === 'outroCarrossel') {
    this.outroCarrossel.push(file);
  } else if (destino === 'carrosselFinal') {
    this.carrosselFinal.push(file);
  }
}
  

  removerImagem(lista: File[], index: number) {
    lista.splice(index, 1);
  }
salvar() {
  const formData = new FormData();

  if (this.logoImagem) {
    formData.append('file', this.logoImagem);
  }

  formData.append('text1', this.menu.headerFile || '');
  formData.append('text2', this.menu.headerText2 || '');
  formData.append('text3', this.menu.headerText3 || '');
  formData.append('text4', this.menu.headerText4 || '');
  formData.append('buttonText', this.menu.headerButtonText || '');

  // Visualizar o conteúdo do FormData
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  this.serviceapi.putdados(formData).subscribe({
    next: (res) => {
      console.log('Enviado com sucesso', res);
    },
    error: (err) => {
      console.error('Erro ao enviar', err);
    }
  });


  //salvar banner
}

salvarBanner() {
 const formData = new FormData();

this.manifestoImagens.forEach((img, i) => {
  formData.append('file', img.file); 
  formData.append('buttonText', img.buttonText);
  formData.append('buttonUrl', img.buttonUrl);
});
  this.serviceapi.postBanner(formData).subscribe({
    next: (res) => console.log('Enviado com sucesso', res),
    error: (err) => console.error('Erro ao enviar', err)
  });
}

salvartextbanner() {
  console.log('Enviando:', {
    title: this.botaobanner.buttonText,
    description: this.botaobanner.buttonUrl
  });

  this.serviceapi.puttextmanifest(
    this.botaobanner.buttonText,
    this.botaobanner.buttonUrl
  ).subscribe({
    next: res => console.log('Atualizado com sucesso', res),
    error: err => console.error('Erro ao atualizar', err)
  });
}
}