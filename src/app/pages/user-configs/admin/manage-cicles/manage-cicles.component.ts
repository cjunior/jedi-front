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

@Component({
  selector: 'app-manage-cicles',
  imports: [
    PanelModule,
    TableModule,
    TagModule,
    TruncatePipe,
    cellphonePipe,
    ButtonModule,
    AddCicleComponent
  ],
  templateUrl: './manage-cicles.component.html',
  styleUrl: './manage-cicles.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class ManageCiclesComponent implements OnInit{
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService)

  protected selectedCicle: ICompleteRegister | null = null;
  protected isVisible = false;
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
  protected size = 5;
  protected loadingTable = true;
  protected isLoading = false;

  ngOnInit(): void {
      this.loadingTable = false;
  }

  handleAddCicle() {
    this.isVisible = true;
  }

  handleAddCicleModalClose(event: any) {
    console.log('fechou com sucesso')
  }

  handleCancelAddCicleModal(event: any) {
    this.isVisible = false;
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

  verMais(user: ICompleteRegister) {
    this.isVisible = false;

    this.selectedCicle = user;
    this.isVisible = true;
  }

  // confirmDeleteRegister(event: Event, register: ICompleteRegister) {
  //   this.confirmationService.confirm({
  //     target: event.target as EventTarget,
  //     message: 'Tem certeza que você deseja excluir esse cadastro?',
  //     header: 'Aviso!',
  //     closable: true,
  //     closeOnEscape: true,
  //     icon: 'pi pi-info-circle',
  //     rejectLabel: 'Cancelar',
  //     rejectButtonProps: {
  //       label: 'Cancelar',
  //       severity: 'secondary',
  //       outlined: true
  //     },
  //     acceptButtonProps: {
  //       label: 'Apagar',
  //       severity: 'danger'
  //     },
  //     accept: () => {
  //       this.isLoading = true;
  //       this.preRegistrationService.deleteRegistration(register.id).subscribe({
  //         next: () => {
  //           this.isLoading = false;
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Registro excluido!',
  //             detail: 'Registro deletado com sucesso.'
  //           });
  //           this.page$.next(this.page$.value);
  //         },
  //         error: (error) => {
  //           this.isLoading = false;
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Erro',
  //             detail: error?.err?.message || 'Não foi possível excluir o post.'
  //           });
  //         }
  //       })
  //     }
  //   })
  // }

  onModalClosed() {
    this.isVisible = false;
    this.selectedCicle = null;
  }
}
