import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { landingPageService } from '../../services/lading-page.service';

@Component({
  selector: 'app-acordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acordion.component.html',
  styleUrls: ['./acordion.component.scss']
})
export class AcordionComponent implements OnInit {
  private readonly landingpageservice = inject(landingPageService)
  faqSectionResponseDto = [
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

  ngOnInit() {
    this.landingpageservice.getdados().subscribe({
      next: (dados) => {
        this.faqSectionResponseDto = dados.faqSectionResponseDto.items.map((item: any) => ({
          title: item.question,
          content: item.answer
        }));
      },
      error: (error) => {
        console.error('Erro ao obter dados:', error);
      }
    });
  }

  ngAfterViewInit() {
    this.heights = this.contentElements.map(
      (content) => content.nativeElement.scrollHeight
    );
  }

  toggle(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}