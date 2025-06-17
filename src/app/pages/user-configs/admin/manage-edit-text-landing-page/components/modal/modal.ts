import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-manage-carousel-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, FileUploadModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss']
})
export class ManageCarouselModalComponent {
  @Input() visible = false;
  @Input() items: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any[]>();

  // Quando clica no botão, simula clique no input file
  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  // Adiciona nova imagem ao array
  addImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.items.push({
          image: reader.result,
          alt: `Imagem ${this.items.length + 1}`
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // Atualiza imagem de um item específico
  updateImage(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.items[index].image = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  confirm() {
    this.save.emit(this.items);
    this.close.emit();
  }
}
