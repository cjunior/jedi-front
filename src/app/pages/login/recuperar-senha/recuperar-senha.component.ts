import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    MessageModule,
    ToastModule,
  ],
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss'],
  providers: [MessageService]
})
export class RecuperarSenhaComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  private readonly submittedSignal = signal(false);
  protected submitted = computed(() => this.submittedSignal());
  protected isLoading = signal(false);

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    this.submittedSignal.set(true);
    const email = this.form.value.email ?? '';
    
    if (this.form.valid) {
      this.isLoading.set(true);
      
      // Aqui você pode implementar o serviço de recuperação de senha
      // Por enquanto, vou simular uma requisição
      setTimeout(() => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Email enviado',
          detail: 'Instruções de recuperação foram enviadas para seu email.'
        });
        
        // Opcional: redirecionar para login após alguns segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      }, 2000);
      
      // Implementação real seria algo como:
      // this.loginService.recuperarSenha(email).subscribe({
      //   next: (response) => {
      //     this.isLoading.set(false);
      //     this.messageService.add({
      //       severity: 'success',
      //       summary: 'Email enviado',
      //       detail: 'Instruções de recuperação foram enviadas para seu email.'
      //     });
      //     setTimeout(() => {
      //       this.router.navigate(['/login']);
      //     }, 3000);
      //   },
      //   error: (error) => {
      //     this.isLoading.set(false);
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Erro ao enviar email',
      //       detail: error.error.message ?? 'Ocorreu um erro ao tentar enviar o email. Tente novamente.'
      //     });
      //   }
      // });
    }
  }
}