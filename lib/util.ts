
export const formataDataParaExibicaoDataFriendly = (data: string) => {
    
  let dataFriendly = data
  
  if(data.length == 24) {
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