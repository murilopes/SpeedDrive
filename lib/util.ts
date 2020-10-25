import moment from 'moment' 

export const formataDataParaExibicaoDataFriendly = (data?: string) => {
    
  let dataFriendly = data
  
  if(data?.length == 24) {
    const dia = data.substr(8, 2)
    const mes = data.substr(5, 2)
    const ano = data.substr(0, 4)

    dataFriendly = `${dia}/${mes}/${ano}`
  }
  return dataFriendly;
}

export const formataDataParaExibicaoHorarioFriendly = (data: string) => {
  
  let horarioFriendly = data
  
  if(data.length == 24) {
    const hora = data.substr(11, 2)
    const minuto = data.substr(14, 2)

    horarioFriendly = `${hora}:${minuto}`
  }
  return horarioFriendly;
}

export const retornaUltimoNome = (nome?: string) => {
  if (nome == undefined)
    return ''
  else {
    const arrayNomes = nome.split(' ')
    return arrayNomes[arrayNomes.length - 1]
  }
}

export const retornaIdade = (dataNascimento?: string) => {
  if (dataNascimento == undefined)
    return ''
  else {
    var d = new Date,
      ano_atual = d.getFullYear(),
      mes_atual = d.getMonth() + 1,
      dia_atual = d.getDate(),

      ano_aniversario = +dataNascimento.substr(0, 4),
      mes_aniversario = +dataNascimento.substr(5, 2),
      dia_aniversario = +dataNascimento.substr(8, 2),

      quantos_anos = ano_atual - ano_aniversario;

    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
        quantos_anos--;
    }

    return quantos_anos < 0 ? 0 : quantos_anos;
  }
}

export const retornaQtdDias = (dataBase?: string) => {
  if (dataBase == undefined)
    return undefined
  else {

    const now = moment(new Date()); 
    const base = moment(dataBase)
    const duration = moment.duration(now.diff(base));

    const days = Math.floor(duration.asDays());

    return days;
  }
}

export const formataDataFriendlyParaDataSistema = (dataFriendly?: string) => {
  if (dataFriendly == undefined)
    return ''
  else {

    const arrayDataSplitado = dataFriendly.split('/')
    if (arrayDataSplitado.length != 3) return ''
  
    const dia = arrayDataSplitado[0]    
    const mes = arrayDataSplitado[1]
    const ano = arrayDataSplitado[2]    

    const dataSistema = moment(`${ano}-${mes}-${dia}`)
    
    return dataSistema
  }
}

export const estadoList = [
  { label: 'AC', value: 'AC' },
  { label: 'AL', value: 'AL' },
  { label: 'AP', value: 'AP' },
  { label: 'AM', value: 'AM' },
  { label: 'BA', value: 'BA' },
  { label: 'CE', value: 'CE' },
  { label: 'DF', value: 'DF' },
  { label: 'ES', value: 'ES' },
  { label: 'GO', value: 'GO' },
  { label: 'MA', value: 'MA' },
  { label: 'MT', value: 'MT' },
  { label: 'MS', value: 'MS' },
  { label: 'MG', value: 'MG' },
  { label: 'PA', value: 'PA' },
  { label: 'PB', value: 'PB' },
  { label: 'PR', value: 'PR' },
  { label: 'PE', value: 'PE' },
  { label: 'PI', value: 'PI' },
  { label: 'RJ', value: 'RJ' },
  { label: 'RN', value: 'RN' },
  { label: 'RS', value: 'RS' },
  { label: 'RO', value: 'RO' },
  { label: 'RR', value: 'RR' },
  { label: 'SC', value: 'SC' },
  { label: 'SP', value: 'SP' },
  { label: 'SE', value: 'SE' },
  { label: 'TO', value: 'TO' },
];
