import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions, Text, StyleSheet, View, KeyboardAvoidingView, Platform, 
} from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import useStateWithCallback from 'use-state-with-callback';

const AlunoCadastro = () => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  const _handleCadastroDadosPessoais = () => {
    navigation.navigate('CadastroDadosPessoais');
  };

  const _handleCadastroEndereco = () => {
    navigation.navigate('CadastroEndereco');
  };

  const [iconeDadosPessoais, setIconeDadosPessoais] = React.useState('')
  const [iconeEndereco, setIconeEndereco] = React.useState('')
  const [iconeDocumentos, setIconeDocumentos] = React.useState('')
  const [corIconeDadosPessoais, setCorIconeDadosPessoais] = React.useState('')
  const [corIconeEndereco, setCorIconeEndereco] = React.useState('')
  const [corIconeDocumentos, setCorIconeDocumentos] = React.useState('')

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

  React.useEffect(() => {

    setPercentDadosPessoais(42)
    setPercentEndereco(100)
    setPercentDocumentos(100)

  }, [])

  return (
    <KeyboardAvoidingView
      style={styles.container_principal}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Appbar.Header statusBarHeight={-15} style={{ height: 45, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Cadastro" />
      </Appbar.Header>

      <View style={{alignItems: 'center', marginTop: 15, marginBottom: 20}}>
        <Avatar.Image 
          size={170} 
          source={{uri:'https://s2.glbimg.com/jsaPuF7nO23vRxQkuJ_V3WgouKA=/e.glbimg.com/og/ed/f/original/2014/06/10/461777879.jpg'}}
          style={{}}          
        />
        <View style={{alignItems: 'center', marginTop: -30}}>
          <Avatar.Icon 
            size={50} 
            icon='camera'                   
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

        <View style={styles.item}>
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
    height: Dimensions.get('window').height * 0.1,
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
