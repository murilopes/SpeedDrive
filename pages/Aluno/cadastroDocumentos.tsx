import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions, StyleSheet, View, Text
} from 'react-native';
import { Appbar, Chip, Snackbar } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconEntypo from 'react-native-vector-icons/Entypo';


const cadastroDocumentosAluno = () => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  const _handleUploadDocumento = () => {
    navigation.navigate('UploadDocumento', {nomeDocumento: 'Carteira de Habilitação'});
  };

  const [qtdDoctosOk, setQtdDoctosOk] = React.useState(0)
  const [statusDoctoCNH, setStatusDoctoCNH] = React.useState(false)

  React.useEffect(() => {

  }, [])

  return (
    <KeyboardAwareScrollView
      style={styles.container_principal}
    >
      <Appbar.Header statusBarHeight={0} style={{ height: 45, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Documentos" />
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
            <Text style={styles.item_text_bold}>Documentos enviados: {qtdDoctosOk} de 1 </Text>
          </Text>       
        </View>
      </View>

      <View style={styles.view_items}>

        <View style={styles.divider} />

        <View style={styles.item} onTouchEnd={_handleUploadDocumento}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <Icon name= 'check-circle' color= {statusDoctoCNH ? 'green' : 'grey'} size={30} style={{flex: 1}} />
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

      </View>

    </KeyboardAwareScrollView>
  );
};

export default cadastroDocumentosAluno;

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
