import { Component, EventEmitter, inject, Input, Output, type OnChanges, type OnInit, type SimpleChanges } from '@angular/core';
import type { ICicleResponse, ICicle } from '../../../../../../core/interfaces/ciclies.interface';
import { CiclesService } from '../../../../../../core/services/cicles.service';
import { CommonModule } from '@angular/common';
import { FormsModule, type NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { Toast, ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-cicle',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    MultiSelectModule,
    ToastModule,
    MessageModule,
    Dialog,
    Toast
  ],
  templateUrl: './edit-cicle.component.html',
  styleUrl: './edit-cicle.component.scss',
})
export class EditCicleComponent implements OnInit, OnChanges {
  private readonly cicleService = inject(CiclesService);
  private readonly messageService = inject(MessageService);

  @Input() isVisible = false;
  @Input() cicleData: ICicleResponse | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>();

  protected selectedId = this.cicleData?.id || '';
  protected isLoading = false;
  protected submitted = false; // controla se clicou em salvar

  protected cicle: ICicle = {
    nome: this.cicleData?.nome || '',
    dataInicio: this.cicleData?.dataInicio || null,
    dataFim: this.cicleData?.dataFim || null,
    municipios: [...(this.cicleData?.municipios || [])],
  }

  protected municipiosOptions = [
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

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cicleData'] && this.cicleData) {
      this.selectedId = this.cicleData.id;
      this.cicle = {
        nome: this.cicleData.nome,
        dataInicio: this.cicleData.dataInicio ? new Date(this.cicleData.dataInicio) : null,
        dataFim: this.cicleData.dataFim ? new Date(this.cicleData.dataFim) : null,
        municipios: [...(this.cicleData.municipios || [])]
      };
    }
  }

  onSubmitEmitter(form: NgForm) {
    this.submitted = true; // ativa validação

    // valida se dataInicio é maior que dataFim
    if (this.cicle.dataInicio && this.cicle.dataFim && this.cicle.dataInicio > this.cicle.dataFim) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro!',
        detail: 'A data de início não pode ser maior que a data de fim.',
      });
      return;
    }

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.cicleService.updateCicle(this.selectedId, this.cicle).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Ciclo Atualizado',
          detail: 'O ciclo foi atualizado com sucesso.',
        });
        this.isLoading = false;
        this.submitted = false; // reseta
        this.onSuccess.emit();
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err?.error?.message || 'Ocorreu um erro ao atualizar o ciclo.';
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: errorMessage,
        });
      },
    });
  }

  onCancelEmitter() {
    this.onCancel.emit();
    this.submitted = false;
  }

  onDateInput(event: any, field: 'dataInicio' | 'dataFim') {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);
    if (value.length > 10) value = value.slice(0, 10);

    input.value = value;

    if (value.length === 10) {
      const [day, month, year] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);

      if (!isNaN(date.getTime())) {
        this.cicle[field] = date;
      }
    }
  }
}
