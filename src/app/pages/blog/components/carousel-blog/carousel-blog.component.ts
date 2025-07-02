import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Carousel, CarouselPageEvent } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { IPost } from '../../../../core/interfaces/blog.interface';

@Component({
  selector: 'app-carousel-blog',
  standalone: true,
  imports: [Carousel, ButtonModule],
  templateUrl: './carousel-blog.component.html',
  styleUrl: './carousel-blog.component.scss'
})
export class CarouselBlogComponent implements OnInit, OnDestroy {
  @Input() posts: IPost[] = [];

  currentIndex = 0;
  autoplayIntervalId: any;

  ngOnInit(): void {
    this.iniciarAutoplay();
  }

  ngOnDestroy(): void {
    clearInterval(this.autoplayIntervalId);
  }

  iniciarAutoplay() {
    this.autoplayIntervalId = setInterval(() => {
      if (!this.posts.length) return;
      this.currentIndex = (this.currentIndex + 1) % this.posts.length;
    }, 5000);
  }

  aoTrocarPagina(event: CarouselPageEvent) {
    this.currentIndex = event.page ?? 0;
    clearInterval(this.autoplayIntervalId);
    this.iniciarAutoplay();
  }
}
