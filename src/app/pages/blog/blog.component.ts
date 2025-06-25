import { Component, inject, signal, type OnInit } from '@angular/core';
import { BlogServiceService } from './services/blog-service.service';
import type { IBlog, IBlogResponse } from '../../core/interfaces/blog.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, ButtonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly blogService = inject(BlogServiceService)

  protected posts = signal<IBlog[]>([]);
  protected bgColors = signal([
    "#2e5b39",
    "#dc7f3a",
    "#efa95d",
    "#1e6197",
    "#7c8457"
  ])

  ngOnInit(): void {
    this.blogService.getPosts().subscribe({
      next: (posts: IBlogResponse) => {
        console.log('Blog posts fetched successfully:', posts);
        this.posts.set(posts.items);
      },
      error: (error) => {
        console.error('Error fetching blog posts:', error);
      }
    });
  }

  openPost(postId: number): void {
    this.router.navigate(['/blog', postId]);
  }

  lightenColor(color: string, percent: number): string {
    // Function to lighten a color by a percentage
    const num = parseInt(color.replace("#", ""), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = (num >> 8 & 0x00FF) + amt,
          B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                 (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                 (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`;
  }
}
