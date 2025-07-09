export interface IPreRegistration {
  completeName: string;
  email: string;
  cellphone: string;
  acceptedTerms: boolean;
}

export interface ICompleteRegistrationPayload {
  birthDate: string; // formato 'yyyy-MM-dd'
  municipality: string;
  cpf: string;
  rg: string;
  document: File; // ou Blob, mas normalmente será File
  proofOfAdress: File;
}

export interface ICompleteRegister extends IPreRegistration, ICompleteRegistrationPayload {
  cellPhone: string;
  documentUrl: string;
  proofOfAdressUrl: string;
}

export interface IPreRegistrationResponse {
  expiration: string;
  token: string;
  message: string;
}
