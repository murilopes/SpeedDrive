import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions, Text, StyleSheet, View, KeyboardAvoidingView, Platform, 
} from 'react-native';
import { Appbar, Avatar, Snackbar } from 'react-native-paper';
import IconEntypo from 'react-native-vector-icons/Entypo';
import useStateWithCallback from 'use-state-with-callback';
import * as ImagePicker from 'expo-image-picker';
import * as userLib from '../../lib/user'
import ConfigFile from "../../config.json"
import axios from "axios";

interface IAluno {
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

const AlunoCadastro = (props: object) => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  const _handleCadastroDadosPessoais = () => {
    navigation.navigate('CadastroDadosPessoais', {pessoa: objAluno, tipoUsuario: 'aluno', idAlunoImpersonate: props.route.params?.idAlunoImpersonate});
  };

  const _handleCadastroEndereco = () => {
    //O envio do parametro de impersontate é como "Pessoa" pois a tela de endereço faz parte do modulo Comum
    navigation.navigate('CadastroEndereco', {pessoa: objAluno, idPessoaImpersonate: props.route.params?.idAlunoImpersonate});
  };

  const _handleCadastroDocumentos = () => {
    navigation.navigate('CadastroDocumentosAluno', {pessoa: objAluno, idAlunoImpersonate: props.route.params?.idAlunoImpersonate});
  };

  let alunoVazio: IAluno = {}

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [count, setCount] = React.useState(0)

  const [iconeDadosPessoais, setIconeDadosPessoais] = React.useState('')
  const [iconeEndereco, setIconeEndereco] = React.useState('')
  const [iconeDocumentos, setIconeDocumentos] = React.useState('')
  const [corIconeDadosPessoais, setCorIconeDadosPessoais] = React.useState('')
  const [corIconeEndereco, setCorIconeEndereco] = React.useState('')
  const [corIconeDocumentos, setCorIconeDocumentos] = React.useState('')

  const [objAluno, setObjAluno] = useStateWithCallback(alunoVazio, 
    () => {
      setPercentDadosPessoais(calculaPercentDadosPessoais());
      setPercentEndereco(calculaPercentEndereco());
      setPercentDocumentos(calculaPercentDocumentos());
    }
  )

  const [percentDadosPessoais, setPercentDadosPessoais] = useStateWithCallback(0, 
    () => {
      setIconeDadosPessoais(defineIconeDeProgresso(percentDadosPessoais))
      setCorIconeDadosPessoais(defineCorIconeDeProgresso(percentDadosPessoais))
    }
  )
  const [percentEndereco, setPercentEndereco] = useStateWithCallback(0,     
    () => {
      setIconeEndereco(defineIconeDeProgresso(percentEndereco))
      setCorIconeEndereco(defineCorIconeDeProgresso(percentEndereco))
    }
  )

  const [percentDocumentos, setPercentDocumentos] = useStateWithCallback(0,     
    () => {
      setIconeDocumentos(defineIconeDeProgresso(percentDocumentos))
      setCorIconeDocumentos(defineCorIconeDeProgresso(percentDocumentos))
    }
  )

  const calculaPercentDadosPessoais = () : number => {
    let contagemTotalCampos = 7
    let contagemTotalPreenchido = 0

    console.log(objAluno)

    if (objAluno.nome != undefined && objAluno.nome != '') contagemTotalPreenchido++
    if (objAluno.sobrenome != undefined && objAluno.sobrenome != '') contagemTotalPreenchido++
    if (objAluno.sexo != undefined && objAluno.sexo != '') contagemTotalPreenchido++
    if (objAluno.CPF != undefined && objAluno.CPF != '') contagemTotalPreenchido++
    if (objAluno.whatsapp != undefined && objAluno.whatsapp != '') contagemTotalPreenchido++
    if (objAluno.dataNascimento != undefined && objAluno.dataNascimento != '') contagemTotalPreenchido++
    if (objAluno.email != undefined && objAluno.email != '') contagemTotalPreenchido++

    const percentObtido = contagemTotalPreenchido/contagemTotalCampos * 100
    
    return Math.floor(percentObtido)
  }

