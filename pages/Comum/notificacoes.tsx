import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const  Notificacoes = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }

  const [icon, setIcon] = React.useState('envelope');
  const [titulo, setTitulo] = React.useState('Agendamento confirmado');
  const [mensagem, setMensagem] = React.useState('Sua aula do dia 01/10/2020 está confirmada com o instrutor Roberto da Silva');
  const [dias, setDias] = React.useState(15);


  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={-15} style={{height: 45, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Notificações" />
      </Appbar.Header>

      <ScrollView>        
        <View style={styles.view_items} >
          
          <View style={styles.item}>
            <View style={styles.item_status}>
              <Icon name={icon} size={30} />
            </View >
            <View style={styles.item_detalhes}>
              <View style={styles.item_titulo}>
                <>
                  <Text style={styles.item_text_title}>{titulo}</Text>
                </>
              </View>
              <View style={styles.item_mensagem}>
                <Text style={styles.item_text_mensagem}>{mensagem}</Text>
              </View>          
            </View>
            <View style={styles.item_info_dias}>
              <Text style={styles.item_text_dias}>{dias} dias</Text>
            </View >
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>

);
}

export default Notificacoes;

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
    height: 80,
    marginTop: 15,
  },

  item_status:{
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_detalhes:{
    flex: 12,
    justifyContent: 'center'
  },

  item_info_dias:{
    flex: 2,
    paddingRight: 3,
    alignItems: 'flex-end',
  },

  item_text_title:{
    fontWeight: 'bold'
  },

  item_text_mensagem:{
    fontSize: 12,
    color: '#334d4d'
  },

  item_text_dias:{
    fontSize: 12,
    color: '#0066cc'
  },

  item_titulo: {
    flex: 2,
    justifyContent: 'center'
  },

  item_mensagem: {
    flex: 4,
  },
})