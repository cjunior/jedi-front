import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-recuperar-email-senha',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    PasswordModule,
    MessageModule,
    ToastModule,
    RouterModule
  ],
  templateUrl: './recuperar-email-senha.component.html',
  styleUrl: './recuperar-email-senha.component.scss',
  providers: [MessageService]
})
export class RecuperarEmailSenhaComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly loginService = inject(LoginService);

  private readonly submittedSignal = signal(false);
  protected submitted = computed(() => this.submittedSignal());
  protected isLoading = signal(false);
  protected tokenValid = signal(false);

  private token: string = '';

  form = this.formBuilder.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    if (!this.token) {
      this.showTokenError();
      return;
    }
    this.validateToken();
  }

  private validateToken() {
    this.isLoading.set(true);
    
    this.loginService.validateResetToken(this.token).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.tokenValid.set(true);
      },
      error: (error) => {
        console.error('Token inválido:', error);
        this.isLoading.set(false);
        this.tokenValid.set(false);
        
        if (error.status === 404 || error.status === 403) {
          this.showTokenError('Token expirado ou inválido. Solicite um novo link de recuperação.');
        } else {
          this.showTokenError();
        }
      }
    });
  }

  private showTokenError(customMessage?: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Token inválido',
      detail: customMessage || 'Link de recuperação inválido ou expirado.'
    });
    
    setTimeout(() => {
      this.router.navigate(['/recuperar-senha']);
    }, 3000);
  }

  onSubmit() {
    this.submittedSignal.set(true);
    
    const newPassword = this.form.value.newPassword ?? '';
    const confirmPassword = this.form.value.confirmPassword ?? '';
    
    if (newPassword !== confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Senhas não coincidem',
        detail: 'A nova senha e a confirmação devem ser iguais.'
      });
      return;
    }
    
    if (this.form.valid && this.tokenValid()) {
      this.isLoading.set(true);
      
      this.loginService.resetPassword(this.token, newPassword).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Senha redefinida',
            detail: response || 'Sua senha foi redefinida com sucesso!'
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erro ao redefinir senha:', error);
          this.isLoading.set(false);
          
          let errorMessage = 'Ocorreu um erro ao redefinir a senha. Por favor, tente novamente.';
          
          if (error.status === 403) {
            errorMessage = 'Token expirou durante o processo. Solicite um novo link de recuperação.';
            setTimeout(() => {
              this.router.navigate(['/recuperar-senha']);
            }, 3000);
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao redefinir senha',
            detail: errorMessage
          });
        }
      });
    }
  }
}