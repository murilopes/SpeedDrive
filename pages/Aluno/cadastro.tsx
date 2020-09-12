import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions, Text, StyleSheet, View, KeyboardAvoidingView, Platform, 
} from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';

const AlunoCadastro = () => {
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

      <View style={styles.view_items}>

        <View style={styles.divider} />

        <View style={styles.item}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <IconEntypo name="progress-full" color='green' size={30} style={{flex: 1}} />
              <Text style={styles.item_text_status_preenchimento}>100%</Text>
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


        <View style={styles.item}>
          <View style={styles.item_interno}>
            <View style={styles.item_status}>
              <IconEntypo name="progress-one" color='yellow' size={30} style={{flex: 1}} />
              <Text style={styles.item_text_status_preenchimento}>20%</Text>
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
              <IconEntypo name="progress-empty" color='red' size={30} style={{flex: 1}} />
              <Text style={styles.item_text_status_preenchimento}>0%</Text>
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
    fontSize: 24,
    color: 'white'
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
