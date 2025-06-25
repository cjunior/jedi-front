import { Component, inject, signal, type OnInit } from '@angular/core';
import { BlogServiceService } from './services/blog-service.service';
import type { IBlog, IBlogResponse } from '../../core/interfaces/blog.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
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
}
