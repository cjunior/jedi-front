import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { Dialog } from "primeng/dialog";
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-add-cicle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    MultiSelectModule,
    Dialog
],
  templateUrl: './add-cicle.component.html',
  styleUrl: './add-cicle.component.scss',

})
export class AddCicleComponent {
  @Input() isVisible = false;
  @Output() onFinish = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  // Modelo que vai ser preenchido pelo formulário
  protected cicle = {
    name: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    municipalities: [] as any[],
  };

  // Opções de municípios (simulação)
  protected municipalitiesOptions = [
    { label: 'Abaetetuba', value: 'Abaetetuba' },
    { label: 'Acará', value: 'Acará' },
    { label: 'Alenquer', value: 'Alenquer' },
    { label: 'Altamira', value: 'Altamira' },
    { label: 'Ananindeua', value: 'Ananindeua' },
    { label: 'Baião', value: 'Baião' },
    { label: 'Barcarena', value: 'Barcarena' },
    { label: 'Belém', value: 'Belém' },
    { label: 'Benevides', value: 'Benevides' },
    { label: 'Bragança', value: 'Bragança' },
    { label: 'Breu Branco', value: 'Breu Branco' },
    { label: 'Breves', value: 'Breves' },
    { label: 'Cametá', value: 'Cametá' },
    { label: 'Canaã dos Carajás', value: 'Canaã dos Carajás' },
    { label: 'Capanema', value: 'Capanema' },
    { label: 'Capitão-Poço', value: 'Capitão-Poço' },
    { label: 'Castanhal', value: 'Castanhal' },
    { label: 'Conceição do Araguaia', value: 'Conceição do Araguaia' },
    { label: 'Curuçá', value: 'Curuçá' },
    { label: 'Dom Eliseu', value: 'Dom Eliseu' },
    { label: 'Igarapé-Miri', value: 'Igarapé-Miri' },
    { label: 'Itaituba', value: 'Itaituba' },
    { label: 'Itupiranga', value: 'Itupiranga' },
    { label: 'Jacundá', value: 'Jacundá' },
    { label: 'Juruti', value: 'Juruti' },
    { label: 'Marabá', value: 'Marabá' },
    { label: 'Marituba', value: 'Marituba' },
    { label: 'Mojú', value: 'Mojú' },
    { label: 'Monte Alegre', value: 'Monte Alegre' },
    { label: 'Novo Repartimento', value: 'Novo Repartimento' },
    { label: 'Óbidos', value: 'Óbidos' },
    { label: 'Oriximiná', value: 'Oriximiná' },
    { label: 'Pacajá', value: 'Pacajá' },
    { label: 'Paragominas', value: 'Paragominas' },
    { label: 'Parauapebas', value: 'Parauapebas' },
    { label: 'Portel', value: 'Portel' },
    { label: 'Redenção', value: 'Redenção' },
    { label: 'Rondon do Pará', value: 'Rondon do Pará' },
    { label: 'Salinópolis', value: 'Salinópolis' },
    { label: 'Santa Izabel do Pará', value: 'Santa Izabel do Pará' },
    { label: 'Santarém', value: 'Santarém' },
    { label: 'São Felix do Xingu', value: 'São Felix do Xingu' },
    { label: 'São Miguel do Guamá', value: 'São Miguel do Guamá' },
    { label: 'Tailândia', value: 'Tailândia' },
    { label: 'Terra Santa', value: 'Terra Santa' },
    { label: 'Tomé-Açú', value: 'Tomé-Açú' },
    { label: 'Tucumã', value: 'Tucumã' },
    { label: 'Tucuruí', value: 'Tucuruí' },
    { label: 'Ulianópolis', value: 'Ulianópolis' },
    { label: 'Uruará', value: 'Uruará' },
    { label: 'Vigia', value: 'Vigia' },
    { label: 'Viseu', value: 'Viseu' },
    { label: 'Xinguara', value: 'Xinguara' },
  ];

  protected isLoading = false;

  onSubmitEmitter(form: NgForm) {
    if (form.valid) {
      console.log('Novo ciclo:', this.cicle);
    }
  }

  onCancelEmitter() {
    this.cicle = {
      name: '',
      startDate: null,
      endDate: null,
      municipalities: [],
    }
    this.onCancel.emit();
  }

  onDateInput(event: any, field: 'startDate' | 'endDate') {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // só números

    // formata como dd/MM/yyyy
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);
    if (value.length > 10) value = value.slice(0, 10);

    input.value = value;

    // tenta converter para Date válido
    if (value.length === 10) {
      const [day, month, year] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);

      if (!isNaN(date.getTime())) {
        this.cicle[field] = date;
      }
    }
  }

}
