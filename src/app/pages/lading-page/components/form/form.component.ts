import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../input/input.component";
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { CommonModule } from '@angular/common';
import { formPageService } from './service/lading-page.service';
import { DialogModule } from 'primeng/dialog';

export interface Message {
  severity?: string;
  summary?: string;
  detail?: string;
  id?: string;
  key?: string;
  life?: number;
  closable?: boolean;
  sticky?: boolean;
  data?: any;
  icon?: string;
  contentStyleClass?: string;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [InputComponent, MessagesModule, ReactiveFormsModule, CommonModule, DialogModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [MessageService]
})
export class FormComponent {
  form: FormGroup;
  public messages: Message[] = [];
  public payloadSent: any = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly formService: formPageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      privacy: [false, Validators.requiredTrue]
    });
  }
  displayPrivacy = false;

  acceptPrivacy() {
    this.form.get('privacy')?.setValue(true);
    this.displayPrivacy = false;
  }

  declinePrivacy() {
    this.form.get('privacy')?.setValue(false);
    this.displayPrivacy = false;
  }


  privacyText: string = `
    Ao utilizar este site, você concorda com a coleta e uso de informações conforme descrito em nossa Política de Privacidade. 
    Seus dados serão utilizados apenas para fins de contato e não serão compartilhados com terceiros sem sua autorização.
    Para mais detalhes, consulte nossa política completa.
  `;

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messages = [{
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos obrigatórios corretamente.'
      }];
      return;
    }

    const { privacy, ...payload } = this.form.value;
    this.payloadSent = payload;
console.log('Payload enviado:', this.payloadSent);
    this.formService.postcontact(payload).subscribe({
      next: (e) => {
        console.log('Resposta do servidor:', e);
        this.messages = [{
          severity: 'success',
          summary: 'Enviado',
          detail: 'Mensagem enviada com sucesso!'
        }];
        this.form.reset();
      },
      error: (e) => {
        console.log('Resposta do servidor:', e);
        this.messages = [{
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao enviar mensagem.'
        }];
      }
    });
  }
}