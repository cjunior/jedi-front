import type { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateDescriptionLength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const text = value.replace(/<[^>]*>/g, '').trim();
    return text.length >= 10 ? null : { minlengthHtml: true };
  };
}
