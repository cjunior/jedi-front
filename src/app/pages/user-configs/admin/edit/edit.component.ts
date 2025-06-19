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
import { ConfirmationService, MessageService } from 'primeng/api';
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
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  previewVisible = false;
  previewImage = '';
  private readonly serviceapi = inject(editService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
isLoading = false;
  logo = '';
  logoPreview: string | null = null;

  logoPreviewUrl: string = '';
  logoImagem: File | null = null;
  menu = {
    headerFile: '',
    headerText2: '',
    headerText3: '',
    headerText4: '',
    headerButtonText: '',
  };

  manifestoImagens: {
    id?: number;
    file: File | string;
    buttonText: string;
    buttonUrl: string;
  }[] = [];
  botaobanner = {
    buttonText: '',
    buttonUrl: '',
  };

  faqTitulo: string = '';
  faqSubtitulo: string = '';
  faqItens: {
    id: number;
    question: string;
    answer: string;
    position: number;
  }[] = [];

  manifestoImagem: File | null = null;

  chamada = {
    titulo: '',
    subtitulo: '',
  };

  presentationSectionFile: File | null = null;
  presentationSectionFilePreview: string | null = null;

  textoManifesto = {
    presentationSectionTitle: '',
    presentationSectionFirstDescription: '',
    presentationSectionSecondDescription: '',

    presentationSectionFirstStatistic: '',
    presentationSectionSecondStatistic: '',
    presentationSectionFile: '',
    presentationSectionImgDescription: '',
  };

  bolas = {
    titulo1: '',
    titulo2: '',
    descricao: '',
  };
  bolasImagem: File | null = null;

  equipeCarrossel: { id?: number; file: File | string }[] = [];
  teamTitle = '';

  conteudo = {
    contentTitle: '',
    contentSubTitle: '',
    contentDescription: '',
    contentMainImage: '',
  };
  conteudoImagem: File | null = null;

  outroCarrossel: { id?: number; file: string | File; imgText?: string }[] = [];

  acordions: { titulo: string; subtitulo: string; texto: string }[] = [];

  footer = {
    titulo: '',
    subtitulo: '',
    descricao: '',
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
    { key: 'carrosselFinal', label: 'Carrossel Final de Imagens' },
  ];

  ngOnInit() {
    this.serviceapi.getdados().subscribe({
      next: (dados) => {
        console.log('Dados recebidos:', dados);
        this.carregarDados(dados);
      },
      error: (err) => {
        console.error('Erro ao buscar dados:', err);
      },
    });
  }

  onOutroCarrosselFileUpload(event: any) {
    if (event.files && event.files.length > 0) {
      for (const file of event.files) {
        this.outroCarrossel.push({ file });
      }
    }
  }

  atualizarOutroCarrosselImagem(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.outroCarrossel[index].file = file;
    }
  }

  confirmDeleteOutroCarrossel(item: any, index: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta imagem?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (item.id) {
          this.serviceapi.Deletecontet(item.id).subscribe({
            next: () => this.outroCarrossel.splice(index, 1),
            error: (err) => {
              console.error('Erro ao excluir imagem', err);

              this.outroCarrossel.splice(index, 1);
            },
          });
        } else {
          this.outroCarrossel.splice(index, 1);
        }
      },
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
            },
          });
        } else {
          this.equipeCarrossel.splice(index, 1);
        }
      },
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
              this.manifestoImagens.splice(index, 1);
            },
          });
        } else {
          this.manifestoImagens.splice(index, 1);
        }
      },
    });
  }

  onManifestoSelect(event: any) {
    if (event.files && event.files.length > 0) {
      for (const file of event.files) {
        this.manifestoImagens.push({
          file,
          buttonText: '',
          buttonUrl: '',
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
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(this.logoImagem as Blob);
    }
  }

  onPresentationSectionFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.presentationSectionFile = event.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.presentationSectionFilePreview = e.target.result;
      };
      reader.readAsDataURL(this.presentationSectionFile as Blob);
    }
  }

  carregarDados(dados: any) {
    if (dados.contactUsResponseDto) {
      this.footer.titulo = dados.contactUsResponseDto.title || '';
      this.footer.subtitulo = dados.contactUsResponseDto.subTitle || '';
      this.footer.descricao = dados.contactUsResponseDto.description || '';
    }
    if (dados.teamResponseDto) {
      this.teamTitle = dados.teamResponseDto.title || '';
    }
    if (dados.bannerResponseDto) {
      this.botaobanner.buttonText = dados.bannerResponseDto.title || '';
      this.botaobanner.buttonUrl = dados.bannerResponseDto.description || '';
    }
    if (dados.presentationSectionResponseDto) {
      this.textoManifesto.presentationSectionTitle =
        dados.presentationSectionResponseDto.title || '';
      this.textoManifesto.presentationSectionFirstDescription =
        dados.presentationSectionResponseDto.firstDescription || '';
      this.textoManifesto.presentationSectionSecondDescription =
        dados.presentationSectionResponseDto.secondDescription || '';
      this.textoManifesto.presentationSectionFirstStatistic =
        dados.presentationSectionResponseDto.firstStatistic || '';
      this.textoManifesto.presentationSectionSecondStatistic =
        dados.presentationSectionResponseDto.secondStatistic || '';
      this.textoManifesto.presentationSectionFile =
        dados.presentationSectionResponseDto.imgUrl || '';
      this.textoManifesto.presentationSectionImgDescription =
        dados.presentationSectionResponseDto.imgDescription || '';
      this.presentationSectionFile = null;
      this.presentationSectionFilePreview = null;
    }

    if (dados.bannerResponseDto && dados.bannerResponseDto.items) {
      this.manifestoImagens = dados.bannerResponseDto.items.map(
        (item: any) => ({
          file: item.imgUrl,
          buttonText: item.buttonText || '',
          buttonUrl: item.buttonUrl || '',
          id: item.id,
        })
      );
    } else {
      this.manifestoImagens = [];
    }

    if (dados.teamResponseDto && dados.teamResponseDto.items) {
      this.equipeCarrossel = dados.teamResponseDto.items.map((item: any) => ({
        id: item.id,
        file: item.imgUrl,
      }));
      this.teamTitle = dados.teamResponseDto.title || '';
    } else {
      this.equipeCarrossel = [];
      this.teamTitle = '';
    }

    if (dados.contentResponseDto) {
      this.conteudo = {
        contentTitle: dados.contentResponseDto.title || '',
        contentSubTitle: dados.contentResponseDto.subTitle || '',
        contentDescription: dados.contentResponseDto.description || '',
        contentMainImage: dados.contentResponseDto.mainImg || '',
      };

      // Carregar o carrossel diverso
      if (dados.contentResponseDto.items) {
        this.outroCarrossel = dados.contentResponseDto.items.map(
          (item: any) => ({
            id: item.id,
            file: item.imgUrl,
            imgText: item.imgText || '',
          })
        );
      } else {
        this.outroCarrossel = [];
      }
    } else {
      this.conteudo = {
        contentTitle: '',
        contentSubTitle: '',
        contentDescription: '',
        contentMainImage: '',
      };
      this.outroCarrossel = [];
    }

    if (dados.faqSectionResponseDto) {
      this.faqTitulo = dados.faqSectionResponseDto.title || '';
      this.faqSubtitulo = dados.faqSectionResponseDto.subtitle || '';
      this.faqItens = dados.faqSectionResponseDto.items || [];
    } else {
      this.faqTitulo = '';
      this.faqSubtitulo = '';
      this.faqItens = [];
    }

    if (dados.headerResponseDto) {
      this.logoPreviewUrl = dados.headerResponseDto.logoUrl || '';
      this.logoImagem = null;

      // Menu
      this.menu = {
        headerFile: dados.headerResponseDto.text1 || '',
        headerText2: dados.headerResponseDto.text2 || '',
        headerText3: dados.headerResponseDto.text3 || '',
        headerText4: dados.headerResponseDto.text4 || '',
        headerButtonText: dados.headerResponseDto.buttonText || '',
      };
    } else {
      this.logoPreviewUrl = '';
      this.logoImagem = null;
      this.menu = {
        headerFile: '',
        headerText2: '',
        headerText3: '',
        headerText4: '',
        headerButtonText: '',
      };
    }
    this.estadoInicial = this.getEstadoParaComparacao();
    
  }

  openPreview(imgPath: string) {
    this.previewImage = imgPath;
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

  conteudoImagemPreview: string | null = null;
  onConteudoFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.conteudoImagem = event.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.conteudoImagemPreview = e.target.result;
      };
      reader.readAsDataURL(this.conteudoImagem as Blob);
    }
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
      error: (err) => console.error('Erro ao enviar equipe', err),
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

  estadoInicial: any = {};
  
