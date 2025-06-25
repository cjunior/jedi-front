import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';
import type { ICompleteRegister } from '../../../../../../core/interfaces/pre-registration.interface';
import { cellphonePipe } from '../../../../../../core/pipes/cellphone.pipe';
import { CpfPipe } from '../../../../../../core/pipes/cpf.pipe';
import { RgPipe } from '../../../../../../core/pipes/rg.pipe';

@Component({
  selector: 'app-view-register-modal',
  standalone: true,
  imports: [
    DialogModule,
    DatePipe,
    cellphonePipe,
    CpfPipe,
    RgPipe
  ],
  templateUrl: './view-register-modal.component.html',
  styleUrl: './view-register-modal.component.scss'
})
export class ViewRegisterModalComponent {
  @Input() isVisible: boolean = false;
  @Input() userRegister: ICompleteRegister | null = null;

  @Output() closed = new EventEmitter<void>();

  onCloseModal() {
    this.closed.emit(); // 🔁 Informa o pai que o modal foi fechado
  }
}
