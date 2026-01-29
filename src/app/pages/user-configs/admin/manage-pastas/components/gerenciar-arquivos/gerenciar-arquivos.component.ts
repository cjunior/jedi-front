import { Component, inject, input, output, signal, effect } from '@angular/core';
import { PastaService } from '../../../../../../core/services/pasta.service';
import { Arquivo, Pasta } from '../../../../../results/results-data';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-gerenciar-arquivos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FileUploadModule,
    TableModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialog,
    TooltipModule,
    CommonModule
  ],
  templateUrl: './gerenciar-arquivos.component.html',
  styleUrl: './gerenciar-arquivos.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class GerenciarArquivosComponent {
  private readonly pastaService = inject(PastaService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly fb = inject(FormBuilder);

  isVisible = input.required<boolean>();
  pastaData = input<Pasta | null>(null);
  closed = output<void>();

  arquivos = signal<Arquivo[]>([]);
  loading = signal(false);
  uploading = signal(false);
  selectedFiles: File[] = [];
  fileNames: string[] = [];
  showEditModal = false;
  selectedArquivo: Arquivo | null = null;
  editForm: FormGroup;

  constructor() {
    this.editForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(1)]]
    });

    effect(() => {
      const pasta = this.pastaData();
      const visible = this.isVisible();
      if (pasta && visible) {
        this.loadArquivos(pasta.id);
      }
    });
  }

  loadArquivos(pastaId: number): void {
    this.loading.set(true);
    this.pastaService.getArquivosByPasta(pastaId).subscribe({
      next: (response) => {
        const arquivos = response || [];
        
        const arquivosOrdenados = arquivos.sort((a, b) => {
          const dateA = new Date(a.uploadedAt).getTime();
          const dateB = new Date(b.uploadedAt).getTime();
          return dateB - dateA;
        });
        
        this.arquivos.set(arquivosOrdenados);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os arquivos.'
        });
      }
    });
  }

  onFileSelect(event: any): void {
    const newFiles: File[] = Array.from(event.files || []);
    const existingNames = new Set(this.selectedFiles.map(f => f.name));
    const uniqueNewFiles = newFiles.filter(f => !existingNames.has(f.name));
    this.selectedFiles = [...this.selectedFiles, ...uniqueNewFiles];
    this.fileNames = this.selectedFiles.map(file => file.name);
  }

  removeFileFromSelection(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.fileNames = this.selectedFiles.map(file => file.name);
  }

  clearSelection(): void {
    this.selectedFiles = [];
    this.fileNames = [];
  }

  onFileError(event: any): void {
    console.error('Erro ao selecionar arquivo:', event);
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao selecionar arquivo. Tente novamente.'
    });
  }

  onUpload(): void {
    const pasta = this.pastaData();
    if (!pasta || this.selectedFiles.length === 0 || this.uploading()) {
      return;
    }

    this.uploading.set(true);
    this.pastaService.uploadArquivos(pasta.id, this.selectedFiles, this.fileNames).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Arquivos enviados',
          detail: 'Arquivos enviados com sucesso.'
        });
        this.selectedFiles = [];
        this.fileNames = [];
        this.loadArquivos(pasta.id);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível enviar os arquivos.'
        });
      },
      complete: () => {
        this.uploading.set(false);
      }
    });
  }

  onEditArquivo(arquivo: Arquivo): void {
    this.selectedArquivo = arquivo;
    this.editForm.patchValue({ nome: arquivo.nome });
    this.showEditModal = true;
  }

  onSaveEdit(): void {
    if (this.editForm.invalid || !this.selectedArquivo) {
      return;
    }

    const nome = this.editForm.value.nome;
    this.pastaService.updateArquivo(this.selectedArquivo.id, nome).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Arquivo atualizado',
          detail: 'Arquivo atualizado com sucesso.'
        });
        const pasta = this.pastaData();
        if (pasta) {
          this.loadArquivos(pasta.id);
        }
        this.showEditModal = false;
        this.selectedArquivo = null;
        this.editForm.reset();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível atualizar o arquivo.'
        });
      }
    });
  }

  onDeleteArquivo(event: Event, arquivoId: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você tem certeza que deseja excluir este arquivo?',
      header: 'Aviso',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Apagar', severity: 'danger' },
      accept: () => {
        this.pastaService.deleteArquivo(arquivoId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Arquivo excluído',
              detail: 'Arquivo removido com sucesso.'
            });
            const pasta = this.pastaData();
            if (pasta) {
              this.loadArquivos(pasta.id);
            }
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível excluir o arquivo.'
            });
          }
        });
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onClose(): void {
    this.selectedFiles = [];
    this.fileNames = [];
    this.showEditModal = false;
    this.selectedArquivo = null;
    this.editForm.reset();
    this.closed.emit();
  }

  viewFile(arquivo: Arquivo): void {
    if (arquivo.url) {
      window.open(arquivo.url, '_blank');
    }
  }
}
