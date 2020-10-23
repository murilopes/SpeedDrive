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