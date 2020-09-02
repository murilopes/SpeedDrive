import React, {useState} from 'react';
import { Button, Overlay } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RectButton } from 'react-native-gesture-handler';

const  AlunoAgendar = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }

  const [visible, setVisible] = useState(false);
  
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={-15} style={{height: 45, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Agendamento" />
      </Appbar.Header>

      <View style={styles.view_infos}>
        <View style={styles.item_status}>
          <Icon name='coins' size={30} color='white'/>
        </View>
        <View style={styles.item_detalhes}>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_title}>Aula Individual: </Text>
            <Text>50 reais</Text>
          </Text>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_title}>Pacote com 10 aulas: </Text>
            <Text >45 reais cada</Text>
          </Text>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_title}>Pacote com 15 aulas: </Text>
            <Text >40 reais cada</Text>
          </Text>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_suave}>O pagamento não é tratado via aplicativo</Text>
          </Text>
        </View>
      </View>

      <View style={styles.view_aulas}>
        <ScrollView>
          <Icon name='plus-circle' size={60} color='green' onPress={toggleOverlay}/>
          <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={styles.overlay_add}>
            <Text style={{textAlign: 'center', fontSize: 18}} >Aula</Text>
            <View style={styles.overlay_data}></View>
            <View style={styles.overlay_hora}></View>
            <View style={styles.overlay_button}>
              <Text style={{textAlign: 'center', fontSize: 25}}>Adicionar</Text>
            </View>
          </Overlay>
        </ScrollView>
      </View>

      <View style={styles.view_confirmar_button}>
        
      </View>

      
    </KeyboardAvoidingView>

);
}

export default AlunoAgendar;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40
  },

  overlay_add: {
    height: 300,
    width: 250,
    borderRadius: 8
  },

  overlay_data:{
    flex: 2,
  },
  overlay_hora:{
    flex: 2,
  },
  overlay_button:{
    flex: 1,
    backgroundColor: 'red',
    margin: -10,
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
    justifyContent: 'center'
  },

  view_infos: {
    flex: 4,
    margin: 10,
    marginBottom: 30,
    borderRadius: 8,
    borderColor: '#212F3C',
    borderWidth: 2,
    flexDirection: 'row',
  },

  view_aulas: {
    flex: 18,
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center'
  },

  view_confirmar_button: {
    flex: 3,
    backgroundColor: '#34CB79',
  },

  item_status:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_detalhes:{
    flex: 4,
  },

  item_text_line:{
    flex: 1,
    marginTop: 3,
    color: '#fff'
  },

  item_text_title:{
    flex: 1,
    fontWeight: 'bold'
  },

  item_text_suave:{
    flex: 1,
    color: '#999'
  },


})