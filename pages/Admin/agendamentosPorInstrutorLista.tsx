import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Appbar, Avatar, Snackbar } from 'react-native-paper';
import { RectButton } from 'react-native-gesture-handler';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user'
import * as utilLib from '../../lib/util'
import axios from "axios";

interface IInstrutor {
  _id: string,
  nome: string,
  sobrenome: string,
  urlFotoPerfil: string,
  isCadastroCompleto: boolean,
  createAt: string,
}

const  AgendamentosPorInstrutorLista = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [arrayInstrutores, setArrayInstrutores] = React.useState(Array<IInstrutor>())

  const _handleCadastroInstrutor = (idInstrutor: string, nomeInstrutor: string) => {
    navigation.navigate('InstrutorCadastro', {idInstrutorImpersonate: idInstrutor, nomeInstrutorImpersonate: nomeInstrutor});
  };

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const getListaInstrutores = async () => {

    try {            
      const { id, token } = JSON.parse(await userLib.getUserAuthData())

      const resp = await API.get('/instrutor/', 
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar lista instrutores')     
        console.log(resp)   
        const arrayInstrutores:Array<IInstrutor> = resp.data.instrutores
        
        return arrayInstrutores
      }
    } catch (error) {
      console.log('Não conseguiu carregar lista instrutores')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  useEffect(() => {
    getListaInstrutores().then(
      (ListaInstrutores) => {
        if (ListaInstrutores)
        setArrayInstrutores(ListaInstrutores)
      }
    ) 
  }, [])
  
  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={0} style={{height: 60, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />        
        <Appbar.Content  title="Instrutores" style={{alignItems:'center'}}/>
        <Appbar.Action icon="arrow-left-circle" color='#212F3C' size={30}  />
        
      </Appbar.Header>

      <ScrollView>        
        <View style={styles.view_items} >
          
          {
            arrayInstrutores.map((item, i) => (
              <View key={item._id} style={styles.item}>
                <View style={styles.item_status}>
                  <Avatar.Image 
                    size={55} 
                    source={{uri: item.urlFotoPerfil ? item.urlFotoPerfil : ConfigFile.URL_IMAGEM_NAO_ENCONTRADA}}
                    style={{ borderColor: item.isCadastroCompleto ? 'green' : 'red', borderWidth: 2, overflow: 'hidden' }}
                  />
                </View>
                
                <View style={styles.item_detalhes}>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_title}>{item.nome} {utilLib.retornaUltimoNome(item?.sobrenome)}</Text>
                  </Text>
                  <Text style={styles.item_text_line}>
                    <Text >{`Criado há ${utilLib.retornaQtdDias(item.createAt)} dia(s)`}</Text>
                  </Text>
                  
                </View>
                <View style={styles.item_action}>
                  <RectButton style={styles.button} onPress={() => _handleCadastroInstrutor(item._id, item.nome)}>
                    <Text style={styles.buttonText}>Cadastro</Text>
                  </RectButton>
                </View >
              </View>
            ))
          }

        </View>
      </ScrollView>

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
}

export default AgendamentosPorInstrutorLista;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40
  },

  view_items:{
    flex: 1,
    alignItems: 'center',
  },

  item:{
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    width: '95%',
    marginTop: 15,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
  },

  item_status:{
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_detalhes:{
    flex: 5,
  },

  item_action:{
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_text_line:{
    flex: 1,
    marginTop: 1.5,
    marginBottom: 1.5
  },

  item_text_title:{
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20
  },

  button: {
    backgroundColor: '#0081DA',
    height: 40,
    width: '70%',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginStart: '15%',
  },

  buttonText: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginTop: '10%'
  },
})