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

const cadastroDadosPessoais = () => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };



  return (
    <KeyboardAvoidingView
      style={styles.container_principal}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Appbar.Header statusBarHeight={-15} style={{ height: 45, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Cadastro" />
      </Appbar.Header>


    </KeyboardAvoidingView>
  );
};

export default cadastroDadosPessoais;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },
  
});
