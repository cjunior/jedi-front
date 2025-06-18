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
    Toast
  ],
  templateUrl: './lading-page.component.html',
  styleUrl: './lading-page.component.scss',
  providers: [MessageService]
})
export class LadingPageComponent {
  private readonly formBuilder = inject(FormBuilder)
  private readonly pregristrationService = inject(PreRegistrationService)
  private readonly messageService = inject(MessageService)

  menuAberto = false;
  showErrors = signal(false)
  isLoading = signal(false);

  form = this.formBuilder.group({
    name: ['', [Validators.minLength(6), Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
  });

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
