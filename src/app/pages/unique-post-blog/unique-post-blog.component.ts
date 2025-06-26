import { Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogServiceService } from '../blog/services/blog-service.service';
import type { IPost } from '../../core/interfaces/blog.interface';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-unique-post-blog',
  imports: [AvatarModule, RouterLink, ButtonModule],
  templateUrl: './unique-post-blog.component.html',
  styleUrl: './unique-post-blog.component.scss'
})
export class UniquePostBlogComponent implements OnInit{
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogServiceService);
  private readonly sanitizer = inject(DomSanitizer);

  protected isInitialLoading = true;
  protected post: IPost | null = null;
  protected showScrollTop = false;

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    this.blogService.getUniquePost(postId).subscribe({
      next: (response: IPost) => {
        this.post = response;
        this.isInitialLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar post único:', error);
        this.isInitialLoading = false;
      }
    });
    window.addEventListener('scroll', this.onScroll, true);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll, true);
  }


  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private onScroll = (): void => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    this.showScrollTop = scrollPosition > (viewportHeight + 10);
  };

}
