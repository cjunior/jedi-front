import { Component, inject, signal, type OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators, type ValidatorFn, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { PreRegistrationService } from '../../core/services/pre-registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { cpfValidator } from '../../core/validators/cpf.validator';
import { birthDateInFutureValidator } from '../../core/validators/futureDate.validator';
import { rgValidator } from '../../core/validators/rg.validator';

@Component({
  selector: 'app-complete-register',
  standalone: true,
  imports: [
    PanelModule,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    DatePickerModule,
    FluidModule,
    InputMaskModule,
    FileUploadModule,
    Toast,
    MessageModule
  ],
  templateUrl: './complete-register.component.html',
  styleUrl: './complete-register.component.scss',
  providers: [MessageService]
})
export class CompleteRegisterComponent implements OnInit{
  private readonly formBuilder = inject(FormBuilder);
  private readonly preRegistrationService = inject(PreRegistrationService)
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService)
  private readonly router = inject(Router)

  nomeArquivoRG = signal<string | null>(null);
  nomeArquivoComprovante = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  protected showErrors = signal<boolean>(false);

  protected estados = signal([
    { label: 'Bahia', value: 'BA' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Santa Catarina', value: 'SC' },
  ]);

  form = this.formBuilder.group({
    completeName: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    cellphone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
    municipality: [null, Validators.required],
    cpf: ['', [Validators.required, cpfValidator]],
    birthDate: [null, [Validators.required, birthDateInFutureValidator]],
    rg: ['', [Validators.required, rgValidator]],
    document: [null, Validators.required],
    proofOfAdress: [null, Validators.required],
  });

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) this.preRegistrationService.verifyPreRegistration(token).subscribe({
      next: (data) => {
        if (data) {
          this.form.patchValue({
            completeName: data.completeName,
            email: data.email,
            cellphone: data.cellphone,
          });
          this.form.get('completeName')?.disable();
          this.form.get('email')?.disable();
          this.form.get('cellphone')?.disable();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados de pré-inscrição:', err);
      }
    });
  }

  cadastrar() {
    this.showErrors.set(true);
    if (this.form.valid) {
      this.showErrors.set(false);
      this.isLoading.set(true);
      const rawValues = this.form.getRawValue();

      const formData = new FormData();

      const birthDate = rawValues.birthDate && (rawValues.birthDate as any) instanceof Date
        ? (rawValues.birthDate as Date).toISOString().split('T')[0]
        : String(rawValues.birthDate || '');

      formData.append('birthDate', birthDate);
      formData.append('municipality', rawValues.municipality || '');
      formData.append('cpf', rawValues.cpf || '');
      formData.append('rg', rawValues.rg || '');

      if (rawValues.document) {
        formData.append('document', rawValues.document);
      }

      if (rawValues.proofOfAdress) {
        formData.append('proofOfAdress', rawValues.proofOfAdress);
      }

      const token = this.route.snapshot.paramMap.get('token') || '';
      this.preRegistrationService.completeRegistration(formData, token).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro completo com sucesso!' });
          this.form.reset();
          this.nomeArquivoRG.set(null);
          this.nomeArquivoComprovante.set(null);
          setInterval(() => {
            this.router.navigate(['/']);
          }, 1000)
        },
        error: (err) => {
          this.isLoading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error?.message || 'Ocorreu um erro ao completar o cadastro. Por favor, tente novamente.'
          });
        }
      });
    }
  }

  private readonly TAMANHO_MAXIMO_MB = 1;

  onRGUpload(event: any) {
    const file = event.files?.[0];
    if (!file) return;

    if (file.size > this.TAMANHO_MAXIMO_MB * 1024 * 1024) {
      this.messageService.add({
        severity: 'error',
        summary: 'Arquivo muito grande',
        detail: `A foto do RG deve ter no máximo ${this.TAMANHO_MAXIMO_MB} MB.`,
      });
      this.form.patchValue({ document: null });
      this.nomeArquivoRG.set(null);
      return;
    }

    this.form.patchValue({ document: file });
    this.nomeArquivoRG.set(file.name);
  }

  onComprovanteUpload(event: any) {
    const file = event.files?.[0];
    if (!file) return;

    if (file.size > this.TAMANHO_MAXIMO_MB * 1024 * 1024) {
      this.messageService.add({
        severity: 'error',
        summary: 'Arquivo muito grande',
        detail: `O comprovante deve ter no máximo ${this.TAMANHO_MAXIMO_MB} MB.`,
      });
      this.form.patchValue({ proofOfAdress: null });
      this.nomeArquivoComprovante.set(null);
      return;
    }

    this.form.patchValue({ proofOfAdress: file });
    this.nomeArquivoComprovante.set(file.name);
  }

  onFileError(event: any, tipo: 'document' | 'proofOfAdress') {
    const message = 'O arquivo excede o tamanho máximo permitido (1 MB).';

    this.messageService.add({
      severity: 'error',
      summary: 'Arquivo muito grande',
      detail: message,
    });

    // Limpa o campo se necessário
    if (tipo === 'document') {
      this.form.patchValue({ document: null });
      this.nomeArquivoRG.set(null);
    } else if (tipo === 'proofOfAdress') {
      this.form.patchValue({ proofOfAdress: null });
      this.nomeArquivoComprovante.set(null);
    }
  }
}
