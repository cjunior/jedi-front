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
      title: 'O curso é gratuito?',
      content: 'Sim. O curso é totalmente gratuito, sem nenhuma taxa de inscrição ou mensalidade.'
    },
    {
      title: 'Tem certificado?',
      content: 'Sim. Ao concluir todos os módulos, você receberá um certificado de participação emitido pelo Instituto Federal de Educação, Ciência e Tecnologia do Ceará (IFCE).'
    },
    {
      title: 'Quem pode participar?',
      content: 'Pessoas de 16 a 29 anos que residem do Estado do Pará.'
    },
    {
      title: 'Qual a duração do curso?',
      content: 'O curso tem carga horária total de 40 horas.'
    },
    {
      title: 'O curso é presencial ou online?',
      content: 'As aulas são online, com alguns encontros presenciais no município onde você se inscrever.'
    },
    {
      title: 'Em quais municípios do Pará o curso será realizado? ',
      content: 'O curso está disponível nos seguintes municípios: Belém, Ananindeua, Castanhal, Santa Izabel do Pará, Marituba, Benevides, Vigia, Portel, Breves, Abaetetuba, Mojú, Cametá, Barcarena, Tailândia, Igarapé-Miri, Acará, Tomé-Açú, Baião, Bragança, Capanema, Viseu, Capitão-Poço, Curuçá, Salinópolis, São Miguel do Guamá, Paragominas, Rondon do Pará, Ulianópolis, Dom Eliseu, Marabá, Itupiranga, Parauapebas, Canaã dos Carajás, Xinguara, Tucumã, São Felix do Xingu, Conceição do Araguaia, Redenção, Tucuruí, Jacundá, Breu Branco, Novo Repartimento, Pacajá, Uruará, Altamira, Itaituba, Santarém, Alenquer, Oriximiná, Monte Alegre, Óbidos, Juruti e Terra Santa.'
    },
    {
      title: 'Posso participar do curso mesmo que não more em uma cidade polo? ',
      content: 'Não. É necessário comprovar residência no município onde o curso será realizado.'
    }
  ];

  activeIndex: number | null = null;
  heights: number[] = [];

  @ViewChildren('content') contentElements!: QueryList<ElementRef>;

  ngOnInit() {
    // this.landingpageservice.getdados().subscribe({
    //   next: (dados) => {
    //     const apiItems = dados.faqSectionResponseDto.items.map((item: any) => ({
    //       title: item.question,
    //       content: item.answer
    //     }));
  
    //     const mockItems = [
    //       {
    //         title: 'Em quais municípios do Pará o curso será realizado? ',
    //         content: 'O curso está disponível nos seguintes municípios: Belém, Ananindeua, Castanhal, Santa Izabel do Pará, Marituba, Benevides, Vigia, Portel, Breves, Abaetetuba, Mojú, Cametá, Barcarena, Tailândia, Igarapé-Miri, Acará, Tomé-Açú, Baião, Bragança, Capanema, Viseu, Capitão-Poço, Curuçá, Salinópolis, São Miguel do Guamá, Paragominas, Rondon do Pará, Ulianópolis, Dom Eliseu, Marabá, Itupiranga, Parauapebas, Canaã dos Carajás, Xinguara, Tucumã, São Felix do Xingu, Conceição do Araguaia, Redenção, Tucuruí, Jacundá, Breu Branco, Novo Repartimento, Pacajá, Uruará, Altamira, Itaituba, Santarém, Alenquer, Oriximiná, Monte Alegre, Óbidos, Juruti e Terra Santa.'
    //       },
    //       {
    //         title: 'Posso participar do curso mesmo que não more em uma cidade polo?',
    //         content: 'Não. É necessário comprovar residência no município onde o curso será realizado.'
    //       },
    //         {
    //         title: 'Quem pode participar?',
    //         content: 'Pessoas de 16 a 29 anos que residem do Estado do Pará.'
    //       }
    //     ];

  
    //     this.faqSectionResponseDto = [...apiItems, ...mockItems];
    //   },
    //   error: (error) => {
    //     console.error('Erro ao obter dados:', error);
    //   }
    // });
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