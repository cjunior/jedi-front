export interface IPreRegistration {
  completeName: string;
  email: string;
  cellphone: string;
  municipality: string;
  otherMunicipality?: string; // opcional, caso o usuário selecione "outros
  acceptedTerms: boolean;
}

export interface ICompleteRegistrationPayload {
  birthDate: string; // formato 'yyyy-MM-dd'
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
