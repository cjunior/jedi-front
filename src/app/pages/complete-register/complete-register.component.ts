import { Component, inject, signal, type OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { PreRegistrationService } from '../../core/services/pre-registration.service';
import { ActivatedRoute } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-complete-register',
  standalone: true,
  imports: [
    PanelModule,
    FloatLabel,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    DatePickerModule,
    FluidModule,
    InputMaskModule,
    FileUploadModule,
    Toast
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

  nomeArquivoRG = signal<string | null>(null);
  nomeArquivoComprovante = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  protected estados = signal([
    { label: 'Bahia', value: 'BA' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Santa Catarina', value: 'SC' },
  ]);

  form = this.formBuilder.group({
    completeName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cellphone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
    municipality: [null, Validators.required],
    cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
    birthDate: [null, Validators.required],
    rg: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(12)]],
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
    if (this.form.valid) {
      this.isLoading.set(true);
      const rawValues = this.form.getRawValue();
      console.log('Dados do formulário:', rawValues);

      const formData = new FormData();

      // Converte a data para yyyy-MM-dd (formato aceito pela API)
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
          console.log('Cadastro completo com sucesso:', response);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro completo com sucesso!' });
          this.form.reset();
          this.nomeArquivoRG.set(null);
          this.nomeArquivoComprovante.set(null);

        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Erro ao enviar cadastro completo:', err);
        }
      });
    }
  }

  onRGUpload(event: any) {
    const file = event.files?.[0];
    if (file) {
      this.form.patchValue({ document: file });
      this.nomeArquivoRG.set(file.name);
    }
  }

  onComprovanteUpload(event: any) {
    const file = event.files?.[0];
    if (file) {
      this.form.patchValue({ proofOfAdress: file });
      this.nomeArquivoComprovante.set(file.name);
    }
  }
}
