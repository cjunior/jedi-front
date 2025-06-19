import { Component, inject, OnInit } from '@angular/core';
import { PreRegistrationService } from '../../../../core/services/pre-registration.service';
import { debounceTime, distinctUntilChanged, combineLatest, startWith, switchMap, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { PanelModule } from 'primeng/panel';
import { TableModule, type TableLazyLoadEvent } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PopoverModule } from 'primeng/popover';
import { Tag } from 'primeng/tag';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

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
    Select,
    FloatLabel
  ],
  templateUrl: './manage-pre-registrations.component.html',
  styleUrl: './manage-pre-registrations.component.scss'
})
export class ManagePreRegistrationsComponent implements OnInit {
  private readonly preRegistrationService = inject(PreRegistrationService);

  protected customers: any[] = [];
  protected totalRecords = 0;
  protected loading = true;
  protected size = 5;

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

  ngOnInit(): void {
    combineLatest([
      this.page$,
      this.nome$.pipe(debounceTime(400), distinctUntilChanged()),
      this.email$.pipe(debounceTime(400), distinctUntilChanged()),
      this.somenteCompletos$.pipe(distinctUntilChanged())
    ])
      .pipe(
        tap(() => (this.loading = true)),
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
          this.loading = false;
        },
        error: () => (this.loading = false)
      });
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
    console.log('onSomenteCompletosChange', value);
    this.somenteCompletos = value;
    this.somenteCompletos$.next(value);
  }
}
