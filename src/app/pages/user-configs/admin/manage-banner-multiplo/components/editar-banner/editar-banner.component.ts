import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { BannerMultiploService } from '../../../../../../core/services/banner-multiplo.service';
import type { IBanner } from '../../../../../../core/interfaces/banner.interface';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-editar-banner',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    MessageModule,
    Toast
  ],
  templateUrl: './editar-banner.component.html',
  styleUrl: './editar-banner.component.scss',
  providers: [MessageService]
})
export class EditarBannerComponent implements OnInit, OnChanges {
  private readonly bannerService = inject(BannerMultiploService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  @Input() isVisible: boolean = false;
  @Input() bannerData: IBanner | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() bannerUpdated = new EventEmitter<boolean>();

  bannerForm!: FormGroup;
  selectedFile: File | null = null;
  fileTouched = false;
  isLoading = false;

  ngOnInit(): void {
    this.bannerForm = this.fb.group({
      title: [''],
      linkUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bannerData'] && this.bannerData && this.bannerForm) {
      this.bannerForm.patchValue({
        title: this.bannerData.title || '',
        linkUrl: this.bannerData.linkUrl
      });
    }
  }

  onSubmit(): void {
    if (this.bannerForm.invalid || !this.bannerData?.id) return;
    
    this.fileTouched = true;
    this.isLoading = true;

    const formData = new FormData();
    formData.append('linkUrl', this.bannerForm.get('linkUrl')?.value);
    formData.append('title', this.bannerForm.get('title')?.value || '');

    // Envia o arquivo só se selecionado (opcional no PUT)
    if (this.selectedFile) {
      const originalFile = this.selectedFile;
      const sanitizedFileName = originalFile.name.replace(/\s+/g, '_');
      const fileWithoutSpaces = new File([originalFile], sanitizedFileName, { type: originalFile.type });
      formData.append('file', fileWithoutSpaces);
    }

    this.bannerService.updateBanner(this.bannerData.id, formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Banner Atualizado',
          detail: 'O banner foi atualizado com sucesso.'
        });
        this.onCloseModal();
        this.bannerUpdated.emit(true);
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Ocorreu um erro ao atualizar o banner. Por favor, tente novamente.'
        });
        console.error('Erro ao atualizar banner:', err);
        this.isLoading = false;
      }
    });
  }

  onCloseModal(): void {
    this.closed.emit();
    this.bannerForm.reset();
    this.selectedFile = null;
    this.fileTouched = false;
  }

  onFileSelected(event: any): void {
    this.fileTouched = true;
    const files = event.files || [];
    if (files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.bannerForm.get(controlName);
    return !!control?.hasError(errorName) && (control?.touched || this.fileTouched);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Previne loop infinito verificando se já tentou carregar o placeholder
    if (!img.src.includes('data:image')) {
      // Usa uma imagem transparente 1x1 como fallback
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E';
      img.style.opacity = '0.3';
    }
  }
}
