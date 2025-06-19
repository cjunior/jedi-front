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
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
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
    ReactiveFormsModule,
    ConfirmDialogModule
  ],providers: [ConfirmationService],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  previewVisible = false;
  previewImage = '';
  private readonly serviceapi = inject(editService);
  private readonly confirmationService = inject(ConfirmationService);

  logo = '';
  menu = {
    headerFile: '',
    headerText1: '',
    headerText2: '',
    headerText3: '',
    headerText4: '',
    headerButtonText: '',

  };

manifestoImagens: { id?: number; file: File | string; buttonText: string; buttonUrl: string }[] = [];
botaobanner = {
  buttonText: '',
  buttonUrl: '',
 
};

  logoImagem: File | null = null;


  manifestoImagem: File | null = null;

  chamada = {
    titulo: '',
    subtitulo: ''
  };

  textoManifesto = {
    presentationSectionTitle: '',
    presentationSectionFirstDescription: '',
    presentationSectionSecondDescription: '',

    presentationSectionFirstStatistic:'',
    presentationSectionSecondStatistic:'',
    presentationSectionFile: '',
    presentationSectionImgDescription: '',

  }

  bolas = {
    titulo1: '',
    titulo2: '',
    descricao: ''
  };
  bolasImagem: File | null = null;

 equipeCarrossel: { id?: number; file: File | string }[] = [];
teamTitle = '';

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

  onEquipeFileSelect(event: any) {
  if (event.target.files && event.target.files[0]) {
    this.equipeCarrossel.push({ file: event.target.files[0] });
  }
}

onEquipeFileUpload(event: any) {
  if (event.files && event.files.length > 0) {
    for (const file of event.files) {
      this.equipeCarrossel.push({ file });
    }
  }
}

atualizarEquipeImagem(event: any, index: number) {
  const file = event.target.files[0];
  if (file) {
    this.equipeCarrossel[index].file = file;
  }
}

confirmDeleteEquipe(membro: any, index: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir este membro da equipe?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      if (membro.id) {
        this.serviceapi.DeleteTeam(membro.id).subscribe({
          next: () => {
            console.log('Removendo do array:', index);
            this.equipeCarrossel.splice(index, 1);
          },
          error: (err) => {
            console.error('Erro ao excluir membro', err);
           
             this.equipeCarrossel.splice(index, 1);
          }
        });
      } else {
        this.equipeCarrossel.splice(index, 1);
      }
    }
  });
}


