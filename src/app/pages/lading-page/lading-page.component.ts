import { Component, inject, OnInit, signal } from '@angular/core';
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
import { landingPageService } from './services/lading-page.service';
import { CarouselModule } from 'primeng/carousel';

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
    CarouselModule
  ],
  templateUrl: './lading-page.component.html',
  styleUrl: './lading-page.component.scss'
})
export class LadingPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder)
  private readonly landingPageService = inject(landingPageService);
  menuAberto = false;
  showErrors = signal(false)

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
      this.visible = true;
  }

  onSubmit() {
    this.showErrors.set(true);
    console.log('Formulário enviado:', this.form.value);
    if (this.form.valid) {
      console.log('Form enviado com sucesso:', this.form.value);
      this.visible = false;
      this.form.reset()
    } else {
      this.form.markAllAsTouched();
    }
  }

}
