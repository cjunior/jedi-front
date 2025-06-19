import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filePreview' })
export class FilePreviewPipe implements PipeTransform {
  transform(file: File | string): string {
    if (!file) return '';
    if (typeof file === 'string') {
      return file; // já é uma URL
    }
    return URL.createObjectURL(file); // é um File
  }
}