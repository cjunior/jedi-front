import { Component, inject, signal, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabel } from 'primeng/floatlabel';
import { PanelModule } from 'primeng/panel';
import { TableModule, type TableLazyLoadEvent } from 'primeng/table';
import { InputMask } from 'primeng/inputmask';
import { PopoverModule } from 'primeng/popover';
import { PreRegistrationService } from '../../../../core/services/pre-registration.service';
import { Tag } from 'primeng/tag';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';

@Component({
  selector: 'app-manage-pre-registration',
  imports: [
    ButtonModule,
    InputTextModule,
    FloatLabel,
    PanelModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    // InputMask,
    PopoverModule,
    Tag,
    TruncatePipe
  ],
  templateUrl: './manage-pre-registrations.component.html',
  styleUrl: './manage-pre-registrations.component.scss'
})
export class ManagePreRegistrationsComponent implements OnInit {
  private readonly preRegistrationService = inject(PreRegistrationService);

  protected loading = signal<boolean>(true);
  protected page = signal<number>(0);
  protected size = signal<number>(5);
  protected customers = signal<any[]>([]);
  protected totalRecords = signal<number>(0);

  ngOnInit(): void {
    this.loadPage({ first: 0, rows: this.size() });
  }

  loadPage(event: TableLazyLoadEvent) {
    this.loading.set(true);
    const currentPage = (event.first ?? 0) / (event.rows ?? 10);
    const pageSize = event.rows ?? 10;

    this.preRegistrationService.getRegistrations(currentPage, pageSize).subscribe({
      next: (res: any) => {
        this.customers.set(res?.content ?? []);
        this.totalRecords.set(res?.totalElements ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
