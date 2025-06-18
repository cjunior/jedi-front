export function fileToFormData(file: File, fieldName: string = 'file'): FormData {
  const formData = new FormData();
  formData.append(fieldName, file);
  return formData;
}