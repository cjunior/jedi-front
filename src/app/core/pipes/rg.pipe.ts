import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rg' })
export class RgPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    const cleaned = value.replace(/\D/g, '');
    const len = cleaned.length;

    if (len < 2) return cleaned;

    const body = cleaned.slice(0, -1);
    const lastChar = cleaned.slice(-1);

    return `${body}-${lastChar}`;
  }
}
