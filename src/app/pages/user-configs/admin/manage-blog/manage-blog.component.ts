import { Component, inject, signal, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogServiceService } from '../../../blog/services/blog-service.service';
import type { IPost } from '../../../../core/interfaces/blog.interface';

import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';
import { AdicionarPostComponent } from './components/adicionar-post/adicionar-post.component';
import { EditPostModalComponent } from './components/edit-post-modal/edit-post-modal.component';

@Component({
  selector: 'app-manage-blog',
  standalone: true,
  templateUrl: './manage-blog.component.html',
  styleUrl: './manage-blog.component.scss',
  providers: [ConfirmationService, MessageService],
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    PanelModule,
    ToastModule,
    ConfirmDialog,
    TruncatePipe,
    AdicionarPostComponent,
    EditPostModalComponent
  ]
})
export class ManageBlogComponent implements OnInit {
  private readonly blogService = inject(BlogServiceService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected posts = signal<IPost[]>([]);
  protected selectedPost: IPost | null = null;

  protected showAddPostModal = false;
  protected showEditPostModal = false;

  protected size = 10;
  protected first = 0;
  protected totalRecords = 0;
  protected loadingTable = true;

  ngOnInit(): void {
    // Subscrição inicial dos dados
    this.blogService.getPosts$(0, this.size).subscribe({
      next: (response) => {
        this.posts.set(response.content);
        this.totalRecords = response.totalElements;
        this.loadingTable = false;
      },
      error: () => {
        this.loadingTable = false;
      }
    });
  }

  loadPostsLazy(event: any): void {
    this.loadingTable = true;
    const page = event.first / event.rows;
    const size = event.rows;

    this.first = event.first;
    this.size = size;

    this.blogService.getPosts$(page, size).subscribe({
      next: (response) => {
        this.posts.set(response.content);
        this.totalRecords = response.totalElements;
        this.loadingTable = false;
      },
      error: () => {
        this.loadingTable = false;
      }
    });
  }

  closeAddPostModal(): void {
    this.showAddPostModal = false;
  }

  closeEditPostModal(): void {
    this.selectedPost = null;
    this.showEditPostModal = false;
  }

  onEditPost(post: IPost): void {
    this.selectedPost = post;
    this.showEditPostModal = true;
  }

  onDeletePost(event: Event, postId: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você tem certeza que deseja excluir este post?',
      header: 'Aviso',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Apagar', severity: 'danger' },
      accept: () => {
        this.loadingTable = true;
        this.blogService.deletePost(postId).subscribe({
          next: () => {
            this.loadPostsLazy({ first: this.first, rows: this.size }); // recarrega página atual
            this.messageService.add({ severity: 'success', summary: 'Post excluído', detail: 'Post removido com sucesso.' });
          },
          error: () => {
            this.loadingTable = false;
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível excluir o post.' });
          }
        });
      }
    });
  }

  viewPost(postId: number): void {
    window.open(`/blog/${postId}`, '_blank');
  }
}
