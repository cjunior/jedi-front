export interface IPreRegistration {
  completeName: string;
  email: string;
  cellphone: string;
}

export interface ICompleteRegistrationPayload {
  birthDate: string; // formato 'yyyy-MM-dd'
  municipality: string;
  cpf: string;
  rg: string;
  document: File; // ou Blob, mas normalmente será File
  proofOfAdress: File;
  }

export interface IPreRegistrationResponse {
  expiration: string;
  token: string;
  message: string;
}
