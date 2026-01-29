import { Component, inject, signal, type OnInit } from '@angular/core';
import { PastaService } from '../../../../core/services/pasta.service';
import { Pasta, Arquivo } from '../../../results/results-data';

import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdicionarPastaComponent } from './components/adicionar-pasta/adicionar-pasta.component';
import { EditarPastaComponent } from './components/editar-pasta/editar-pasta.component';
import { GerenciarArquivosComponent } from './components/gerenciar-arquivos/gerenciar-arquivos.component';

@Component({
  selector: 'app-manage-pastas',
  standalone: true,
  templateUrl: './manage-pastas.component.html',
  styleUrl: './manage-pastas.component.scss',
  providers: [ConfirmationService, MessageService],
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    PanelModule,
    ToastModule,
    ConfirmDialog,
    DialogModule,
    TooltipModule,
    CommonModule,
    AdicionarPastaComponent,
    EditarPastaComponent,
    GerenciarArquivosComponent
  ]
})
export class ManagePastasComponent implements OnInit {
  private readonly pastaService = inject(PastaService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  protected pastas = signal<Pasta[]>([]);
  protected selectedPasta: Pasta | null = null;

  protected showAddPastaModal = false;
  protected showEditPastaModal = false;
  protected showManageArquivosModal = false;
  protected loadingTable = true;

  ngOnInit(): void {
    this.loadPastas();
  }

  loadPastas(): void {
    this.loadingTable = true;
    this.pastaService.getPastas().subscribe({
      next: (response) => {
        // Filtrar apenas pastas raiz (sem parentId ou parentId null)
        const pastasRaiz = (response || []).filter(p => !p.parentId || p.parentId === 0);
        // Inverter ordem: mais recentes primeiro (ordenar por ID decrescente)
        const pastasOrdenadas = pastasRaiz.sort((a, b) => b.id - a.id);
        this.pastas.set(pastasOrdenadas);
        this.loadingTable = false;
      },
      error: () => {
        this.loadingTable = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar as pastas.'
        });
      }
    });
  }

  closeAddPastaModal(): void {
    this.showAddPastaModal = false;
  }

  closeEditPastaModal(): void {
    this.selectedPasta = null;
    this.showEditPastaModal = false;
  }

  closeManageArquivosModal(): void {
    this.selectedPasta = null;
    this.showManageArquivosModal = false;
  }

  onEditPasta(pasta: Pasta): void {
    this.selectedPasta = pasta;
    this.showEditPastaModal = true;
  }

  onManageArquivos(pasta: Pasta): void {
    this.selectedPasta = pasta;
    this.showManageArquivosModal = true;
  }

  onDeletePasta(event: Event, pastaId: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você tem certeza que deseja excluir esta pasta? Todos os arquivos dentro dela também serão excluídos.',
      header: 'Aviso',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Apagar', severity: 'danger' },
      accept: () => {
        this.loadingTable = true;
        this.pastaService.deletePasta(pastaId).subscribe({
          next: () => {
            this.loadPastas();
            this.messageService.add({
              severity: 'success',
              summary: 'Pasta excluída',
              detail: 'Pasta removida com sucesso.'
            });
          },
          error: () => {
            this.loadingTable = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível excluir a pasta.'
            });
          }
        });
      }
    });
  }

  reloadPastas(event: boolean): void {
    if (!event) return;
    this.loadPastas();
  }
}
