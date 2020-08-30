import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RectButton } from 'react-native-gesture-handler';

const  AlunoRealizadas = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }
  const _handleAulaDetalheInstrutor = () => {
    navigation.navigate('AulaDetalheInstrutor');
  }

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={-15} style={{height: 45, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Aulas Realizadas" />
      </Appbar.Header>

      <ScrollView>        
        <View style={styles.view_items} >
          
          <View style={styles.item}>
            <View style={styles.item_status}>
              <Icon name='circle' size={20} color='#0081DA'/>
            </View >
            <View style={styles.item_detalhes}>
              <Text style={styles.item_text_line}>
                <Text style={styles.item_text_title}>Status: </Text>
                <Text>Realizada</Text>
              </Text>
              <Text style={styles.item_text_line}>
                <Text style={styles.item_text_title}>Data: </Text>
                <Text >23/06/2020</Text>
              </Text>
              <Text style={styles.item_text_line}>
                <Text style={styles.item_text_title}>Horário: </Text>
                <Text >19:00</Text>
              </Text>
              <Text style={styles.item_text_line}>
                <Text style={styles.item_text_title}>Instrutor: </Text>
                <Text >João Bonifácio</Text>
              </Text>
            </View>
            <View style={styles.item_action}>
              <RectButton style={styles.button} onPress={_handleAulaDetalheInstrutor}>
                <Text style={styles.buttonText}>Detalhe</Text>
              </RectButton>
            </View >
          </View>

          <View style={styles.item}>
            <View style={styles.item_status}>
              <Icon name='circle' size={20} color='#0081DA'/>
            </View >
            <View style={styles.item_detalhes}>
              <Text style={styles.item_text_line}>
                <Text style={styles.item_text_title}>Status: </Text>
                <Text>Realizada</Text>
              </Text>
              <Text style={styles.item_text_line}>
                <Text style={styles.item_text_title}>Data: </Text>
                <Text >24/06/2020</Text>
              </Text>
              <Text style={styles.item_text_line}>
                <Text style={styles.item_text_title}>Horário: </Text>
                <Text >20:00</Text>
              </Text>
              <Text style={styles.item_text_line}>
                <Text style={styles.item_text_title}>Instrutor: </Text>
                <Text >João Bonifácio</Text>
              </Text>
            </View>
            <View style={styles.item_action}>
              <RectButton style={styles.button} onPress={_handleAulaDetalheInstrutor}>
                <Text style={styles.buttonText}>Detalhe</Text>
              </RectButton>
            </View >
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>

  );
}

export default AlunoRealizadas;

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
  },

  item_status:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_detalhes:{
    flex: 4,
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
    fontWeight: 'bold'
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