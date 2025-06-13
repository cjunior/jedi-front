import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-acordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acordion.component.html',
  styleUrls: ['./acordion.component.scss']
})
export class AcordionComponent {
  items = [
    {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consequat lobortis dui vitae laoreet. Suspendisse turpis ante, bibendum vel semper sit amet, vehicula in ligula. '
    },
    {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
      content: 'Conteúdo do segundo item.'
    },
    {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      content: 'Conteúdo do terceiro item.'
    },
    {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      content: 'Conteúdo do quarto item.'
    }
  ];

  activeIndex: number | null = null;
  heights: number[] = [];

  @ViewChildren('content') contentElements!: QueryList<ElementRef>;

  ngAfterViewInit() {
    // Calcula as alturas de cada conteúdo após a renderização
    this.heights = this.contentElements.map(
      (content) => content.nativeElement.scrollHeight
    );
  }

  toggle(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}