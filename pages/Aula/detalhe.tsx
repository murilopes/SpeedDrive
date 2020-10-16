import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';

const AulaDetalhe = () => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container_principal}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >

      <Appbar.Header statusBarHeight={0} style={{ height: 45, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Detalhe Aula" />
      </Appbar.Header>

      <View style={styles.view_principal}>
        <View style={styles.view_instrutor}>

          <View style={styles.view_intrutor_foto}>
            <Avatar.Image
              size={150}
              source={{ uri: 'https://img.ibxk.com.br/2019/02/17/17124052466014.jpg?w=704' }}
              style={{ marginTop: 15, marginBottom: 15 }}
            />
          </View>
          <View style={styles.view_intrutor_detalhe}>
            <View style={styles.view_instrutor_detalhe_interno}>
              <Text style={styles.instrutor_titulo}>Instrutor:</Text>
              <Text style={styles.instrutor_info_principal}>João Bonifácio</Text>
              <Text style={styles.instrutor_info_secundaria}>33 anos</Text>
              <Text style={styles.instrutor_info_secundaria}>Hyundai HB20</Text>
            </View>
          </View>
        </View>

        <View style={styles.view_items}>

          <View style={styles.item}>
            <View style={styles.item_interno}>
              <View style={styles.item_status}>
                <Icon name="calendar" size={20} />
              </View>
              <View style={styles.item_detalhes}>
                <View style={styles.item_text_superior}>
                  <Text style={styles.item_text_value}>23/06/2020</Text>
                </View>
                <View style={styles.item_text_inferior}>
                  <Text style={styles.item_text_title}>Data</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.item_interno}>
              <View style={styles.item_status}>
                <IconMaterial name="timer" size={20} />
              </View>
              <View style={styles.item_detalhes}>
                <View style={styles.item_text_superior}>
                  <Text style={styles.item_text_value}>19:00</Text>
                </View>
                <View style={styles.item_text_inferior}>
                  <Text style={styles.item_text_title}>Horário</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.item_interno}>
              <View style={styles.item_status}>
                <Icon name="rocket" size={20} />
              </View>
              <View style={styles.item_detalhes}>
                <View style={styles.item_text_superior}>
                  <Text style={styles.item_text_value}>Realizada</Text>
                </View>
                <View style={styles.item_text_inferior}>
                  <Text style={styles.item_text_title}>Status</Text>
                </View>
              </View>
            </View>
          </View>

        </View>

        <View style={styles.item_action}>
          {/* <RectButton style={styles.button} onPress={_handleAulaDetalheInstrutor}>
              <Text style={styles.buttonText}>Cancelar Aula</Text>
            </RectButton> */}
        </View>

      </View>
    </KeyboardAvoidingView>
  );
};

export default AulaDetalhe;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },
  view_principal: {
    flex: 1,
    alignItems: 'center',
  },

  view_instrutor: {
    flex: 3,
    flexDirection: 'row',
    width: '95%',
    marginTop: 15,
    alignItems: 'center',
  },

  view_intrutor_foto: {
    flex: 9,
    alignItems: 'center',
  },

  view_intrutor_detalhe: {
    flex: 11,
    justifyContent: 'center',
    marginLeft: 20,
  },

  view_instrutor_detalhe_interno: {
    height: '55%',
  },

  instrutor_titulo: {
    flex: 1,
    color: '#738396',
    fontSize: 20,
    fontWeight: 'bold',
  },

  instrutor_info_principal: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  instrutor_info_secundaria: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },

  view_items: {
    flex: 5,
    maxHeight: '40%',
    alignItems: 'center',
    width: '100%',
  },

  item: {
    flex: 1,
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
  },

  item_interno: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    height: '90%',
  },

  item_status: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  item_detalhes: {
    flex: 5,
  },

  item_text_superior: {
    flex: 1,
    paddingTop: 20,

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
    fontWeight: 'bold',
    fontSize: 16,
  },

  item_action: {
    flex: 3,
    width: '100%',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#0081DA',
    height: '30%',
    width: '50%',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginTop: '8%',
  },
});
