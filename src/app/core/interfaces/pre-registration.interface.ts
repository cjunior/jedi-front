export interface IPreRegistration {
  completeName: string;
  email: string;
  cellphone: string;
}

export interface IPreRegistrationResponse {
  expiration: string;
  token: string;
  message: string;
}