confirmDelete(img: any, index: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir esta imagem?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      if (img.id) {
       this.serviceapi.deleteimage(img.id).subscribe({
  next: () => {
    console.log('Removendo do array:', index);
    this.manifestoImagens.splice(index, 1);
  },
  error: (err) => {
    console.error('Erro ao excluir imagem', err);
     this.manifestoImagens.splice(index, 1); //remover futuramente
  }
});
      } else {
        this.manifestoImagens.splice(index, 1); // REMOVE DA LISTA EM TEMPO REAL
      }
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
  // ...outros campos...

  if (dados.bannerResponseDto && dados.bannerResponseDto.items) {
    console.log('Itens recebidos do banner:', dados.bannerResponseDto.items); 
    this.manifestoImagens = dados.bannerResponseDto.items.map((item: any) => ({
      file: item.imgUrl,
      buttonText: item.buttonText || '',
      buttonUrl: item.buttonUrl || '',
      id: item.id // Adicionando o ID para exclusão
    }));
  } else {
    this.manifestoImagens = [];
  }

  if (dados.teamResponseDto && dados.teamResponseDto.items) {
  this.equipeCarrossel = dados.teamResponseDto.items.map((item: any) => ({
    id: item.id,
    file: item.imgUrl // string (URL)
  }));
  this.teamTitle = dados.teamResponseDto.title || '';
} else {
  this.equipeCarrossel = [];
  this.teamTitle = '';
}

  // ...outros campos...
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


  enviarEquipe() {
  const formData = new FormData();
  formData.append('teamTitle', this.teamTitle || '');
  this.equipeCarrossel.forEach((membro) => {
    if (membro.file instanceof File) {
      formData.append('file', membro.file);
    }
  });
  this.serviceapi.postTeam(formData).subscribe({
    next: (res) => console.log('Equipe enviada', res),
    error: (err) => console.error('Erro ao enviar equipe', err)
  });
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
  // --- Atualização dos banners existentes (PUT) ---
  const formDataPut = new FormData();
  if (this.logoImagem) {
    formDataPut.append('headerFile', this.logoImagem);
  }
  formDataPut.append('headerText1', this.menu.headerFile || '');
  formDataPut.append('headerText2', this.menu.headerText2 || '');
  formDataPut.append('headerText3', this.menu.headerText3 || '');
  formDataPut.append('headerText4', this.menu.headerText4 || '');
  formDataPut.append('headerButtonText', this.menu.headerButtonText || '');
  formDataPut.append('bannerTitle', this.botaobanner.buttonText || '');
  formDataPut.append('bannerDescription', this.botaobanner.buttonUrl || '');

  formDataPut.append('presentationSectionTitle', this.textoManifesto.presentationSectionTitle || '');
  formDataPut.append('presentationSectionFirstDescription', this.textoManifesto.presentationSectionFirstDescription || '');
  formDataPut.append('presentationSectionSecondDescription', this.textoManifesto.presentationSectionSecondDescription || '');
  formDataPut.append('presentationSectionFirstStatistic', this.textoManifesto.presentationSectionFirstStatistic || '');
  formDataPut.append('presentationSectionSecondStatistic', this.textoManifesto.presentationSectionSecondStatistic || '');
  formDataPut.append('presentationSectionImgDescription', this.textoManifesto.presentationSectionImgDescription || '');

  if (this.conteudoImagem) {
    formDataPut.append('presentationSectionFile', this.conteudoImagem);
  }

  // --- Banners existentes (com id) ---
  this.manifestoImagens
    .filter(img => img.id !== undefined)
    .forEach((img, i) => {
      formDataPut.append(`bannerItems[${i}].id`, img.id!.toString());
      if (img.file instanceof File) {
        formDataPut.append(`bannerItems[${i}].file`, img.file);
      }
      formDataPut.append(`bannerItems[${i}].buttonText`, img.buttonText || '');
      formDataPut.append(`bannerItems[${i}].buttonUrl`, img.buttonUrl || '');
    });

  // --- Equipe existente (com id) ---
  const equipeExistente = this.equipeCarrossel.filter(membro => membro.id !== undefined);
  if (equipeExistente.length > 0) {
    formDataPut.append('teamTitle', this.teamTitle || '');
    equipeExistente.forEach((membro, i) => {
      formDataPut.append(`teamItems[${i}].id`, membro.id!.toString());
      if (membro.file instanceof File) {
        formDataPut.append(`teamItems[${i}].file`, membro.file);
      }
    });
  }

  // Visualizar o conteúdo do FormData PUT
  for (const pair of formDataPut.entries()) {
    console.log('PUT', pair[0], pair[1]);
  }

  this.serviceapi.putdadosall(formDataPut).subscribe({
    next: (res) => {
      console.log('Atualização enviada com sucesso', res);
    },
    error: (err) => {
      console.error('Erro ao atualizar', err);
    }
  });

  // --- Cadastro de novos banners (POST) ---
  const novosBanners = this.manifestoImagens.filter(img => !img.id);
  if (novosBanners.length > 0) {
    const formDataPost = new FormData();
    novosBanners.forEach((img) => {
      if (img.file instanceof File) {
        formDataPost.append('file', img.file);
      }
      formDataPost.append('buttonText', img.buttonText || '');
      formDataPost.append('buttonUrl', img.buttonUrl || '');
    });

    for (const pair of formDataPost.entries()) {
      console.log('POST BANNER', pair[0], pair[1]);
    }

    this.serviceapi.postBanner(formDataPost).subscribe({
      next: (res) => {
        console.log('Novos banners enviados com sucesso', res);
      },
      error: (err) => {
        console.error('Erro ao cadastrar novos banners', err);
      }
    });
  }

  // --- Cadastro de novos membros da equipe (POST) ---
  const novosMembros = this.equipeCarrossel.filter(membro => !membro.id);
  if (novosMembros.length > 0) {
    const formDataPostEquipe = new FormData();
    formDataPostEquipe.append('teamTitle', this.teamTitle || '');
    novosMembros.forEach((membro) => {
      if (membro.file instanceof File) {
        formDataPostEquipe.append('file', membro.file);
      }
    });

    for (const pair of formDataPostEquipe.entries()) {
      console.log('POST EQUIPE', pair[0], pair[1]);
    }

    this.serviceapi.postTeam(formDataPostEquipe).subscribe({
      next: (res) => {
        console.log('Novos membros da equipe enviados com sucesso', res);
      },
      error: (err) => {
        console.error('Erro ao cadastrar novos membros da equipe', err);
      }
    });
  }
}


}