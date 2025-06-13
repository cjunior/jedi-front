import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-carousel-square',
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselSquareComponent implements AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

  items = [
    '/diva2.svg',
    '/fotoca.png',
    '/diva2.svg',
    '/fotoca.png',
    '/diva2.svg',
    '/fotoca.png',
    '/diva2.svg',
    '/fotoca.png',
    '/diva2.svg',
    '/fotoca.png'
  ];
  itemWidth: number = 0; 
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  ngAfterViewInit() {
   
    const firstItem = this.carousel.nativeElement.querySelector('.item') as HTMLElement;
    if (firstItem) {
      const style = window.getComputedStyle(firstItem);
      const marginRight = parseFloat(style.marginRight || '0');
      this.itemWidth = firstItem.offsetWidth + marginRight; 
    }

    this.centerItems();
  }

  scrollCarousel(direction: number) {
    if (this.carousel && this.carousel.nativeElement) {
      const scrollPosition = this.carousel.nativeElement.scrollLeft;
      const newScrollPosition = scrollPosition + direction * this.itemWidth;

      this.carousel.nativeElement.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  }

  centerItems() {
    if (this.carousel && this.carousel.nativeElement) {
      const carouselWidth = this.carousel.nativeElement.offsetWidth;
      const totalItemsWidth = this.items.length * this.itemWidth;
      const emptySpace = carouselWidth - totalItemsWidth;

      if (emptySpace > 0) {
        this.carousel.nativeElement.style.justifyContent = 'center';
      } else {
        this.carousel.nativeElement.style.justifyContent = 'flex-start';
      }
    }
  }

  onDragStart(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.startX = this.getEventX(event) - this.carousel.nativeElement.offsetLeft;
    this.scrollLeft = this.carousel.nativeElement.scrollLeft;
  }

  onDragMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = this.getEventX(event) - this.carousel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1;
    this.carousel.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  onDragEnd() {
    this.isDragging = false;
  }

  private getEventX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;
  }
}