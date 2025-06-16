// admin-dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { FilePreviewPipe } from './utils/pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FileUploadModule,
    DialogModule,
    FilePreviewPipe
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class AdminDashboardComponent {
  logo = '';
  menu = {
    home: '',
    fotos: '',
    videos: '',
    equipe: '',
    ajuda: ''
  };
  projeto = '';

  equipeCarrossel: File[] = [];
  conteudoCarrossel: File[] = [];
  outroCarrossel: File[] = [];

  ajuda = {
    nome: '',
    email: '',
    mensagem: '',
    redesociais: ''
  };

  onFileSelect(event: any, carrossel: File[]) {
    const file = event.target.files[0];
    if (file) {
      carrossel.push(file);
    }
  }

  removerImagem(carrossel: File[], index: number) {
    carrossel.splice(index, 1);
  }

  salvar() {
    console.log('Dados salvos:', {
      logo: this.logo,
      menu: this.menu,
      projeto: this.projeto,
      equipeCarrossel: this.equipeCarrossel,
      conteudoCarrossel: this.conteudoCarrossel,
      outroCarrossel: this.outroCarrossel,
      ajuda: this.ajuda
    });
  }
}