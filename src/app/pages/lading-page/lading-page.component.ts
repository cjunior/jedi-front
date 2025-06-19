import { Component, inject, signal } from '@angular/core';
import { CarouselComponent } from "./components/carousel/carousel.component";

import { AcordionComponent } from "./components/acordion/acordion.component";
import { FormComponent } from "./components/form/form.component";
import { CarouselContentComponent } from './components/carousel-content/carousel.component';
import { CarouselSquareComponent } from "./components/carousel-square/carousel.component";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from 'primeng/message';
import { PreRegistrationService } from '../../core/services/pre-registration.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { landingPageService } from './services/lading-page.service';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lading-page',
  imports: [
    CarouselComponent,
    AcordionComponent,
    FormComponent,
    CarouselContentComponent,
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
    CommonModule
  ],
  templateUrl: './lading-page.component.html',
  styleUrl: './lading-page.component.scss',
  providers: [MessageService]
})
export class LadingPageComponent {
  private readonly formBuilder = inject(FormBuilder)
  private readonly pregristrationService = inject(PreRegistrationService)
  private readonly messageService = inject(MessageService)

  private readonly landingPageService = inject(landingPageService);
  menuAberto = false;
  showErrors = signal(false)
  isLoading = signal(false);

  form = this.formBuilder.group({
    name: ['', [Validators.minLength(6), Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
  });
  ngOnInit() {
    this.landingPageService.getdados().subscribe({
      next: (dados) => {
        console.log('Dados recebidos:', dados);
        this.headerResponseDto = {
          urllogo: dados.headerResponseDto.logoUrl,
          projeto: dados.headerResponseDto.text1,
          conteudo: dados.headerResponseDto.text2,
          ajuda: dados.headerResponseDto.text3,
          red: dados.headerResponseDto.text4,
          buttontext: dados.headerResponseDto.buttonText
        }
        this.bannerResponseDto = {
          title: dados.bannerResponseDto.title,
          description: dados.bannerResponseDto.description
        }
        this.presentationSectionResponseDto = {
          title: dados.presentationSectionResponseDto.title,
          firstDescription: dados.presentationSectionResponseDto.firstDescription,
          secondDescription: dados.presentationSectionResponseDto.secondDescription,
          firstStatistic: dados.presentationSectionResponseDto.firstStatistic,
          secondStatistic:dados.presentationSectionResponseDto.secondStatistic,
          imgUrl: dados.presentationSectionResponseDto.imgUrl,
          imgDescription: dados.presentationSectionResponseDto.imgDescription
        }
        this.faqSectionResponseDto = {
          title: dados.faqSectionResponseDto.title,
          subtitle: dados.faqSectionResponseDto.subtitle
        }
        this.contentResponseDto = {
           title:dados.contentResponseDto.title,
        subTitle:dados.contentResponseDto.subTitle,
        description: dados.contentResponseDto.description,
        mainImg: dados.contentResponseDto.mainImg
        }
        this.contactUsResponseDto = {
          title: dados.contactUsResponseDto.title,
          subTitle: dados.contactUsResponseDto.subTitle,
          description: dados.contactUsResponseDto.description
        }
        this.carouselImages = dados.bannerResponseDto.items.map((item: any) => item.imgUrl);
      }
    })
  }

  headerResponseDto =
      {
        urllogo: './logo.svg',
        projeto: 'Projeto',
        conteudo: 'Conteúdo',
        ajuda: 'Ajuda',
        red: '#RedeJED',
        buttontext: 'Entrar'
      }

      bannerResponseDto = {
        title: "DÊ UM PLAY NO SEU FUTURO",
        description: "Curso online com formação personalizada para você empreender de forma inteligente e estratégica"

      }

      presentationSectionResponseDto = {
        title: "O projeto",
        firstDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac ullamcorper metus. Nunc cursus orci tortor, sed interdum mi commodo a.",
        secondDescription: "Duis fermentum velit at sapien iaculis tincidunt. Integer ultrices mollis sagittis. Nulla facilisi. Nulla facilisi.",
        firstStatistic: "# de estudantes",
        secondStatistic: "# de alcance",
        imgUrl: "./divos.svg",
        imgDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac ullamcorper metus."
      }

      faqSectionResponseDto = {
        title: "Perguntas frequentes",
        subtitle: "Dúvidas comuns sobre o curso",
      }

      contentResponseDto = {
        title: "CONTEÚDOS",
        subTitle:"Lorem ipsum",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac ullamcorper metus.",
        mainImg: "./fotoH.jpg"
      }
      
      contactUsResponseDto = {
        title: "Fale Conosco",
        subTitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consequat lobortis dui vitae laoreet.",
        description: "Preencha o formulário ao lado para entrar em contato."

      }

      carouselImages = [
        './fotoH.jpg',
        './fotoH2.jpg',
        './fotoH3.jpg'
      ];


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


  toggleMenu() {
    this.form.reset()
    this.menuAberto = !this.menuAberto;
  }

  visible: boolean = false;

  showDialog() {
      this.form.reset();
      this.visible = true;
  }

  async onSubmit() {
    this.showErrors.set(true);
    const completeName = this.form.value.name ?? '';
    const email = this.form.value.email ?? '';
    const cellphone = this.form.value.phone ?? '';

    if (this.form.valid) {
      this.isLoading.set(true);

      this.pregristrationService.makePreRegistration({ completeName, email, cellphone }).subscribe({
        next: (response) => {
          this.isLoading.set(false);

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: response.message
          });

          this.showErrors.set(false);
          this.visible = false;
          this.form.reset();
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Error during pre-registration:', error);
          alert('An error occurred during pre-registration. Please try again later.');
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
