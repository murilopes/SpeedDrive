import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions, StyleSheet, View, Text
} from 'react-native';
import { Appbar, Chip, Snackbar } from 'react-native-paper';
import useStateWithCallback from 'use-state-with-callback';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconEntypo from 'react-native-vector-icons/Entypo';
import * as userLib from '../../lib/user'
import ConfigFile from "../../config.json"
import axios from "axios";

interface IInstrutorDocumentos {
  urlFotoCarteiraHabilitacao?: string,
  urlFotoDuploComando?: string,  
  urlFotoFrenteVeiculo?: string,  
  urlFotoTraseiraVeiculo?: string,  
  urlFotoLatEsquerdaVeiculo?: string,  
  urlFotoLatDireitaVeiculo?: string,  
  urlFotoPlacaVeiculo?: string,
}


const cadastroDocumentosInstrutor = (props: object) => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  const _handleUploadDocumento = (nomeDocumento: string, metodoAPI: string, imagemUri: string) => {
    navigation.navigate('UploadDocumento', 
    {
      nomeDocumento,
      metodoAPI,
      imagemUri,
    });
  };

  let instrutorDocumentosVazio: IInstrutorDocumentos = {}

  const [count, setCount] = React.useState(0)
  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [qtdDoctosOk, setQtdDoctosOk] = React.useState(0)
  const [objInstrutorDocumentos, setObjInstrutorDocumentos] = useStateWithCallback(instrutorDocumentosVazio, 
    () => {
      setQtdDoctosOk(calculaQtdDoctosOK());
    }
  )

  const calculaQtdDoctosOK = () : number => {
    let contagemTotalPreenchido = 0
    if (objInstrutorDocumentos.urlFotoCarteiraHabilitacao != undefined && objInstrutorDocumentos.urlFotoCarteiraHabilitacao != '') contagemTotalPreenchido++
    if (objInstrutorDocumentos.urlFotoDuploComando != undefined && objInstrutorDocumentos.urlFotoDuploComando != '') contagemTotalPreenchido++
    if (objInstrutorDocumentos.urlFotoFrenteVeiculo != undefined && objInstrutorDocumentos.urlFotoFrenteVeiculo != '') contagemTotalPreenchido++
    if (objInstrutorDocumentos.urlFotoTraseiraVeiculo != undefined && objInstrutorDocumentos.urlFotoTraseiraVeiculo != '') contagemTotalPreenchido++
    if (objInstrutorDocumentos.urlFotoLatEsquerdaVeiculo != undefined && objInstrutorDocumentos.urlFotoLatEsquerdaVeiculo != '') contagemTotalPreenchido++
    if (objInstrutorDocumentos.urlFotoLatDireitaVeiculo != undefined && objInstrutorDocumentos.urlFotoLatDireitaVeiculo != '') contagemTotalPreenchido++
    if (objInstrutorDocumentos.urlFotoPlacaVeiculo != undefined && objInstrutorDocumentos.urlFotoPlacaVeiculo != '') contagemTotalPreenchido++
    return contagemTotalPreenchido
  }

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const getInstrutor = async () => {

    try {

      let { id, token } = JSON.parse(await userLib.getUserAuthData())

      if(props.route.params?.idInstrutorImpersonate != undefined)
        id = props.route.params?.idInstrutorImpersonate

      const resp = await API.get('/instrutor/' + id, 
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar instrutor')
        return  resp.data.instrutor
      }
    } catch (error) {
      console.log('Não conseguiu carregar instrutor')
      console.log('erro:' , error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  navigation.addListener('focus', () => {
    setCount(count+1)
  })

  React.useEffect(() => {
    getInstrutor().then(
      (instrutor) => {
        if (instrutor)
        setObjInstrutorDocumentos(instrutor)
      }
    )
    
  }, [count])

  return (
    <KeyboardAwareScrollView
      style={styles.container_principal}
    >
      <Appbar.Header statusBarHeight={0} style={{ height: 60, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Documentos" style={{alignItems:'center'}}/>
        <Appbar.Action icon="arrow-left-circle" color='#212F3C' size={30}  />
      </Appbar.Header>

      <View style={styles.view_infos}>
        <View style={styles.item_icon}>
          <Icon name='clipboard' size={30} color='white'/>
        </View>
        <View style={styles.item_detalhes}>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_suave}>Faça upload dos documentos solicitados abaixo </Text>
          </Text>    
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_bold}>Documentos enviados: {qtdDoctosOk} de 7 </Text>
          </Text>       
        </View>
      </View>

      <View style={styles.view_items}>

        <View style={styles.divider} />

        <View style={styles.item} onTouchEnd={() => _handleUploadDocumento('Carteira de Habilitação', '/instrutor/alterarFotoCarteiraHabilitacao', objInstrutorDocumentos.urlFotoCarteiraHabilitacao)}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <Icon name= 'check-circle' color= {objInstrutorDocumentos.urlFotoCarteiraHabilitacao ? 'green' : 'grey'} size={30} style={{flex: 1}} />
            </View>
            <View style={styles.item_detalhes}>
              <View style={styles.item_text_superior}>
                <Text style={styles.item_text_value}>Carteira de Habilitação</Text>
              </View>            
            </View>
            <View style={styles.item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={30} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.item} onTouchEnd={() => _handleUploadDocumento('Duplo Comando Veículo', '/instrutor/alterarFotoDuploComando', objInstrutorDocumentos.urlFotoDuploComando)}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <Icon name= 'check-circle' color= {objInstrutorDocumentos.urlFotoDuploComando ? 'green' : 'grey'} size={30} style={{flex: 1}} />
            </View>
            <View style={styles.item_detalhes}>
              <View style={styles.item_text_superior}>
                <Text style={styles.item_text_value}>Duplo Comando Veículo</Text>
              </View>            
            </View>
            <View style={styles.item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={30} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.item} onTouchEnd={() => _handleUploadDocumento('Frente Veículo', '/instrutor/alterarFotoFrenteVeiculo', objInstrutorDocumentos.urlFotoFrenteVeiculo)}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <Icon name= 'check-circle' color= {objInstrutorDocumentos.urlFotoFrenteVeiculo ? 'green' : 'grey'} size={30} style={{flex: 1}} />
            </View>
            <View style={styles.item_detalhes}>
              <View style={styles.item_text_superior}>
                <Text style={styles.item_text_value}>Frente Veículo</Text>
              </View>            
            </View>
            <View style={styles.item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={30} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.item} onTouchEnd={() => _handleUploadDocumento('Traseira Veículo', '/instrutor/alterarFotoTraseiraVeiculo', objInstrutorDocumentos.urlFotoTraseiraVeiculo)}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <Icon name= 'check-circle' color= {objInstrutorDocumentos.urlFotoTraseiraVeiculo ? 'green' : 'grey'} size={30} style={{flex: 1}} />
            </View>
            <View style={styles.item_detalhes}>
              <View style={styles.item_text_superior}>
                <Text style={styles.item_text_value}>Traseira Veículo</Text>
              </View>            
            </View>
            <View style={styles.item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={30} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.item} onTouchEnd={() => _handleUploadDocumento('Lateral Esq. Veículo', '/instrutor/alterarFotoLatEsquerdaVeiculo', objInstrutorDocumentos.urlFotoLatEsquerdaVeiculo)}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <Icon name= 'check-circle' color= {objInstrutorDocumentos.urlFotoLatEsquerdaVeiculo ? 'green' : 'grey'} size={30} style={{flex: 1}} />
            </View>
            <View style={styles.item_detalhes}>
              <View style={styles.item_text_superior}>
                <Text style={styles.item_text_value}>Lateral Esq. Veículo</Text>
              </View>            
            </View>
            <View style={styles.item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={30} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.item} onTouchEnd={() => _handleUploadDocumento('Lateral Dir. Veículo', '/instrutor/alterarFotoLatDireitaVeiculo', objInstrutorDocumentos.urlFotoLatDireitaVeiculo)}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <Icon name= 'check-circle' color= {objInstrutorDocumentos.urlFotoLatDireitaVeiculo ? 'green' : 'grey'} size={30} style={{flex: 1}} />
            </View>
            <View style={styles.item_detalhes}>
              <View style={styles.item_text_superior}>
                <Text style={styles.item_text_value}>Lateral Dir. Veículo</Text>
              </View>            
            </View>
            <View style={styles.item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={30} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.divider} />

        <View style={styles.item} onTouchEnd={() => _handleUploadDocumento('Placa Veículo', '/instrutor/alterarFotoPlacaVeiculo', objInstrutorDocumentos.urlFotoPlacaVeiculo)}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <Icon name= 'check-circle' color= {objInstrutorDocumentos.urlFotoPlacaVeiculo ? 'green' : 'grey'} size={30} style={{flex: 1}} />
            </View>
            <View style={styles.item_detalhes}>
              <View style={styles.item_text_superior}>
                <Text style={styles.item_text_value}>Placa Veículo</Text>
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

    </KeyboardAwareScrollView>
  );
};

export default cadastroDocumentosInstrutor;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },

  buttonView: {
    margin: 15,
    alignItems: 'center'
  },

  button: {
    backgroundColor: '#0081DA',
    height: 45,
    width: '50%',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },

  buttonText: {
    flex: 1,
    color: '#FFF',
    fontSize: 20,
  },
  
  view_infos: {
    flex: 4,
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#212F3C',
    borderWidth: 2,
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 10
  },
  
  item_icon:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_detalhes:{
    flex: 4,
  },

  item_text_line:{
    flex: 1,
    marginTop: 5,
    color: '#fff'
  },

  item_text_suave:{
    flex: 1,
  },

  item_text_bold:{
    flex: 1,
    fontWeight: 'bold'
  },

  view_items: {
    flex: 5,
    alignItems: 'center',
    width: '100%',
  },

  divider: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 0.5,
    backgroundColor: 'white'
  },

  item: {
    height: 53,
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
    paddingTop: 8,
    alignItems: 'center',
  },

  item_text_status_preenchimento: {
    flex: 1,
    color: 'white'
  },

  item_text_superior: {
    flex: 1,
    paddingTop: 10,
  },

  item_text_value: {
    flex: 1,
    fontSize: 20,
    color: 'white',
  },
  
  item_seta: {
    flex: 1,
    paddingTop: 8,
    alignItems: 'center',
  },

});