getEstadoParaComparacao() {
  return JSON.stringify({
    footer: { ...this.footer },
    teamTitle: this.teamTitle,
    botaobanner: { ...this.botaobanner },
    textoManifesto: { ...this.textoManifesto },
    manifestoImagens: this.manifestoImagens.map(img => ({
      buttonText: img.buttonText,
      buttonUrl: img.buttonUrl,
      id: img.id,
      // NÃO inclua img.file se for File!
      file: typeof img.file === 'string' ? img.file : null
    })),
    equipeCarrossel: this.equipeCarrossel.map(m => ({
      id: m.id,
      file: typeof m.file === 'string' ? m.file : null
    })),
    conteudo: { ...this.conteudo },
    outroCarrossel: this.outroCarrossel.map(o => ({
      id: o.id,
      imgText: o.imgText,
      file: typeof o.file === 'string' ? o.file : null
    })),
    faqTitulo: this.faqTitulo,
    faqSubtitulo: this.faqSubtitulo,
    faqItens: this.faqItens.map(f => ({ ...f })),
    menu: { ...this.menu },
    logoPreviewUrl: this.logoPreviewUrl,
  });
}
  salvar() {
   const estadoAtual = this.getEstadoParaComparacao();
if (estadoAtual === this.estadoInicial) {
  this.isLoading = false;
  this.messageService.add({
    severity: 'info',
    summary: 'Nada alterado',
    detail: 'Nenhuma alteração detectada.'
  });
  return;
}

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

    formDataPut.append(
      'presentationSectionTitle',
      this.textoManifesto.presentationSectionTitle || ''
    );
    formDataPut.append(
      'presentationSectionFirstDescription',
      this.textoManifesto.presentationSectionFirstDescription || ''
    );
    formDataPut.append(
      'presentationSectionSecondDescription',
      this.textoManifesto.presentationSectionSecondDescription || ''
    );
    formDataPut.append(
      'presentationSectionFirstStatistic',
      this.textoManifesto.presentationSectionFirstStatistic || ''
    );
    formDataPut.append(
      'presentationSectionSecondStatistic',
      this.textoManifesto.presentationSectionSecondStatistic || ''
    );
    formDataPut.append(
      'presentationSectionImgDescription',
      this.textoManifesto.presentationSectionImgDescription || ''
    );

    formDataPut.append('contactTitle', this.footer.titulo || '');
    formDataPut.append('contactSubTitle', this.footer.subtitulo || '');
    formDataPut.append('contactDescription', this.footer.descricao || '');

    if (this.conteudoImagem) {
      formDataPut.append('presentationSectionFile', this.conteudoImagem);
    }

    formDataPut.append('contentTitle', this.conteudo.contentTitle || '');
    formDataPut.append('contentSubTitle', this.conteudo.contentSubTitle || '');
    formDataPut.append(
      'contentDescription',
      this.conteudo.contentDescription || ''
    );
    if (this.conteudoImagem) {
      formDataPut.append('contentMainImage', this.conteudoImagem);
    }

    // --- FAQ (accordions) ---
    if (this.faqItens && this.faqItens.length > 0) {
      this.faqItens.forEach((faq, i) => {
        formDataPut.append(
          `faqItems[${i}].id`,
          faq.id ? faq.id.toString() : '0'
        );
        formDataPut.append(`faqItems[${i}].question`, faq.question || '');
        formDataPut.append(`faqItems[${i}].answer`, faq.answer || '');
      });
    }
    formDataPut.append('faqTitle', this.faqTitulo || '');
    formDataPut.append('faqSubtitle', this.faqSubtitulo || '');

    // --- Banners existentes (com id) ---
    this.manifestoImagens
      .filter((img) => img.id !== undefined)
      .forEach((img, i) => {
        formDataPut.append(`bannerItems[${i}].id`, img.id!.toString());
        if (img.file instanceof File) {
          formDataPut.append(`bannerItems[${i}].file`, img.file);
        }
        formDataPut.append(
          `bannerItems[${i}].buttonText`,
          img.buttonText || ''
        );
        formDataPut.append(`bannerItems[${i}].buttonUrl`, img.buttonUrl || '');
      });

    // --- Equipe existente (com id) ---
    const equipeExistente = this.equipeCarrossel.filter(
      (membro) => membro.id !== undefined
    );
    if (equipeExistente.length > 0) {
      formDataPut.append('teamTitle', this.teamTitle || '');
      equipeExistente.forEach((membro, i) => {
        formDataPut.append(`teamItems[${i}].id`, membro.id!.toString());
        if (membro.file instanceof File) {
          formDataPut.append(`teamItems[${i}].file`, membro.file);
        }
      });
    }

    // --- Carrossel Diverso existente (com id) ---
    const diversoExistente = this.outroCarrossel.filter(
      (item) => item.id !== undefined
    );
    if (diversoExistente.length > 0) {
      diversoExistente.forEach((item, i) => {
        formDataPut.append(`contentCarousel[${i}].id`, item.id!.toString());
        if (item.file instanceof File) {
          formDataPut.append(`contentCarousel[${i}].file`, item.file);
        }
        formDataPut.append(`contentCarousel[${i}].imgText`, item.imgText || '');
      });
    }

    // Visualizar o conteúdo do FormData PUT
    for (const pair of formDataPut.entries()) {
      console.log('PUT', pair[0], pair[1]);
    }

    this.serviceapi.putdadosall(formDataPut).subscribe({
      next: (res) => {
        console.log('Atualização enviada com sucesso', res);
         this.isLoading = false;
         this.estadoInicial = this.getEstadoParaComparacao();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Alterações salvas com sucesso.'
    });
      },
      error: (err) => {
        console.error('Erro ao atualizar', err);
         this.isLoading = false;
           
      },
    });

    const novosBanners = this.manifestoImagens.filter((img) => !img.id);
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
           this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao cadastrar novos banners', err);
           this.isLoading = false;
        },
      });
    }

    const novosMembros = this.equipeCarrossel.filter((membro) => !membro.id);
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
           this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao cadastrar novos membros da equipe', err);
           this.isLoading = false;
        },
      });
    }

    const novosDiversos = this.outroCarrossel.filter((item) => !item.id);
    if (novosDiversos.length > 0) {
      const formDataPostDiverso = new FormData();

      novosDiversos.forEach((item) => {
        if (item.file instanceof File) {
          formDataPostDiverso.append('files', item.file);
        }
      });

      novosDiversos.forEach((item) => {
        formDataPostDiverso.append('imgTexts', item.imgText || '');
      });

      this.serviceapi.postcontent(formDataPostDiverso).subscribe({
        next: (res) => {
          console.log(
            'Novos itens do carrossel diverso enviados com sucesso',
            res
            
          );
           this.isLoading = false;
        },
        error: (err) => {
          console.error(
            'Erro ao cadastrar novos itens do carrossel diverso',
            err
          );
           this.isLoading = false;
        },
      });
    }
  }
}
