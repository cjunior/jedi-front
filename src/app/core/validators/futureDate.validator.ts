import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const birthDateInFutureValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const birthDate = control.value;

  if (!birthDate) return null;

  const dataSelecionada = new Date(birthDate);
  const hoje = new Date();

  // Zera as horas para comparar apenas a data
  dataSelecionada.setHours(0, 0, 0, 0);
  hoje.setHours(0, 0, 0, 0);

  return dataSelecionada > hoje ? { dataFutura: true } : null;
};
