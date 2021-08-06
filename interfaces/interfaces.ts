export interface IAluno {
  _id?: string,
  nome?: string,
  sobrenome?: string,
  CPF?: string,
  dataNascimento?: string,
  whatsapp?: string,
  sexo?: string,
  email?: string,
  observacoes?: string,
  credencial?: string,
  CEP?: string,
  endereco?: string,
  numero?: string,
  complemento?: string,
  bairro?: string,  
  cidade?: string,  
  estado?: string,  
  urlFotoPerfil?: string,  
  urlCarteiraHabilitacao?: string,  
}

export interface IAlunoTelaDadosPessoais extends IAluno {
  dataNascimentoFormatada?: string
}

export interface IEmpresa {
  _id?: string,
  razaoSocial?: string,
  nomeFantasia?: string,
  CNPJ?: string,
  telefone?: string,
  email?: string,
  endereco?: string,
  latitude?: number,
  longitude?: number,
  valorAulaUnitario?: number,
  valor6Aulas?: number,
  valor10Aulas?: number  
}