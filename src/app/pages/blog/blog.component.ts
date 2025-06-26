import { Component, inject, signal, effect } from '@angular/core';
import { BlogServiceService } from './services/blog-service.service';
import { IPost, IBlogResponse } from '../../core/interfaces/blog.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { TruncatePipe } from '../../core/pipes/truncate.pipe';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, ButtonModule, TruncatePipe],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  private readonly router = inject(Router);
  private readonly blogService = inject(BlogServiceService);

  protected posts = signal<IPost[]>([]);
  protected isLoading = signal(true);
  protected isLoadingMore = signal(false);
  protected currentPage = signal(0);
  protected totalPages = signal(1); // inicializado como 1 para garantir primeira requisição

  protected bgColors = signal([
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
  ]);

  constructor() {
    this.loadPosts();

    window.addEventListener('scroll', this.onScroll, true);
  }

  private loadPosts(): void {
    const page = this.currentPage();
    const size = 10;

    this.isLoadingMore.set(true);
    this.blogService.getPosts$(page, size).subscribe({
      next: (response: IBlogResponse) => {
        const combinedPosts = [...this.posts(), ...response.content];
        this.posts.set(combinedPosts);
        this.totalPages.set(response.totalPages);
        this.currentPage.set(page + 1);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
    });
  }

  private onScroll = (): void => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (scrollY + 200 >= height) {
      const page = this.currentPage();
      if (page < this.totalPages() && !this.isLoadingMore()) {
        this.loadPosts();
      }
    }
  };

  openPost(postId: number): void {
    this.router.navigate(['/blog', postId]);
  }

  lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255))
      .toString(16)
      .slice(1)}`;
  }
}
