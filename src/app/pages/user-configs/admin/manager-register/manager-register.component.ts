import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    DropdownModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './manager-register.component.html',
  styleUrl: './manager-register.component.scss'
})
export class ManagerRegisterComponent {
  usuarioForm: FormGroup;
  editForm: FormGroup;
  usuarios: any[] = [];
  fotoPreview: string | ArrayBuffer | null = null;
  editFotoPreview: string | ArrayBuffer | null = null;
  isLoading = false;
  addUserDialogVisible = false;
  editDialogVisible = false;
  usuarioEditandoIndex = -1;
  
  // Controle de visibilidade das senhas
  showPassword = false;
  showConfirmPassword = false;
  showEditPassword = false;
  showEditConfirmPassword = false;

  // Opções de cargo
  cargoOptions = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Gerente', value: 'gerente' },
    { label: 'Editor', value: 'blog' }
  ];

  private readonly manageRegisterService = inject(ManageRegisterService);

  constructor(
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {
    this.usuarioForm = this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/) 
      ]],
      login: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(255)
      ]],
      cargo: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]*$/) 
      ]],
      confirmPassword: ['', [Validators.required]],
      foto: [''],
    }, { validators: this.passwordMatchValidator });

    this.editForm = this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
      ]],
      login: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(255)
      ]],
      cargo: ['', [Validators.required]],
      password: ['', [
        Validators.minLength(6),
        Validators.maxLength(50),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]*$/)
      ]],
      confirmPassword: [''],
      foto: [''],
    }, { validators: this.editPasswordMatchValidator });

    this.usuarios = [
      {
        nome: 'Aline Barbosa',
        email: 'aline.barbosa@email.com',
        senha: 'senha123',
        cargo: 'admin',
        foto: 'https://i.pravatar.cc/150?img=1'
      },
      {
        nome: 'Carlos Menezes',
        email: 'carlos.menezes@email.com',
        senha: 'senha456',
        cargo: 'gerente',
        foto: 'https://i.pravatar.cc/150?img=2'
      },
      {
        nome: 'Juliana Castro',
        email: 'juliana.castro@email.com',
        senha: 'senha789',
        cargo: 'blog',
        foto: 'https://i.pravatar.cc/150?img=3'
      }
    ];
  }


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
      
      // Adicionar apenas os campos necessários para o backend
      formDataToSend.append('name', formData.nome);
      formDataToSend.append('login', formData.login);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.cargo);
      
      // Não adicionar confirmPassword ao FormData
      
      if (formData.foto instanceof File) {
        formDataToSend.append('photo', formData.foto);
      }
      
      this.enviarDadosParaAPI(formDataToSend, formData);
    }
  }

  private enviarDadosParaAPI(formDataToSend: FormData, originalFormData: any) {
   
    this.manageRegisterService.postManagerRegister(formDataToSend).subscribe({
      next: (response) => {
      
        
        this.usuarios.push({
          nome: originalFormData.nome,
          email: originalFormData.login,
          senha: originalFormData.password,
          cargo: originalFormData.cargo,
          foto: originalFormData.foto instanceof File 
            ? URL.createObjectURL(originalFormData.foto)
            : '/assets/default-avatar.png'
        });
        
        this.closeAddUserDialog();
        this.isLoading = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário criado com sucesso!'
        });
      },
      error: (error) => {
        console.error('Erro ao criar usuário:', error);
        this.isLoading = false;
        
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar usuário. Tente novamente.'
        });
      }
    });
  }

  editarUsuario(usuario: any, index: number) {
    this.usuarioEditandoIndex = index;
    this.editForm.patchValue({
      nome: usuario.nome,
      login: usuario.email,
      cargo: usuario.cargo,
      password: '',
      confirmPassword: '',
      foto: null
    });
    this.editFotoPreview = usuario.foto;
    this.editDialogVisible = true;
  }

  salvarEdicao() {
    if (this.editForm.valid && this.usuarioEditandoIndex >= 0) {
      const formData = this.editForm.value;
      const usuario = this.usuarios[this.usuarioEditandoIndex];
      
      usuario.nome = formData.nome;
      usuario.email = formData.login;
      usuario.cargo = formData.cargo;
      
      if (formData.password) {
        usuario.senha = formData.password;
      }

      if (formData.foto) {
        const reader = new FileReader();
        reader.onload = () => {
          usuario.foto = reader.result;
          this.closeEditDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário atualizado com sucesso!'
          });
        };
        reader.readAsDataURL(formData.foto);
      } else {
        this.closeEditDialog();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário atualizado com sucesso!'
        });
      }
    }
  }

  excluirUsuario(event: Event, index: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que deseja excluir este usuário?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.usuarios.splice(index, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário excluído com sucesso!'
        });
      }
    });
  }

  resetForm() {
    this.usuarioForm.reset();
    this.fotoPreview = null;
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldErrors(form: FormGroup, fieldName: string): string[] {
    const field = form.get(fieldName);
    const errors: string[] = [];
    
    if (!field?.errors || (!field.dirty && !field.touched)) {
      // Verificar erro de confirmação de senha no nível do formulário
      if (fieldName === 'confirmPassword' && form.errors?.['passwordMismatch'] && field?.dirty) {
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
    
    // Verificar erro de confirmação de senha no nível do formulário
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
      'nome': 'Nome',
      'login': 'Email',
      'password': 'Senha',
      'confirmPassword': 'Confirmar Senha'
    };
    return labels[fieldName] || fieldName;
  }

  // Validador customizado para confirmação de senha
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Validador para formulário de edição (senha opcional)
  editPasswordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }

    // Se nenhuma senha foi preenchida, não há erro
    if (!password.value && !confirmPassword.value) {
      return null;
    }
    
    // Se senha foi preenchida mas confirmação não, é erro
    if (password.value && !confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    // Se confirmação foi preenchida mas senha não, é erro
    if (!password.value && confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    // Se ambas foram preenchidas, devem ser iguais
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Métodos para controlar visibilidade das senhas
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

  // Método para obter o label do cargo
  getCargoLabel(cargo: string): string {
    const option = this.cargoOptions.find(opt => opt.value === cargo);
    return option ? option.label : cargo;
  }

  // Método para obter a classe CSS do cargo
  getCargoClass(cargo: string): string {
    const classes = {
      'admin': 'bg-red-100 text-red-800',
      'gerente': 'bg-blue-100 text-blue-800',
      'blog': 'bg-green-100 text-green-800'
    };
    return classes[cargo as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }
}