  const calculaPercentEndereco = () : number => {
    let contagemTotalCampos = 6
    let contagemTotalPreenchido = 0

    if (objAluno.CEP != undefined && objAluno.CEP != '') contagemTotalPreenchido++
    if (objAluno.endereco != undefined && objAluno.endereco != '') contagemTotalPreenchido++
    if (objAluno.numero != undefined && objAluno.numero != '') contagemTotalPreenchido++
    if (objAluno.bairro != undefined && objAluno.bairro != '') contagemTotalPreenchido++
    if (objAluno.cidade != undefined && objAluno.cidade != '') contagemTotalPreenchido++
    if (objAluno.estado != undefined && objAluno.estado != '') contagemTotalPreenchido++

    const percentObtido = contagemTotalPreenchido/contagemTotalCampos * 100

    return Math.floor(percentObtido)
  }

  const calculaPercentDocumentos = () : number => {
    let contagemTotalCampos = 1
    let contagemTotalPreenchido = 0

    if (objAluno.urlCarteiraHabilitacao != undefined && objAluno.urlCarteiraHabilitacao != '') contagemTotalPreenchido++

    const percentObtido = contagemTotalPreenchido/contagemTotalCampos * 100

    return Math.floor(percentObtido)
  }

  const pickImage = async () => {

    //Se o acesso à essa tela tiver sido atrave de impersonate, não deve deixar trocar a foto
    if (props.route.params?.idAlunoImpersonate) {
      setSnackMensagem('Admin não pode mudar foto do aluno')
      setSnackMensagemVisible(true)
      return
    }    

    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Desculpa, precisamos de acesso ao rolo de foto para isso!');
      }
      else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          setObjAluno({...objAluno, urlFotoPerfil: result.uri})
          SalvarFotoPerfil(result)
        }
      }
    }
  };

  const SalvarFotoPerfil = async (imageFile: any) => {

    const { token } = JSON.parse(await userLib.getUserAuthData())

    const bodyFormData = new FormData();
    bodyFormData.append('imagem',  {
      uri: imageFile.uri,
      type: 'image/jpeg',
      name: `perfil.jpg`
    });

    try {
      const resp = await API.put('/aluno/alterarFotoPerfil',
      bodyFormData, 
      {
       headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        setSnackMensagem('Foto do perfil alterada')
        setSnackMensagemVisible(true)                    
      }  

    } catch (error) {
      setSnackMensagem('Erro ao alterar foto do perfil')
      setSnackMensagemVisible(true)
    }
  }

  const defineIconeDeProgresso = (percent: number):string => {
    if(percent == 0){
      return 'progress-empty'
    }
    else if (percent <= 40){
      return 'progress-one'
    }
    else if (percent <= 99){
      return 'progress-two'
    }
    else{
      return 'progress-full'
    }
  }

  const defineCorIconeDeProgresso = (percent: number):string => {
    if(percent == 0){
      return 'red'
    }
    else if (percent <= 40){
      return 'yellow'
    }
    else if (percent <= 99){
      return 'orange'
    }
    else{
      return 'green'
    }
  }

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const getAluno = async () => {

    try {

      let { id, token } = JSON.parse(await userLib.getUserAuthData())

      if(props.route.params?.idAlunoImpersonate != undefined)
        id = props.route.params?.idAlunoImpersonate

      const resp = await API.get('/aluno/' + id, 
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar aluno')
        return  resp.data.aluno
      }
    } catch (error) {
      console.log('Não conseguiu carregar aluno')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  navigation.addListener('focus', () => {
    setCount(count+1)
  })

  React.useEffect(() => {
    getAluno().then(
      (aluno) => {
        if (aluno)
          setObjAluno(aluno)
      }
    ) 
    
  }, [count])

  return (
    <KeyboardAvoidingView
      style={styles.container_principal}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Appbar.Header statusBarHeight={0} style={{height: 60, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title={`Cadastro ${props?.route?.params?.nomeAlunoImpersonate ?? ''}`} style={{alignItems:'center'}}/>
        <Appbar.Action icon="arrow-left-circle" color='#212F3C' size={30}  />
      </Appbar.Header>

      <View style={{alignItems: 'center', marginTop: 15, marginBottom: 20}}>
        <Avatar.Image 
          size={170} 
          source={{uri: objAluno.urlFotoPerfil ? objAluno.urlFotoPerfil : ConfigFile.URL_IMAGEM_NAO_ENCONTRADA}}
          style={{}}
        />
        <View style={{alignItems: 'center', marginTop: -30}}>
          <Avatar.Icon 
            size={50} 
            icon='camera'
            onTouchEnd={pickImage}
          />
        </View>
      </View>

      <View style={styles.view_items}>

        <View style={styles.divider} />

        <View style={styles.item} onTouchEnd={_handleCadastroDadosPessoais}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <IconEntypo name={iconeDadosPessoais} color={corIconeDadosPessoais} size={30} style={{flex: 1}} />
              <Text style={styles.item_text_status_preenchimento}>{percentDadosPessoais}%</Text>
            </View>
            <View style={styles.item_detalhes}>
              <View style={styles.item_text_superior}>
                <Text style={styles.item_text_value}>Dados Pessoais</Text>
              </View>            
            </View>
            <View style={styles.item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={30} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.item} onTouchEnd={_handleCadastroEndereco}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <IconEntypo name={iconeEndereco} color={corIconeEndereco} size={30} style={{flex: 1}} />
              <Text style={styles.item_text_status_preenchimento}>{percentEndereco}%</Text>
            </View>
            <View style={styles.item_detalhes}>
              <View style={styles.item_text_superior}>
                <Text style={styles.item_text_value}>Endereço</Text>
              </View>            
            </View>
            <View style={styles.item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={30} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.divider} />

        <View style={styles.item}  onTouchEnd={_handleCadastroDocumentos}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <IconEntypo name={iconeDocumentos} color={corIconeDocumentos} size={30} style={{flex: 1}} />
              <Text style={styles.item_text_status_preenchimento}>{percentDocumentos}%</Text>
            </View>
            <View style={styles.item_detalhes}>
              <View style={styles.item_text_superior}>
                <Text style={styles.item_text_value}>Documentos</Text>
              </View>            
            </View>
            <View style={styles.item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={30} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

      </View>

      <Snackbar
          visible={snackMensagemVisible}
          onDismiss={() => setSnackMensagemVisible(false)}
          action={{
            label: 'OK',
            onPress: () => {},
          }}>
          {snackMensagem}
        </Snackbar>

    </KeyboardAvoidingView>
  );
};

export default AlunoCadastro;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },
  view_items: {
    flex: 5,
    alignItems: 'center',
    width: '100%',
  },

  item: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },

  item_interno: {
    flex: 1,
    flexDirection: 'row',
   /*  backgroundColor: '#F1F1F1', */
    height: '90%',
  },

  item_status: {
    flex: 1,
    paddingTop: 5,
    alignItems: 'center',
  },

  item_seta: {
    flex: 1,
    paddingTop: 15,
    alignItems: 'center',
  },

  item_text_status_preenchimento: {
    flex: 1,
    color: 'white'
  },

  item_detalhes: {
    flex: 3,
    paddingTop: 15,
    paddingLeft: 15,
  },

  item_text_superior: {
    flex: 1,
  },

  item_text_inferior: {
    flex: 1,
    paddingBottom: 20,
  },

  item_text_title: {
    flex: 1,
    fontSize: 14,
  },

  item_text_value: {
    flex: 1,
    fontSize: 22,
    color: 'white',
  },

  item_action: {
    flex: 3,
    width: '100%',
    alignItems: 'center',
  },

  divider: {
    flex: 1,
    width: Dimensions.get('window').width,
    maxHeight: 0.5,
    backgroundColor: 'white'
  }
});
