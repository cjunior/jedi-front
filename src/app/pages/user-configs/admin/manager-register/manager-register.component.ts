import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

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
    ToastModule
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
  
  // Controle dos modais
  addUserDialogVisible = false;
  editDialogVisible = false;
  usuarioEditandoIndex = -1;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      foto: [null],
    });

    this.editForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      foto: [null],
    });

    // Dados de exemplo
    this.usuarios = [
      {
        nome: 'Aline Barbosa',
        email: 'aline.barbosa@email.com',
        senha: 'senha123',
        foto: 'https://i.pravatar.cc/150?img=1'
      },
      {
        nome: 'Carlos Menezes',
        email: 'carlos.menezes@email.com',
        senha: 'senha456',
        foto: 'https://i.pravatar.cc/150?img=2'
      },
      {
        nome: 'Juliana Castro',
        email: 'juliana.castro@email.com',
        senha: 'senha789',
        foto: 'https://i.pravatar.cc/150?img=3'
      }
    ];
  }

  // Métodos para o modal de adicionar usuário
  openAddUserDialog() {
    this.addUserDialogVisible = true;
  }

  closeAddUserDialog() {
    this.addUserDialogVisible = false;
    this.resetForm();
  }

  // Métodos para o modal de editar usuário
  openEditDialog() {
    this.editDialogVisible = true;
  }

  closeEditDialog() {
    this.editDialogVisible = false;
    this.usuarioEditandoIndex = -1;
    this.editForm.reset();
    this.editFotoPreview = null;
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
      try {
        const formData = this.usuarioForm.value;
        const foto = formData.foto;

        if (foto) {
          const reader = new FileReader();
          reader.onload = () => {
            const novoUsuario = {
              nome: formData.nome,
              email: formData.email,
              senha: formData.senha,
              foto: reader.result,
            };
            this.usuarios.push(novoUsuario);
            this.closeAddUserDialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário criado com sucesso!'
            });
          };
          reader.readAsDataURL(foto);
        } else {
          // Usuário sem foto
          const novoUsuario = {
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
            foto: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
          };
          this.usuarios.push(novoUsuario);
          this.closeAddUserDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário criado com sucesso!'
          });
        }
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar usuário!'
        });
      }
    }
  }

  editarUsuario(usuario: any, index: number) {
    this.usuarioEditandoIndex = index;
    this.editForm.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      senha: '',
      foto: null
    });
    this.editFotoPreview = usuario.foto;
    this.editDialogVisible = true;
  }

  salvarEdicao() {
    if (this.editForm.valid && this.usuarioEditandoIndex >= 0) {
      try {
        const formData = this.editForm.value;
        const usuario = this.usuarios[this.usuarioEditandoIndex];
        
        usuario.nome = formData.nome;
        usuario.email = formData.email;
        
        if (formData.senha) {
          usuario.senha = formData.senha;
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
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar usuário!'
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
        try {
          this.usuarios.splice(index, 1);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário excluído com sucesso!'
          });
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao excluir usuário!'
          });
        }
      }
    });
  }

  resetForm() {
    this.usuarioForm.reset();
    this.fotoPreview = null;
  }
}