import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  inject,
  HostListener,
  ViewChild
} from '@angular/core';
import { Carousel, CarouselPageEvent } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { IPost } from '../../../../core/interfaces/blog.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel-blog',
  standalone: true,
  imports: [Carousel, ButtonModule],
  templateUrl: './carousel-blog.component.html',
  styleUrl: './carousel-blog.component.scss'
})
export class CarouselBlogComponent implements OnInit {
  private readonly router = inject(Router);
  @Input() posts: IPost[] = [];

  autoplayIntervalId: any;

  numVisible = 1;

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  ngOnInit(): void {
    this.atualizarNumVisiveis(window.innerWidth);
  }

  atualizarNumVisiveis(width: number) {
    if (width >= 1024) {
      this.numVisible = 3;
    } else if (width >= 768) {
      this.numVisible = 2;
    } else {
      this.numVisible = 1;
    }
  }

  viewPost(postId: string) {
    this.router.navigate(['/noticias', postId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
