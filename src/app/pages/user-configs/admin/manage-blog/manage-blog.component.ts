import { Component, inject, signal, type OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BlogServiceService } from '../../../blog/services/blog-service.service';
import type { IPost } from '../../../../core/interfaces/blog.interface';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';
import { AdicionarPostComponent } from './components/adicionar-post/adicionar-post.component';
import { EditPostModalComponent } from './components/edit-post-modal/edit-post-modal.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-blog',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    TableModule,
    PanelModule,
    TruncatePipe,
    AdicionarPostComponent,
    EditPostModalComponent,
    ConfirmDialog,
    ToastModule
  ],
  templateUrl: './manage-blog.component.html',
  styleUrl: './manage-blog.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ManageBlogComponent implements OnInit{
  private readonly blogService = inject(BlogServiceService)
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected posts = signal<IPost[]>([]);
  protected selectedPost: IPost | null = null;

  protected size = 10;
  protected totalRecords = 0;
  protected loadingTable = true;
  protected showAddPostModal = false;
  protected showEditPostModal = false;

  ngOnInit(): void {
    this.loadingTable = true;
    this.blogService.getPosts$.subscribe({
      next: (response: IPost[]) => {
        this.posts.set(response);
        this.totalRecords = response.length;
        this.loadingTable = false;
      },
      error: (error) => {
        console.error('Erro ao buscar posts do blog:', error);
        this.loadingTable = false;
      }
    });
    this.blogService.getPosts();
  }

  closeAddPostModal(): void {
    this.showAddPostModal = false;
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
        rejectButtonProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Apagar',
            severity: 'danger',
        },

        accept: () => {
          this.loadingTable = true;
          this.blogService.deletePost(postId).subscribe({
              next: () => {
                this.blogService.getPosts();
                this.messageService.add({ severity: 'success', summary: 'Post Excluído', detail: 'O post foi excluído com sucesso.' });
                this.loadingTable = false;
              },
              error: (error) => {
                  this.loadingTable = false;
                  console.error('Erro ao excluir o post:', error);
                  this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível excluir o post.' });
              }
          });
        },
        reject: () => {
        },
    });
  }

  viewPost(postId: number): void {
    window.open(`/blog/${postId}`, '_blank');
  }

  closeEditPostModal(): void {
    this.showEditPostModal = false;
    this.selectedPost = null;
  }

}
