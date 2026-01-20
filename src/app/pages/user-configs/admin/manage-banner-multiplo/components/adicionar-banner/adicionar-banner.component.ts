import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { BannerMultiploService } from '../../../../../../core/services/banner-multiplo.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-adicionar-banner',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    MessageModule,
    CommonModule,
    ReactiveFormsModule,
    Toast
  ],
  templateUrl: './adicionar-banner.component.html',
  styleUrl: './adicionar-banner.component.scss',
  providers: [MessageService]
})
export class AdicionarBannerComponent implements OnInit, OnDestroy {
  private readonly bannerService = inject(BannerMultiploService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  @Input() isVisible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() bannerCreated = new EventEmitter<boolean>();

  bannerForm!: FormGroup;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  fileTouched = false;
  isLoading = false;

  ngOnInit(): void {
    this.bannerForm = this.fb.group({
      banners: this.fb.array([
        this.fb.group({
          file: [null, Validators.required],
          linkUrl: ['', Validators.required],
          title: ['']
        })
      ])
    });
  }

  get bannersArray(): FormArray {
    return this.bannerForm.get('banners') as FormArray;
  }

  addBannerField(): void {
    this.bannersArray.push(
      this.fb.group({
        file: [null, Validators.required],
        linkUrl: ['', Validators.required],
        title: ['']
      })
    );
  }

  removeBannerField(index: number): void {
    if (this.bannersArray.length > 1) {
      // Limpa preview se existir
      if (this.imagePreviews[index]) {
        URL.revokeObjectURL(this.imagePreviews[index]);
      }
      this.bannersArray.removeAt(index);
      this.selectedFiles.splice(index, 1);
      this.imagePreviews.splice(index, 1);
    }
  }

  onFileSelected(event: any, index: number): void {
    this.fileTouched = true;
    const files = event.files || [];
    if (files.length > 0) {
      // Limpa preview anterior se existir
      if (this.imagePreviews[index]) {
        URL.revokeObjectURL(this.imagePreviews[index]);
      }
      this.selectedFiles[index] = files[0];
      this.imagePreviews[index] = URL.createObjectURL(files[0]);
      this.bannersArray.at(index).patchValue({ file: files[0] });
    }
  }

  onSubmit(): void {
    this.fileTouched = true;

    // Validar manualmente os campos linkUrl para garantir que não estão vazios após trim
    let hasInvalidLinks = false;
    this.bannersArray.controls.forEach((control, index) => {
      const linkUrl = control.get('linkUrl');
      if (linkUrl) {
        const value = linkUrl.value?.trim() || '';
        if (!value) {
          linkUrl.setErrors({ required: true });
          hasInvalidLinks = true;
        } else {
          linkUrl.setErrors(null);
        }
        linkUrl.markAsTouched();
      }
    });

    if (this.bannerForm.invalid || hasInvalidLinks) {
      this.bannerForm.markAllAsTouched();
      return;
    }

    // Verificar se todos os campos têm arquivo
    const hasAllFiles = this.bannersArray.controls.every((control, index) => {
      return this.selectedFiles[index] != null;
    });

    if (!hasAllFiles) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Todos os banners devem ter uma imagem selecionada.'
      });
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    const files: File[] = [];
    const linkUrls: string[] = [];
    const titles: string[] = [];

    this.bannersArray.controls.forEach((control, index) => {
      const file = this.selectedFiles[index];
      const linkUrl = control.get('linkUrl')?.value?.trim() || '';
      const title = (control.get('title')?.value || '').trim();
      
      if (file && linkUrl) {
        files.push(file);
        linkUrls.push(linkUrl);
        titles.push(title);
      }
    });

    // Verificar se há dados para enviar
    if (files.length === 0 || linkUrls.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Todos os banners devem ter uma imagem e um link URL válido.'
      });
      this.isLoading = false;
      return;
    }

    // Adicionar arrays ao FormData
    files.forEach((file) => {
      formData.append('file', file);
    });

    linkUrls.forEach((linkUrl) => {
      formData.append('linkUrl', linkUrl);
    });

    titles.forEach((title) => {
      formData.append('title', title);
    });

    this.bannerService.createBanner(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Banner(s) Criado(s)',
          detail: 'O(s) banner(s) foi(foram) criado(s) com sucesso.'
        });
        this.resetForm();
        this.onCloseModal();
        this.isLoading = false;
        this.bannerCreated.emit(true);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Ocorreu um erro ao criar o(s) banner(s).'
        });
        this.isLoading = false;
      }
    });
  }

  onCloseModal(): void {
    this.closed.emit();
    this.resetForm();
  }

  resetForm(): void {
    // Limpa todas as previews
    this.imagePreviews.forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
    
    this.bannerForm.reset();
    this.bannersArray.clear();
    this.bannersArray.push(
      this.fb.group({
        file: [null, Validators.required],
        linkUrl: ['', Validators.required],
        title: ['']
      })
    );
    this.selectedFiles = [];
    this.imagePreviews = [];
    this.fileTouched = false;
    this.isLoading = false;
  }

  hasError(controlName: string, errorName: string, index: number): boolean {
    const control = this.bannersArray.at(index).get(controlName);
    if (!control) return false;
    
    // Verifica se o campo está vazio após trim
    if (errorName === 'required') {
      const value = control.value?.trim() || '';
      return (!value && (control.touched || this.fileTouched));
    }
    
    return !!control.hasError(errorName) && (control.touched || this.fileTouched);
  }

  getImagePreview(index: number): string {
    return this.imagePreviews[index] || '';
  }

  removeImage(index: number): void {
    // Limpa a URL do objeto
    if (this.imagePreviews[index]) {
      URL.revokeObjectURL(this.imagePreviews[index]);
      delete this.imagePreviews[index];
    }
    this.selectedFiles[index] = null as any;
    this.bannersArray.at(index).patchValue({ file: null });
    this.fileTouched = true;
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  ngOnDestroy(): void {
    // Limpa todas as previews ao destruir o componente
    this.imagePreviews.forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
  }
}
