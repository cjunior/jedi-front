export interface ICicle {
  nome: string,
  dataInicio: Date | null,
  dataFim: Date | null,
  municipios: string[]
}

export interface ICicleResponse extends ICicle {
  id: string,
}

export interface ICurrentCicleResponse {
  dataConsulta: Date,
  municipios: string[]
}
