import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const rgValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return null;
  }

  const rg = control.value.replace(/[^0-9xX]/g, '');

  if (!rg || rg.length < 7 || rg.length > 12) {
    return { rgInvalido: true };
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(rg)) {
    return { rgInvalido: true };
  }

  // Verifica padrão válido (dígitos e letra final opcional)
  if (!/^[0-9]{6,11}[0-9xX]?$/.test(rg)) {
    return { rgInvalido: true };
  }

  return null;
};
