import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ManageRegisterService } from './services/manage-register.service';

@Component({
  selector: 'app-manager-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    DialogModule,
    TooltipModule,
    PanelModule,
    ConfirmDialogModule,
    ToastModule,
    MessageModule,
    DropdownModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './manager-register.component.html',
  styleUrl: './manager-register.component.scss',
})
export class ManagerRegisterComponent implements OnInit {
  usuarioForm: FormGroup;
  editForm: FormGroup;
  usuarios: any[] = [];
  fotoPreview: string | ArrayBuffer | null = null;
  editFotoPreview: string | ArrayBuffer | null = null;
  isLoading = false;
  addUserDialogVisible = false;
  editDialogVisible = false;
  usuarioEditandoIndex = -1;

  // Paginação
  loading = false;
  totalRecords = 0;
  first = 0;
  rows = 10;
  searchTerm = '';

  // Controle de visibilidade das senhas
  showPassword = false;
  showConfirmPassword = false;
  showEditPassword = false;
  showEditConfirmPassword = false;

  cargoOptions = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Gerente', value: 'GERENTE' },
    { label: 'Editor', value: 'BLOG' },
  ];

  private readonly manageRegisterService = inject(ManageRegisterService);

  constructor(
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {
    // ...existing code...
    this.usuarioForm = this.fb.group(
      {
        nome: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
            Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
          ],
        ],
        login: [
          '',
          [Validators.required, Validators.email, Validators.maxLength(255)],
        ],
        cargo: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]*$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        foto: [''],
      },
      { validators: this.passwordMatchValidator }
    );

    this.editForm = this.fb.group(
      {
        nome: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
            Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
          ],
        ],
        login: [
          '',
          [Validators.required, Validators.email, Validators.maxLength(255)],
        ],
        cargo: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.minLength(6),
            Validators.maxLength(50),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]*$/
            ),
          ],
        ],
        confirmPassword: [''],
        foto: [''],
      },
      { validators: this.editPasswordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(event?: any): void {
    this.loading = true;

    if (event) {
      this.first = event.first;
      this.rows = event.rows;
    }

    const page = Math.floor(this.first / this.rows);
    const size = this.rows;

    this.manageRegisterService
      .getManagerRegister(page, size, this.searchTerm)
      .subscribe({
        next: (response: any) => {
          if (response.content) {
            this.usuarios = response.content;
            this.totalRecords = response.totalElements;
          } else if (response.data) {
            this.usuarios = response.data.content || response.data;
            this.totalRecords =
              response.data.totalElements || response.data.length;
          } else {
            this.usuarios = response;
            this.totalRecords = response.length;
          }

          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar usuários:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar lista de usuários.',
          });
        },
      });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.first = 0; // Reset para primeira página
    this.loadUsuarios();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.first = 0;
    this.loadUsuarios();
  }

  // ...existing code... (resto dos métodos permanecem iguais)

  openAddUserDialog() {
    this.addUserDialogVisible = true;
  }

  closeAddUserDialog() {
    this.addUserDialogVisible = false;
    this.resetForm();
  }

  openEditDialog() {
    this.editDialogVisible = true;
  }

  closeEditDialog() {
    this.editDialogVisible = false;
    this.usuarioEditandoIndex = -1;
    this.editForm.reset();
    this.editFotoPreview = null;
    this.showEditPassword = false;
    this.showEditConfirmPassword = false;
  }

  onFileSelect(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.usuarioForm.patchValue({ foto: file });
      const reader = new FileReader();
      reader.onload = () => (this.fotoPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onEditFileSelect(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.editForm.patchValue({ foto: file });
      const reader = new FileReader();
      reader.onload = () => (this.editFotoPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  criarUsuario() {
    if (this.usuarioForm.valid) {
      this.isLoading = true;

      const formData = this.usuarioForm.value;
      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.nome);
      formDataToSend.append('login', formData.login);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.cargo);

      if (formData.foto instanceof File) {
        formDataToSend.append('photo', formData.foto);
      }

      this.manageRegisterService.postManagerRegister(formDataToSend).subscribe({
        next: (response) => {
          this.loadUsuarios(); // Recarrega a lista após criar
          this.closeAddUserDialog();
          this.isLoading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário criado com sucesso!',
          });
        },
        error: (error) => {
          console.error('Erro ao criar usuário:', error);
          this.isLoading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar usuário. Tente novamente.',
          });
        },
      });
    }
  }
  editarUsuario(usuario: any, index: number) {
    this.usuarioEditandoIndex = index;
    this.editForm.patchValue({
      nome: usuario.name || '',
      login: usuario.login || usuario.email || '',
      cargo: usuario.role || '',
      password: '',
      confirmPassword: '',
      foto: null,
    });

    // Definir preview da foto atual
    this.editFotoPreview = usuario.photoUrl || null;

    // Abrir o modal
    this.editDialogVisible = true;
  }

  salvarEdicao() {
    if (this.editForm.valid && this.usuarioEditandoIndex >= 0) {
      this.isLoading = true;
      const formData = this.editForm.value;
      const usuario = this.usuarios[this.usuarioEditandoIndex];
      const formDataToSend = new FormData();

      // Enviar dados obrigatórios
      formDataToSend.append('name', formData.nome);
      formDataToSend.append('login', formData.login);
      formDataToSend.append('role', formData.cargo);

      // Enviar senha apenas se foi preenchida
      if (formData.password && formData.password.trim() !== '') {
        formDataToSend.append('password', formData.password);
      }

      // Enviar foto apenas se uma nova foi selecionada
      if (formData.foto instanceof File) {
        formDataToSend.append('photo', formData.foto);
      }

      const userId = usuario.id;

      this.manageRegisterService
        .putManagerRegister(userId, formDataToSend)
        .subscribe({
          next: (response) => {
            this.loadUsuarios();
            this.closeEditDialog();
            this.isLoading = false;

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário atualizado com sucesso!',
            });
          },
          error: (error) => {
            console.error('Erro ao atualizar usuário:', error);
            this.isLoading = false;

            let errorMessage = 'Erro ao atualizar usuário. Tente novamente.';

            // Personalizar mensagem de erro baseada na resposta
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.status === 400) {
              errorMessage =
                'Dados inválidos. Verifique os campos preenchidos.';
            } else if (error.status === 404) {
              errorMessage = 'Usuário não encontrado.';
            } else if (error.status === 409) {
              errorMessage = 'Email já está em uso por outro usuário.';
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: errorMessage,
            });
          },
        });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios antes de salvar.',
      });
    }
  }

  excluirUsuario(event: Event, index: number) {
    const usuario = this.usuarios[index];

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Tem certeza que deseja excluir o usuário "${usuario.name}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const userId = usuario.id;

        this.manageRegisterService.deleteManagerRegister(userId).subscribe({
          next: (response) => {
            this.loadUsuarios();

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Usuário "${usuario.name}" excluído com sucesso!`,
            });
          },
          error: (error) => {
            console.error('Erro ao excluir usuário:', error);

            let errorMessage = 'Erro ao excluir usuário. Tente novamente.';

            // Personalizar mensagem de erro baseada na resposta
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.status === 400) {
              errorMessage = 'Não é possível excluir este usuário.';
            } else if (error.status === 404) {
              errorMessage = 'Usuário não encontrado.';
            } else if (error.status === 403) {
              errorMessage =
                'Você não tem permissão para excluir este usuário.';
            } else if (error.status === 409) {
              errorMessage =
                'Usuário possui dados vinculados e não pode ser excluído.';
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: errorMessage,
            });
          },
        });
      },
      reject: () => {
        // Opcional: mostrar mensagem de cancelamento
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Exclusão cancelada pelo usuário.',
        });
      },
    });
  }

  resetForm() {
    this.usuarioForm.reset();
    this.fotoPreview = null;
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  // ...existing code... (resto dos métodos helper permanecem iguais)

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldErrors(form: FormGroup, fieldName: string): string[] {
    const field = form.get(fieldName);
    const errors: string[] = [];

    if (!field?.errors || (!field.dirty && !field.touched)) {
      if (
        fieldName === 'confirmPassword' &&
        form.errors?.['passwordMismatch'] &&
        field?.dirty
      ) {
        errors.push('As senhas não coincidem');
      }
      return errors;
    }

    const fieldErrors = field.errors;
    const label = this.getFieldLabel(fieldName);

    if (fieldErrors['required']) {
      errors.push(`${label} é obrigatório`);
    }
    if (fieldErrors['email']) {
      errors.push('Email deve ter um formato válido');
    }
    if (fieldErrors['minlength']) {
      const minLength = fieldErrors['minlength'].requiredLength;
      errors.push(`${label} deve ter pelo menos ${minLength} caracteres`);
    }
    if (fieldErrors['maxlength']) {
      const maxLength = fieldErrors['maxlength'].requiredLength;
      errors.push(`${label} deve ter no máximo ${maxLength} caracteres`);
    }
    if (fieldErrors['pattern']) {
      errors.push(this.getPatternErrorMessage(fieldName));
    }

    if (fieldName === 'confirmPassword' && form.errors?.['passwordMismatch']) {
      errors.push('As senhas não coincidem');
    }

    return errors;
  }

  private getPatternErrorMessage(fieldName: string): string {
    if (fieldName === 'nome') {
      return 'Nome deve conter apenas letras e espaços';
    }
    if (fieldName === 'password') {
      return 'Senha deve conter pelo menos 1 maiúscula, 1 minúscula e 1 número (mín. 6 caracteres)';
    }
    return 'Formato inválido';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nome: 'Nome',
      login: 'Email',
      password: 'Senha',
      confirmPassword: 'Confirmar Senha',
    };
    return labels[fieldName] || fieldName;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  editPasswordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (!password.value && !confirmPassword.value) {
      return null;
    }

    if (password.value && !confirmPassword.value) {
      return { passwordMismatch: true };
    }

    if (!password.value && confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleEditPasswordVisibility() {
    this.showEditPassword = !this.showEditPassword;
  }

  toggleEditConfirmPasswordVisibility() {
    this.showEditConfirmPassword = !this.showEditConfirmPassword;
  }

  getCargoLabel(cargo: string): string {
    const option = this.cargoOptions.find((opt) => opt.value === cargo);
    return option ? option.label : cargo;
  }
  getCargoClass(cargo: string): string {
    const classes = {
      ADMIN: 'bg-red-100 text-red-800',
      GERENTE: 'bg-blue-100 text-blue-800',
      BLOG: 'bg-green-100 text-green-800',
    };
    return (
      classes[cargo as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
  }
}
