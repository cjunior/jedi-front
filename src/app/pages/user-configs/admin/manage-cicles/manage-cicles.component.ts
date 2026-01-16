import { Component, inject, ViewChild, type OnInit } from '@angular/core';
import { PreRegistrationService } from '../../../../core/services/pre-registration.service';
import { BlobConverterService } from '../../../../core/services/blob-converter.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import type { Popover } from 'primeng/popover';
import { TableModule, type TableLazyLoadEvent } from 'primeng/table';
import type { ICompleteRegister } from '../../../../core/interfaces/pre-registration.interface';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';
import { cellphonePipe } from '../../../../core/pipes/cellphone.pipe';
import { ButtonModule } from 'primeng/button';
import { AddCicleComponent } from './components/add-cicle/add-cicle.component';
import { CiclesService } from '../../../../core/services/cicles.service';
import { DatePipe } from '@angular/common';
import { ConfirmDialog } from 'primeng/confirmdialog';
import type { ICicleResponse } from '../../../../core/interfaces/ciclies.interface';
import { Toast } from "primeng/toast";
import { EditCicleComponent } from './components/edit-cicle/edit-cicle.component';
import { ViewCicleComponent } from './components/view-cicle/view-cicle.component';

@Component({
  selector: 'app-manage-cicles',
  imports: [
    PanelModule,
    TableModule,
    TagModule,
    TruncatePipe,
    ButtonModule,
    AddCicleComponent,
    DatePipe,
    ConfirmDialog,
    Toast,
    EditCicleComponent,
    ViewCicleComponent
],
  templateUrl: './manage-cicles.component.html',
  styleUrl: './manage-cicles.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class ManageCiclesComponent implements OnInit{
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService)
  private readonly ciclesService = inject(CiclesService);

  protected selectedCicle: ICicleResponse | null = null;
  protected isVisible = false;
  protected isEditCicleVisible = false;
  protected isViewCicleVisible = false;
  protected customers: any[] = [
    {
      name: 'Ciclo 1',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      municipalities: [
        'São Paulo', 'Campinas', 'Santos'
      ]
    },
    {
      name: 'Ciclo 2',
      startDate: '2024-07-01',
      endDate: '2024-12-31',
      municipalities: [
        'Rio de Janeiro', 'Niterói', 'Petrópolis'
      ]
    },
    {
      name: 'Ciclo 3',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      municipalities: [
        'Belo Horizonte', 'Uberlândia', 'Contagem'
      ]
    }
  ];
  protected totalRecords = 0;
  protected size = 100;
  protected loadingTable = true;
  protected isLoading = false;

  ngOnInit(): void {
      this.loadingTable = false;
      this.loadCicles();
  }

  handleAddCicle() {
    this.isVisible = true;
  }

  handleAddCicleModalClose(event: boolean) {
    if (event) {
      this.loadCicles();
    }
    this.isVisible = false;
  }

  handleCancelAddCicleModal(event: any) {
    this.isVisible = false;
  }

  handleEditCicle(cicle: ICicleResponse) {
    this.selectedCicle = cicle;
    this.isEditCicleVisible = true;
  }

  handleEditCicleModalClose(event: boolean) {
    if (event) {
      this.loadCicles();
    }
    this.isEditCicleVisible = false;
  }

  handleCancelEditCicleModal(event: any) {
    this.selectedCicle = null;
    this.isEditCicleVisible = false;
  }

  handleViewCicle(cicle: ICicleResponse) {
    this.selectedCicle = cicle;
    this.isViewCicleVisible = true;
  }

  handleViewCicleModalClose(event: any) {
    this.selectedCicle = null;
    this.isViewCicleVisible = false;
  }

  loadCicles() {
    this.loadingTable = true;
    this.ciclesService.getCicles().subscribe({
      next: (res: any) => {
        this.customers = res;
        this.totalRecords = res.length;
        this.loadingTable = false;
      },
      error: (err) => {
        this.loadingTable = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message || 'Não foi possível carregar os ciclos.' });
      }
    });
  }

  // loadPage(event: TableLazyLoadEvent) {
  //   const currentPage = (event.first ?? 0) / (event.rows ?? this.size);
  //   this.page$.next(currentPage);
  // }

  // onNomeChange(value: string) {
  //   this.nome = value;
  //   this.nome$.next(value);
  // }

  // onEmailChange(value: string) {
  //   this.email = value;
  //   this.email$.next(value);
  // }

  // onSomenteCompletosChange(value: boolean) {
  //   this.somenteCompletos = value;
  //   this.somenteCompletos$.next(value);
  // }

  verMais(cicle: ICicleResponse) {
  }

  confirmDeleteRegister(event: Event, register: ICicleResponse) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que você deseja excluir esse ciclo?',
      header: 'Aviso!',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Apagar',
        severity: 'danger'
      },
      accept: () => {
        this.isLoading = true;
        this.ciclesService.deleteCicle(register.id).subscribe({
          next: () => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Ciclo excluido!',
              detail: 'Ciclo deletado com sucesso.'
            });
            this.loadCicles();
          },
          error: (error) => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error?.err?.message || 'Não foi possível excluir o ciclo.'
            });
          }
        })
      }
    })
  }

  onModalClosed() {
    this.isVisible = false;
    this.selectedCicle = null;
  }
}
