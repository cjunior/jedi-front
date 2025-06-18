import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
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
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder)
  private readonly loginService = inject(LoginService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService)
  private readonly router = inject(Router)

  private readonly submittedSignal = signal(false);
  protected submitted = computed(() => this.submittedSignal());
  protected isLoading = signal(false);

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });


  onSubmit() {
    this.submittedSignal.set(true);
    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';
    if (this.form.valid) {
      this.isLoading.set(true);
      this.loginService.login(email, password).subscribe({
        next: (response) => {
          this.authService.login(response.token)
          this.router.navigate(['/configuracoes']);
          this.isLoading.set(false);
        }
      })
    }
  }
}
