import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PastaService } from '../../../../../../core/services/pasta.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { generateSlugFromNome } from '../../../../../../core/utils/slug-helper';

@Component({
  selector: 'app-adicionar-pasta',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Textarea,
    DialogModule,
    CommonModule
  ],
  templateUrl: './adicionar-pasta.component.html',
  styleUrl: './adicionar-pasta.component.scss'
})
export class AdicionarPastaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pastaService = inject(PastaService);
  private readonly messageService = inject(MessageService);

  isVisible = input.required<boolean>();
  closed = output<void>();
  pastaCreated = output<boolean>();

  pastaForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.pastaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      slug: ['']
    });
  }

  onClose(): void {
    this.pastaForm.reset();
    this.closed.emit();
  }

  onSubmit(): void {
    if (this.pastaForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const { nome, descricao, slug } = this.pastaForm.value;
    const slugFinal = slug?.trim() || undefined;
    const descricaoFinal = descricao?.trim() || undefined;

    this.pastaService.createPasta(nome, null, slugFinal, descricaoFinal).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Pasta criada',
          detail: 'Pasta criada com sucesso.'
        });
        this.pastaForm.reset();
        this.pastaCreated.emit(true);
        this.onClose();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível criar a pasta.'
        });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
