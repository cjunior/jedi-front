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
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    Message,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './lading-page.component.html',
  styleUrl: './lading-page.component.scss'
})
export class LadingPageComponent {
  private readonly formBuilder = inject(FormBuilder)
  private readonly landingPageService = inject(landingPageService);
  menuAberto = false;
  showErrors = signal(false)

  form = this.formBuilder.group({
    name: ['', [Validators.minLength(6), Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
  });

  menu = 
    {
      projeto: 'Projeto',
      conteudo: 'Conteúdo',
      ajuda: 'Ajuda',
      red: '#RedeJED',
      buttontext: 'Entrar'
    }
  

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
       
      },
      error: (err) => {
        console.error('Erro ao buscar dados:', err);
      }
    });
  }

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
