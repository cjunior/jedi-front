import { Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogServiceService } from '../blog/services/blog-service.service';
import type { IBlog } from '../../core/interfaces/blog.interface';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-unique-post-blog',
  imports: [AvatarModule, RouterLink, ButtonModule],
  templateUrl: './unique-post-blog.component.html',
  styleUrl: './unique-post-blog.component.scss'
})
export class UniquePostBlogComponent implements OnInit{
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogServiceService);
  protected post: IBlog | null = null;
  protected showScrollTop = false;

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    this.blogService.getPosts().subscribe({
      next: (response) => {
        this.post = response.items.find(post => post.id === postId) || null;
        if (!this.post) {
          console.error('Post not found');
        }
      },
      error: (error) => {
        console.error('Error fetching blog posts:', error);
      }
    })
    window.addEventListener('scroll', this.onScroll, true);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll, true);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private onScroll = (): void => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    this.showScrollTop = scrollPosition > (viewportHeight + 30);
  };

}
