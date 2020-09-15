import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';


const  AlunoDashboard = () => {

  const navigation = useNavigation();

  const _goBack = () => console.log('Went back');
  const _handleSearch = () => console.log('Searching');
  const _handleMore = () => console.log('Shown more');

  const _handleAulasRealizadas = () => { 
    navigation.navigate('AlunoRealizadas');
  }
  const _handleProximasAulas = () => {
    navigation.navigate('AlunoProximas');
  }
  const _handleAgendar = () => {
    navigation.navigate('AlunoAgendar');
  }
  const _handleAlunoCadastro = () => {
    navigation.navigate('AlunoCadastro');
  }

  const [checked, setChecked] = React.useState(false);

  const[qtdProximasAulas, setQtdProximasAulas] = useState(2)

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={-15} style={{height: 45, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="menu" size={30} onPress={_handleMore} />
        <Appbar.Content title="Jonatas Vasconcellos" />
        <Appbar.Action icon="bell" size={30} onPress={_handleSearch} />
      </Appbar.Header>
      <View style={{alignItems: 'center'}}>
        <Avatar.Image 
          size={170} 
          source={{uri:'https://s2.glbimg.com/jsaPuF7nO23vRxQkuJ_V3WgouKA=/e.glbimg.com/og/ed/f/original/2014/06/10/461777879.jpg'}}
          style={{marginTop: 15, marginBottom: 15}}          
        />
      </View>
      
      <View style={styles.dash}>
        <View style={styles.dash_column}>
          <View style={styles.item_dash_exterior}>
            <View style={styles.item_dash_interior_1} onTouchEnd={_handleAulasRealizadas}>
              <View style={styles.item_dash_view_texto}>
                <Text style={styles.item_dash_texto_1}>Aulas</Text>
              </View>
              <View style={styles.item_dash_view_texto}>
                <Text style={styles.item_dash_texto_2}>Realizadas</Text>
              </View>
              <View style={styles.item_dash_view_numero}>
                <Text style={styles.item_dash_texto_3}>2</Text>
              </View>
            </View>
          </View>
          <View style={styles.item_dash_exterior}>
            <View style={styles.item_dash_interior_2} onTouchEnd={_handleAlunoCadastro}>
              <View style={styles.item_dash_view_texto}>
                <Text style={styles.item_dash_texto_1}>Cadastro</Text>
              </View>
              <View style={styles.item_dash_view_texto}>
                <Text style={styles.item_dash_texto_2}>Ok</Text>
              </View>
              <View style={styles.item_dash_view_numero}>
                <Image style={{width: 100, height: 100,}} 
                  source={{uri:'https://img.pngio.com/check-mark-scalable-vector-graphics-transparency-computer-icons-complete-png-512_512.png'}}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.dash_column}>
          <View style={styles.item_dash_exterior}>
            <View style={styles.item_dash_interior_3} onTouchEnd={_handleProximasAulas}>
              <View style={styles.item_dash_view_texto}>
                <Text style={styles.item_dash_texto_1}>Próximas</Text>
              </View>
              <View style={styles.item_dash_view_texto}>
                <Text style={styles.item_dash_texto_2}>Aulas</Text>
              </View>
              <View style={styles.item_dash_view_numero}>
                <Text style={styles.item_dash_texto_3}>{qtdProximasAulas}</Text>
              </View>
            </View>
          </View>
          <View style={styles.item_dash_exterior}>
            <View style={styles.item_dash_interior_4} onTouchEnd={_handleAgendar}>
              <View style={styles.item_dash_view_agendar}>
                <Text style={styles.item_dash_texto_agendar}>Agendar</Text>
              </View>
              <View style={styles.item_dash_view_numero}>
                <Image style={{width: 100, height: 100,}} 
                  source={{uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAAcElEQVRoge3XsQ2AIBBAUWQZ13EIxmII13Ea7Q3QmPPnkv9KiiM/NEcpkkTaIob2/bzfZ+06Qu6qEUP/ZADNAJoBNANoBtAMoKUPmK64o5WYslrF07+AAbT0Af6JaQbQDKAZQDOAZgDNAFr6AEnSJw9NMAxEv2Qz4wAAAABJRU5ErkJggg=='}}
                />
              </View>
            </View>
          </View>
        </View>
      </View>


    </KeyboardAvoidingView>

  );
}

export default AlunoDashboard;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40
  },

  dash:{
    flex: 1, 
    flexDirection: 'row'
  },

  dash_column:{
    flex: 1
  },

  item_dash_exterior: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },

  item_dash_interior_1: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#A3D6D4',
    paddingTop: 10,
    alignItems: 'center',
  },

  item_dash_interior_2: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#E2A9BE',
    paddingTop: 10,
    alignItems: 'center',
  },

  item_dash_interior_3: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#F1E9CB',
    paddingTop: 10,
    alignItems: 'center',
  },

  item_dash_interior_4: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#C2D5A7',
    paddingTop: 10,
    alignItems: 'center',
  },

  item_dash_view_texto:{
    flex: 1,
  },

  item_dash_view_agendar:{
    flex: 2,
  },

  item_dash_view_numero:{
    flex: 5, 
    justifyContent: 'center'
  },

  item_dash_texto_1:{
    fontWeight: 'bold',
    fontSize: 20
  },

  item_dash_texto_2:{
    fontSize: 25
  },

  item_dash_texto_3:{
    fontSize: 80,
    fontWeight: 'bold'
  },
  item_dash_texto_agendar:{
    fontSize: 35,
    fontWeight: 'bold'
  },

});