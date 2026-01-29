import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PastaService } from '../../../../../../core/services/pasta.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { Pasta } from '../../../../../results/results-data';
import { generateSlugFromNome } from '../../../../../../core/utils/slug-helper';

@Component({
  selector: 'app-editar-pasta',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Textarea,
    DialogModule,
    CommonModule
  ],
  templateUrl: './editar-pasta.component.html',
  styleUrl: './editar-pasta.component.scss'
})
export class EditarPastaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pastaService = inject(PastaService);
  private readonly messageService = inject(MessageService);

  isVisible = input.required<boolean>();
  pastaData = input<Pasta | null>(null);
  closed = output<void>();
  pastaUpdated = output<boolean>();

  pastaForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.pastaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      slug: ['']
    });

    // Atualiza o formulário quando pastaData muda
    effect(() => {
      const pasta = this.pastaData();
      if (pasta && this.isVisible()) {
        this.pastaForm.patchValue({
          nome: pasta.nome,
          descricao: pasta.descricao || '',
          slug: pasta.slug || ''
        });
      }
    });

    // Gera slug automaticamente quando o nome muda (apenas se slug estiver vazio)
    this.pastaForm.get('nome')?.valueChanges.subscribe(nome => {
      const slugAtual = this.pastaForm.get('slug')?.value;
      if (nome && (!slugAtual || slugAtual === generateSlugFromNome(this.pastaData()?.nome || ''))) {
        const slugGerado = generateSlugFromNome(nome);
        this.pastaForm.get('slug')?.setValue(slugGerado, { emitEvent: false });
      }
    });
  }

  onClose(): void {
    this.pastaForm.reset();
    this.closed.emit();
  }

  onSubmit(): void {
    if (this.pastaForm.invalid || this.isSubmitting || !this.pastaData()) {
      return;
    }

    this.isSubmitting = true;
    const { nome, descricao, slug } = this.pastaForm.value;
    const pastaId = this.pastaData()!.id;
    const slugFinal = slug?.trim() || undefined;
    const descricaoFinal = descricao?.trim() || undefined;

    this.pastaService.updatePasta(pastaId, nome, slugFinal, descricaoFinal).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Pasta atualizada',
          detail: 'Pasta atualizada com sucesso.'
        });
        this.pastaUpdated.emit(true);
        this.onClose();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível atualizar a pasta.'
        });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
