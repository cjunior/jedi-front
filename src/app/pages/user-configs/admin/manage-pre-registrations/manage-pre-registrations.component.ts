import { Component, signal, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { MenuItem } from 'primeng/api';
import { InputIcon, InputIconModule } from 'primeng/inputicon';
import { FloatLabel } from 'primeng/floatlabel';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { InputMask } from 'primeng/inputmask';
import { PopoverModule } from 'primeng/popover';

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
    InputMask,
    PopoverModule
  ],
  templateUrl: './manage-pre-registrations.component.html',
  styleUrl: './manage-pre-registrations.component.scss'
})
export class ManagePreRegistrationsComponent implements OnInit{
  protected items = signal<MenuItem[]>([]);
  protected customers = signal<any[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.items.set([
      {
        label: 'Editar',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Apagar',
        icon: 'pi pi-times',
      },
    ]);
    setTimeout(() => {
      this.customers.set([
        {
          name: 'João da Silva',
          email: 'joaosilva@gmail.com',
          phone: '11999999999',
        },
        {
          name: 'Maria Oliveira',
          email: 'mariaoliveira@gmail.com',
          phone: '11999999998',
        },
        {
          name: 'Carlos Souza',
          email: 'carlossouza@gmail.com',
          phone: '11999999997',
        },
        {
          name: 'Ana Costa',
          email: 'anaconsta@gmail.com',
          phone: '11999999996',
        },
        {
          name: 'Pedro Santos',
          email: 'pedrosantos@gmail.com',
          phone: '11999999995',
        },
        {
          name: 'Lucia Pereira',
          email: 'luciapereira@gmail.com',
          phone: '11999999994',
        },
        {
          name: 'Roberto Lima',
          email: 'robertolima@gmail.com',
          phone: '11999999993',
        },
        {
          name: 'Fernanda Almeida',
          email: 'fernandaalmeida@gmail.com',
          phone: '11999999992',
        },
        {
          name: 'Ricardo Martins',
          email: 'ricardomartins@gmail.com',
          phone: '11999999991',
        },
        {
          name: 'Tatiane Rocha',
          email: 'tatianerocha@gmail.com',
          phone: '11999999990',
        },
      ])
    }, 1000)
    this.loading.set(false);
  }
}
