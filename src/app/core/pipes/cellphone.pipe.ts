import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cellphone',
  standalone: true,
})
export class cellphonePipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (!value) return '';

    const raw = String(value).replace(/\D/g, '');

    if (raw.length !== 11) return value as string;

    const ddd = raw.slice(0, 2);
    const primeiroDigito = raw[2];
    const parte1 = raw.slice(3, 7);
    const parte2 = raw.slice(7);

    return `(${ddd}) ${primeiroDigito} ${parte1} - ${parte2}`;
  }
}
