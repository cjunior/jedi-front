import {
  Component,
  effect,
  inject,
  signal,
  computed,
  WritableSignal
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  type ParamMap
} from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import {
  fromEvent,
  Subject
} from 'rxjs';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { BlogServiceService } from './services/blog-service.service';
import { TruncatePipe } from '../../core/pipes/truncate.pipe';
import { UniquePostBlogComponent } from '../unique-post-blog/unique-post-blog.component';
import type { IPost, IBlogResponse } from '../../core/interfaces/blog.interface';
import { CarouselBlogComponent } from './components/carousel-blog/carousel-blog.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TruncatePipe,
    InputTextModule,
    IconField,
    InputIcon,
    UniquePostBlogComponent,
    CarouselBlogComponent,
    FooterComponent
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly blogService = inject(BlogServiceService);

  protected posts = signal<IPost[]>([]);
  protected carouselPosts = signal<IPost[]>([]);
  protected isLoading = signal(true);
  protected carouselIsLoading = signal(true);
  protected isLoadingMore = signal(false);
  protected currentPage = signal(0);
  protected totalPages = signal(1);
  protected selectedPost = signal<number | null>(null);
  protected searchTerm: WritableSignal<string> = signal('');

  private searchSubject = new Subject<string>();

  protected bgColors = signal([
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457",
    "#2e5b39", "#dc7f3a", "#efa95d", "#1e6197", "#7c8457"
  ]);

  constructor() {
    this.loadPosts();
    this.carouselCharge();

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.selectedPost.set(id ? Number(id) : null);
    });

    window.addEventListener('scroll', this.onScroll, true);

    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.loadPosts(true);
      });
  }

  carouselCharge() {
    this.blogService.getPosts$(0, 3).subscribe({
      next: (response: IBlogResponse) => {
        this.carouselPosts.set(response.content);
      },
      error: () => {
        this.carouselIsLoading.set(false);
      }
    });
  }

  private loadPosts(reset = false): void {
    const page = reset ? 0 : this.currentPage();
    const size = 8;
    const term = this.searchTerm();

    if (reset) {
      this.posts.set([]);
      this.currentPage.set(0);
    }

    this.isLoadingMore.set(true);
    this.blogService.getPosts$(page, size, term).subscribe({
      next: (response: IBlogResponse) => {
        const combined = reset ? response.content : [...this.posts(), ...response.content];
        this.posts.set(combined);
        this.totalPages.set(response.totalPages);
        this.currentPage.set(page + 1);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      }
    });
  }

  protected onScroll = (): void => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (scrollY + 200 >= height) {
      if (this.currentPage() < this.totalPages() && !this.isLoadingMore()) {
        this.loadPosts();
      }
    }
  };

  openPost(postId: number): void {
    this.selectedPost.set(postId);
    this.router.navigate(['/noticias', postId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearPost(): void {
    this.selectedPost.set(null);
    this.router.navigate(['/noticias']);
  }

  redirectToInitialPage(): void {
    this.router.navigate(['/']);
  }

  protected isMobileMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  handleSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value.trim());
  }

  lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return `#${(0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255))
      .toString(16)
      .slice(1)}`;
  }

}
