import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
  OnDestroy,
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
import { NgxEditorModule, Editor } from 'ngx-editor';
import { BlogServiceService } from '../../../../../blog/services/blog-service.service';
import type { IPost } from '../../../../../../core/interfaces/blog.interface';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { validateDescriptionLength } from '../../../../../../core/validators/validateDescriptionLength.validator';

@Component({
  selector: 'app-editar-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    MessageModule,
    NgxEditorModule,
    ToastModule
  ],
  templateUrl: './edit-post-modal.component.html',
  styleUrl: './edit-post-modal.component.scss',
  providers: [MessageService]
})
export class EditPostModalComponent implements OnInit, OnChanges, OnDestroy {
  private readonly blogService = inject(BlogServiceService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  @Input() isVisible: boolean = false;
  @Input() postData: IPost | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>();
  @Output() onError = new EventEmitter<string>();

  form!: FormGroup;
  editor: Editor = new Editor();

  validatorDescriptionLength = validateDescriptionLength

  selectedBannerFile: File | null = null;
  selectedIconFile: File | null = null;
  fileTouched = false;
  isLoading = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(8)]],
      imageDescription: ['', [Validators.required, Validators.minLength(5)]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      readingTime: ['', [Validators.required, Validators.pattern(/^[0-9]+ ?min$/)]],
      description: ['', [Validators.required, this.validatorDescriptionLength()]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postData'] && this.postData && this.form) {
      this.form.patchValue({
        title: this.postData.title,
        imageDescription: this.postData.imageDescription,
        author: this.postData.author,
        readingTime: this.postData.readingTime,
        description: this.postData.description
      });
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onSubmit(): void {
    if (this.form.invalid || !this.postData?.id) return;
    this.fileTouched = true;
    this.isLoading = true;

    const formData = new FormData();
    const values = this.form.value;

    formData.append('title', values.title);
    formData.append('imageDescription', values.imageDescription);
    formData.append('author', values.author);
    formData.append('readingTime', values.readingTime);
    formData.append('description', values.description);

    if (this.selectedBannerFile) {
      formData.append('file', this.selectedBannerFile);
    }

    if (this.selectedIconFile) {
      formData.append('iconFile', this.selectedIconFile);
    }

    this.blogService.updatePost(this.postData.id, formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Post Atualizado',
          detail: 'O post foi atualizado com sucesso.'
        });
        this.onCloseModal();
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Ocorreu um erro ao atualizar o post. Por favor, tente novamente.'
        });
        console.error('Erro ao atualizar post:', err);
        this.isLoading = false;
      }
    });
  }

  onCloseModal(): void {
    this.closed.emit();
    this.form.reset();
    this.selectedBannerFile = null;
    this.selectedIconFile = null;
    this.fileTouched = false;
  }

  onFileSelected(event: any): void {
    this.fileTouched = true;
    const files = event.files || [];
    if (files.length > 0) {
      this.selectedBannerFile = files[0];
    }
  }

  onIconFileSelected(event: any): void {
    this.fileTouched = true;
    const files = event.files || [];
    if (files.length > 0) {
      this.selectedIconFile = files[0];
    }
  }

  get f() {
    return this.form.controls;
  }
}
