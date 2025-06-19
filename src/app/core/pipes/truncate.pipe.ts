import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  standalone: true,
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (!value || value.length <= limit) {
      return value;
    }
    return value.substring(0, limit) + '...';
  }
}