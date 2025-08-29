import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import type { ICicleResponse } from '../../../../../../core/interfaces/ciclies.interface';

@Component({
  selector: 'app-view-cicle',
  imports: [
    Dialog,
    DatePipe,
  ],
  templateUrl: './view-cicle.component.html',
  styleUrl: './view-cicle.component.scss'
})
export class ViewCicleComponent {
  @Input() isVisible = false;
  @Input() cicleData: ICicleResponse | null = null;
  @Output() onClose = new EventEmitter<void>();

  protected readonly cicle!: ICicleResponse

  onCloseEmitter() {
    this.onClose.emit();
  }
}
