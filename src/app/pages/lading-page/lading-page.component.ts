import { Component, inject, signal } from '@angular/core';
import { CarouselComponent } from './components/carousel/carousel.component';

import { AcordionComponent } from './components/acordion/acordion.component';
import { CarouselSquareComponent } from './components/carousel-square/carousel.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Message } from 'primeng/message';
import { PreRegistrationService } from '../../core/services/pre-registration.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { landingPageService } from './services/lading-page.service';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CarouselContentComponent } from './components/carousel-content/carousel.component';
import { Checkbox } from 'primeng/checkbox';

interface BlogCard {
  id: number;
  titulo: string;
  autor: string;
  data: string;
  tempoLeitura: string;
  imagem: string;
  descricao: string;
  descricaoImagem: string;
}

@Component({
  selector: 'app-lading-page',
  imports: [
    CarouselComponent,
    AcordionComponent,
    CarouselSquareComponent,
    DropdownComponent,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    Message,
    FormsModule,
    ReactiveFormsModule,
    Toast,
    CarouselModule,
    CommonModule,
    ProgressSpinnerModule,
    FooterComponent,
    CarouselContentComponent,
    Checkbox
  ],
  templateUrl: './lading-page.component.html',
  styleUrl: './lading-page.component.scss',
  providers: [MessageService],
})
export class LadingPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly pregristrationService = inject(PreRegistrationService);
  private readonly messageService = inject(MessageService);
  private readonly landingPageService = inject(landingPageService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  menuAberto = false;
  showErrors = signal(false);
  isLoading = signal(false);
  isInitialLoading = true;
  imagesLoaded = false;
  dataLoaded = false;
  loadingProgress = 0;
  confirmVisible = false;
  successVisible = false;
  teamResponseDto = {
    equipttext: 'Equipe',
  };
  showBackToTop = false;

  blogDestaque: BlogCard | null = null;
  redeJediSectionDto = {
    titulo: 'REDE JEDI',
  };
  resumoDoPost: string = '';

  form = this.formBuilder.group({
    name: ['', [Validators.minLength(6), Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    phone: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(11)],
    ],
    acceptedTerms: [false, Validators.required]
  });
  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.showBackToTop = window.pageYOffset > 300;
    });
    
    // Iniciar pré-carregamento das imagens
    this.preloadImages();
    
    if (this.blogDestaque?.descricao) {
      const div = document.createElement('div');
      div.innerHTML = this.blogDestaque.descricao;
      const firstParagraph = div.querySelector('p');
      this.resumoDoPost = firstParagraph?.outerHTML || '';
    }
    this.landingPageService.getdados().subscribe({
      next: (dados) => {
        this.dataLoaded = true;
        this.loadingProgress = Math.max(this.loadingProgress, 50) + 50; // Adiciona 50% quando dados carregam
        this.checkLoadingComplete();
        const blogItems = dados.blogSectionResponseDto?.items || [];

        this.redeJediSectionDto = {
          titulo: (dados.redeJediSectionDto.titulo || '')
            .replace(/\s+/g, ' ')
            .trim(),
        };
        this.headerResponseDto = {
          urllogo: dados.headerResponseDto.logoUrl,
          projeto: (dados.headerResponseDto.text1 || '')
            .replace(/\s+/g, ' ')
            .trim(),
          conteudo: (dados.headerResponseDto.text2 || '')
            .replace(/\s+/g, ' ')
            .trim(),
          ajuda: (dados.headerResponseDto.text3 || '')
            .replace(/\s+/g, ' ')
            .trim(),
          red: (dados.headerResponseDto.text4 || '')
            .replace(/\s+/g, ' ')
            .trim(),
          buttontext: (dados.headerResponseDto.buttonText || '')
            .replace(/\s+/g, ' ')
            .trim(),
        };

        this.bannerResponseDto = {
          title: (dados.bannerResponseDto.title || '')
            .replace(/\s+/g, ' ')
            .trim(),
          description: (dados.bannerResponseDto.description || '')
            .replace(/\s+/g, ' ')
            .trim(),
        };

        this.teamResponseDto = {
          equipttext: (dados.teamResponseDto.title || '')
            .replace(/\s+/g, ' ')
            .trim(),
        };

        this.presentationSectionResponseDto = {
          title: (dados.presentationSectionResponseDto.title || '')
            .replace(/\s+/g, ' ')
            .trim(),
          firstDescription: (
            dados.presentationSectionResponseDto.firstDescription || ''
          )
            .replace(/\s+/g, ' ')
            .trim(),
          secondDescription: (
            dados.presentationSectionResponseDto.secondDescription || ''
          )
            .replace(/\s+/g, ' ')
            .trim(),
          firstStatistic: (
            dados.presentationSectionResponseDto.firstStatistic || ''
          )
            .replace(/\s+/g, ' ')
            .trim(),
          secondStatistic: (
            dados.presentationSectionResponseDto.secondStatistic || ''
          )
            .replace(/\s+/g, ' ')
            .trim(),
          imgUrl: dados.presentationSectionResponseDto.imgUrl,
          imgDescription: (
            dados.presentationSectionResponseDto.imgDescription || ''
          )
            .replace(/\s+/g, ' ')
            .trim(),
        };

        this.faqSectionResponseDto = {
          title: (dados.faqSectionResponseDto.title || '')
            .replace(/\s+/g, ' ')
            .trim(),
          subtitle: (dados.faqSectionResponseDto.subtitle || '')
            .replace(/\s+/g, ' ')
            .trim(),
        };

        this.contentResponseDto = {
          title: (dados.contentResponseDto.title || '')
            .replace(/\s+/g, ' ')
            .trim(),
          subTitle: (dados.contentResponseDto.subTitle || '')
            .replace(/\s+/g, ' ')
            .trim(),
          description: (dados.contentResponseDto.description || '')
            .replace(/\s+/g, ' ')
            .trim(),
          mainImg: dados.contentResponseDto.mainImg,
          mainImgDescription: (dados.contentResponseDto.mainImgText || '')
            .replace(/\s+/g, ' ')
            .trim(),
        };

        this.contactUsResponseDto = {
          title: (dados.contactUsResponseDto.title || '')
            .replace(/\s+/g, ' ')
            .trim(),
          subTitle: (dados.contactUsResponseDto.subTitle || '')
            .replace(/\s+/g, ' ')
            .trim(),
          description: (dados.contactUsResponseDto.description || '')
            .replace(/\s+/g, ' ')
            .trim(),
        };

        this.blogDestaque =
          blogItems.length > 0
            ? {
                id: blogItems[0].id,
                titulo: (blogItems[0].title || '').replace(/\s+/g, ' ').trim(),
                autor: (blogItems[0].author || '').replace(/\s+/g, ' ').trim(),
                data: (blogItems[0].date || '').replace(/\s+/g, ' ').trim(),
                tempoLeitura: (blogItems[0].readingTime || '')
                  .replace(/\s+/g, ' ')
                  .trim(),
                imagem: blogItems[0].imageUrl,
                descricao: (blogItems[0].description || ''),
                descricaoImagem: (blogItems[0].imageDescription || '')
                  .replace(/\s+/g, ' ')
                  .trim(),
              }
            : null;

        // Restante dos cards
        this.cards = blogItems.slice(1).map((item: any) => ({
          id: item.id,
          titulo: (item.title || '').replace(/\s+/g, ' ').trim(),
          autor: (item.author || '').replace(/\s+/g, ' ').trim(),
          data: (item.date || '').replace(/\s+/g, ' ').trim(),
          tempoLeitura: (item.readingTime || '').replace(/\s+/g, ' ').trim(),
          imagem: item.imageUrl,
          descricaoImagem: (item.imageDescription || '')
            .replace(/\s+/g, ' ')
            .trim(),
        }));

        this.carouselImages = (dados.bannerResponseDto.items || []).map(
          (item: any) => ({
            imgUrl: item.imgUrl,
            buttonText: item.buttonText,
            buttonUrl: item.buttonUrl,
          })
        );       },
       error: (error) => {
         this.dataLoaded = true;
         this.loadingProgress = 100;
         this.checkLoadingComplete();
         this.messageService.add({
           severity: 'error',
           summary: 'Erro',
           detail: 'Ocorreu um erro ao carregar os dados.',
         });
       },
     });
   }

  // Método para verificar se tanto dados quanto imagens foram carregados
  private checkLoadingComplete() {
    if (this.dataLoaded && this.imagesLoaded) {
      this.loadingProgress = 100;
      // Pequeno delay para uma transição mais suave
      setTimeout(() => {
        this.isInitialLoading = false;
      }, 800);
    }
  }

  // Método para pré-carregar todas as imagens importantes
  private preloadImages() {
    const imageUrls = [
      '/logo.svg',
      './diva4.jpg',
      './ondas.svg',
      './onda2.svg',
      './step/ttt.jpg',
      './step/Passo1.svg',
      './step/Passo2.svg',
      './step/Passo3.svg',
      './step/Passo4.svg',
      './fotoH.jpg',
      './edit.svg',
      './tes.svg',
      '../../../../public/icons/instagram.svg',
      '../../../../public/icons/youtube.svg',
      '../../../../public/icons/email.png'
    ];

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    imageUrls.forEach(url => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        this.loadingProgress = Math.round((loadedCount / totalImages) * 50); // 50% para imagens
        if (loadedCount === totalImages) {
          this.imagesLoaded = true;
          this.checkLoadingComplete();
        }
      };
      img.onerror = () => {
        loadedCount++;
        this.loadingProgress = Math.round((loadedCount / totalImages) * 50); // 50% para imagens
        if (loadedCount === totalImages) {
          this.imagesLoaded = true;
          this.checkLoadingComplete();
        }
      };
      img.src = url;
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  openCarouselLink(url: string) {
    window.open(url, '_blank');
  }

  headerResponseDto = {
    urllogo: './logo.svg',
    projeto: 'Projeto',
    conteudo: 'Conteúdo',
    ajuda: 'Ajuda',
    red: '#RedeJED',
    buttontext: 'Entrar',
  };

  bannerResponseDto = {
    title: 'DÊ UM PLAY NO SEU FUTURO',
    description:
      'Curso online com formação personalizada para você empreender de forma inteligente e estratégica',
  };

  presentationSectionResponseDto = {
    title: 'O projeto',
    firstDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac ullamcorper metus. Nunc cursus orci tortor, sed interdum mi commodo a.',
    secondDescription:
      'Duis fermentum velit at sapien iaculis tincidunt. Integer ultrices mollis sagittis. Nulla facilisi. Nulla facilisi.',
    firstStatistic: '# de estudantes',
    secondStatistic: '# de alcance',
    imgUrl: './divos.svg',
    imgDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac ullamcorper metus.',
  };

  faqSectionResponseDto = {
    title: 'Perguntas frequentes',
    subtitle: 'Dúvidas comuns sobre o curso',
  };

  contentResponseDto = {
    title: 'CONTEÚDOS',
    subTitle: 'Lorem ipsum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac ullamcorper metus.',
    mainImg: './fotoH.jpg',
    mainImgDescription: 'PERCURSO BÁSICO',
  };

  contactUsResponseDto = {
    title: 'Fale Conosco',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consequat lobortis dui vitae laoreet.',
    description: 'Preencha o formulário ao lado para entrar em contato.',
  };

  carouselImages: {
    imgUrl: string;
    buttonText?: string;
    buttonUrl?: string;
  }[] = [{ imgUrl: './fotoH.jpg' }];

  cards = [
    {
      id: 0,
      imagem: './fotoend3.svg',
      titulo: 'Lorem ipsum dolor sit amet, consec...',
      autor: 'Maria',
      data: '08 de Abril',
      tempoLeitura: '2min de leitura',
    },
    {
      id: 0,
      imagem: './fotoend3.svg',
      titulo: 'Lorem ipsum dolor sit amet, consec...',
      autor: 'Maria',
      data: '08 de Abril',
      tempoLeitura: '2min de leitura',
    },
    {
      id: 0,
      imagem: './fotoend3.svg',
      titulo: 'Lorem ipsum dolor sit amet, consec...',
      autor: 'Maria',
      data: '08 de Abril',
      tempoLeitura: '2min de leitura',
    },
  ];

  // Dados para o carrossel de conteúdo
  contentItems = [
    {
      title: 'Sua Ideia de Negócio',
      image: './step/Passo1.svg',
    },
    {
      title: 'Seu produto na internet',
      image: './step/Passo1.svg',
    },
    {
      title: 'Venda mais na internet',
      image: './step/Passo3.svg',
    },
    {
      title: 'Ferramentas de apoio ao seu negócio',
      image: './step/Passo4.svg',
    },
  ];

  toggleMenu() {
    this.form.reset();
    this.menuAberto = !this.menuAberto;
  }

  visible: boolean = false;

  showDialog() {
    this.form.reset();
    this.visible = true;
  }

  openPost(postId: number) {
    window.open(`/noticias/${postId}`, '_blank');
  }

  redirectToBlog() {
    this.router.navigate(['/noticias']);
    window.scrollTo(0, 0);
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  redirectToConfigs() {
    this.router.navigate(['/configuracoes']);
  }

  async onSubmit() {
    this.showErrors.set(true);

    if (this.form.valid) {
      // Abrir modal de confirmação
      this.confirmVisible = true;
    } else {
      this.form.markAllAsTouched();
    }
  }

  confirmSubmit() {
    const completeName = this.form.value.name ?? '';
    const email = this.form.value.email ?? '';
    const cellphone = this.form.value.phone ?? '';
    const acceptedTerms = this.form.value.acceptedTerms ?? false;

    this.confirmVisible = false;
    this.isLoading.set(true);

    this.pregristrationService
      .makePreRegistration({ completeName, email, cellphone, acceptedTerms })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);

          this.showErrors.set(false);
          this.visible = false;
          this.confirmVisible = false
          this.successVisible = true;
          this.form.reset();
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Error during pre-registration:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail:
              `${error?.error?.errors?.cellphone || ``} ${
                error?.error?.message || ``
              }` || 'Ocorreu um erro durante o pré-cadastro.',
          });
        },
      });
  }

  cancelSubmit() {
    this.confirmVisible = false;
  }
}
