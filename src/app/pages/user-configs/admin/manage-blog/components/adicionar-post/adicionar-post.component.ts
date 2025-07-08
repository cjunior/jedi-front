import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BlogServiceService } from '../../../../../blog/services/blog-service.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { validateDescriptionLength } from '../../../../../../core/validators/validateDescriptionLength.validator';
import { jwtDecode } from 'jwt-decode';
import { IToken } from '../../../../../../core/interfaces/token.interface';

@Component({
  selector: 'app-adicionar-post',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    MessageModule,
    CommonModule,
    ReactiveFormsModule,
    NgxEditorComponent,
    NgxEditorMenuComponent,
    Toast
  ],
  templateUrl: './adicionar-post.component.html',
  styleUrl: './adicionar-post.component.scss',
  providers: [MessageService]
})
export class AdicionarPostComponent implements OnInit, OnDestroy {
  private readonly blogService = inject(BlogServiceService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  @Input() isVisible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() postCreated = new EventEmitter<boolean>();

  postForm!: FormGroup;
  selectedBannerFile: File | null = null;
  fileTouched = false;
  isLoading = false;
  tokenPayload!: IToken;

  validateDescriptionLength = validateDescriptionLength;

  editor = new Editor();

  ngOnInit(): void {
    const token = sessionStorage.getItem('auth_token') || '';
    this.tokenPayload = jwtDecode(token);

    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(8)]],
      imageDescription: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, this.validateDescriptionLength()]],
      readingTime: ['', [Validators.required, Validators.pattern(/^[0-9]+ ?min$/)]]
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onFileSelected(event: any): void {
    this.fileTouched = true;
    const files = event.files || [];
    if (files.length > 0) {
      this.selectedBannerFile = files[0];
    }
  }

  onSubmit(): void {
    this.fileTouched = true;

    if (this.postForm.invalid || !this.selectedBannerFile) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    const values = this.postForm.value;

    formData.append('title', values.title);
    formData.append('imageDescription', values.imageDescription);
    formData.append('description', values.description);
    formData.append('readingTime', values.readingTime);
    formData.append('author', this.tokenPayload.name || '');

    const now = new Date();
    const dateString = now.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    formData.append('date', dateString);
    const originalFile = this.selectedBannerFile!;
    const sanitizedFileName = originalFile.name.replace(/\s+/g, '_');
    const fileWithoutSpaces = new File([originalFile], sanitizedFileName, { type: originalFile.type });
    formData.append('file', fileWithoutSpaces);


    const enviarPost = () => {
      this.blogService.createPost(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Post Criado',
            detail: 'O post foi criado com sucesso.'
          });
          this.resetForm();
          this.onCloseModal();
          this.isLoading = false;
          this.postCreated.emit(true);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error?.message || 'Ocorreu um erro ao criar o post.'
          });
          this.isLoading = false;
        }
      });
    };

    // Se houver imagem no token, faz fetch e adiciona como File
    if (this.tokenPayload.photo) {
      fetch(this.tokenPayload.photo)
        .then(response => response.blob())
        .then(blob => {
          // Apenas adiciona se o blob não for vazio
          if (blob.size > 0) {
            const file = new File([blob], 'icon.jpg', { type: blob.type });
            formData.append('iconFile', file);
          }
          enviarPost();
        })
        .catch(() => {
          // Erro no fetch? Não envia o campo
          enviarPost();
        });
    } else {
      // Não há imagem no token → não envia iconFile
      enviarPost();
    }
  }


  onCloseModal(): void {
    this.closed.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.postForm.reset();
    this.selectedBannerFile = null;
    this.fileTouched = false;
    this.isLoading = false;
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.postForm.get(controlName);
    return !!control?.hasError(errorName) && (control?.touched || this.fileTouched);
  }
}
