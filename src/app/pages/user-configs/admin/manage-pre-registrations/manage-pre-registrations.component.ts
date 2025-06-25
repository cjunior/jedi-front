import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PreRegistrationService } from '../../../../core/services/pre-registration.service';
import { debounceTime, distinctUntilChanged, combineLatest, switchMap, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { PanelModule } from 'primeng/panel';
import { TableModule, type TableLazyLoadEvent } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PopoverModule, type Popover } from 'primeng/popover';
import { Tag } from 'primeng/tag';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';
import { FormsModule } from '@angular/forms';
import { cellphonePipe } from '../../../../core/pipes/cellphone.pipe';
import { ViewRegisterModalComponent } from './components/view-register-modal/view-register-modal.component';
import type { ICompleteRegister } from '../../../../core/interfaces/pre-registration.interface';
import { BlobConverterService } from '../../../../core/services/blob-converter.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-manage-pre-registration',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    FloatLabel,
    PanelModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    PopoverModule,
    Tag,
    TruncatePipe,
    FormsModule,
    FloatLabel,
    cellphonePipe,
    ViewRegisterModalComponent,
    Toast
  ],
  templateUrl: './manage-pre-registrations.component.html',
  styleUrl: './manage-pre-registrations.component.scss',
  providers: [MessageService]
})
export class ManagePreRegistrationsComponent implements OnInit {
  private readonly preRegistrationService = inject(PreRegistrationService);
  private readonly blobConverterService = inject(BlobConverterService);
  private readonly messageService = inject(MessageService);

  protected selectedUser: ICompleteRegister | null = null;
  protected isVisible = false;
  protected customers: any[] = [];
  protected totalRecords = 0;
  protected size = 5;
  protected loadingTable = true;
  protected loadingDownload = false;

  private page$ = new BehaviorSubject<number>(0);

  protected nome = '';
  protected email = '';
  protected somenteCompletos = false;

  private nome$ = new BehaviorSubject<string>('');
  private email$ = new BehaviorSubject<string>('');
  private somenteCompletos$ = new BehaviorSubject<boolean>(false);

  protected selectFilterOptions = [
    { label: 'Todos', value: false },
    { label: 'Somente cadastros completos', value: true }
  ]

  @ViewChild('op') op!: Popover;

  ngOnInit(): void {
    combineLatest([
      this.page$,
      this.nome$.pipe(debounceTime(400), distinctUntilChanged()),
      this.email$.pipe(debounceTime(400), distinctUntilChanged()),
      this.somenteCompletos$.pipe(distinctUntilChanged())
    ])
      .pipe(
        tap(() => (this.loadingTable = true)),
        switchMap(([page, nome, email, somenteCompletos]) =>
          this.preRegistrationService.getRegistrations(page, this.size, {
            nome,
            email,
            somenteCompletos
          })
        )
      )
      .subscribe({
        next: (res: any) => {
          this.customers = res?.content ?? [];
          this.totalRecords = res?.totalElements ?? 0;
          this.loadingTable = false;
        },
        error: () => (this.loadingTable = false)
      });
  }

  downloadRegistrations(status: string) {
    if (this.loadingDownload) return;
    this.loadingDownload = true;
    this.preRegistrationService.downloadRegistrations(status).subscribe({
      next: (blob: Blob) => {
        this.loadingDownload = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Relatório de pré-inscrições (${status}) feito com sucesso!`
        });
        this.blobConverterService.downloadBlob(blob, `pre-inscricoes-${status.toLowerCase()}.pdf`);
      },
      error: (_error) => {
        this.loadingDownload = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao baixar o relatório. Tente novamente mais tarde.'
        });
      }
    })
  }

  loadPage(event: TableLazyLoadEvent) {
    const currentPage = (event.first ?? 0) / (event.rows ?? this.size);
    this.page$.next(currentPage);
  }

  onNomeChange(value: string) {
    this.nome = value;
    this.nome$.next(value);
  }

  onEmailChange(value: string) {
    this.email = value;
    this.email$.next(value);
  }

  onSomenteCompletosChange(value: boolean) {
    this.somenteCompletos = value;
    this.somenteCompletos$.next(value);
  }

  verMais(user: ICompleteRegister) {
    this.isVisible = false; // Fecha o modal atual, se aberto

    this.selectedUser = user;
    this.isVisible = true;
  }

  onModalClosed() {
    this.isVisible = false;
    this.selectedUser = null;
  }

  togglePopover(event: any) {
    this.op.toggle(event);
  }
}
