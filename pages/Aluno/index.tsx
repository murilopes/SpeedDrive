import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import MenuDrawer from 'react-native-side-drawer'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEntypo from 'react-native-vector-icons/Entypo';

const AlunoDashboard = (props: any) => {
  
  const navigation = useNavigation();
  
  const _handleSair = () => { 
    navigation.navigate('Login');
  }
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
  const [menuOpened, setMenuOpened] = React.useState(false);

  const[qtdProximasAulas, setQtdProximasAulas] = useState(2)

  const toggleOpen = () => {
    setMenuOpened(!menuOpened);
  };

  const drawerContent = () => {
    return (
      <TouchableOpacity onPress={() => setMenuOpened(false)} style={styles.animatedMenuBox}>
        <View style={{height: 70, flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.menu_text_voltar}>Fechar Menu</Text>
        </View>

        <View style={styles.menu_item} onTouchEnd={_handleAlunoCadastro}>
          <View style={styles.menu_item_interno}>
            <View style={styles.menu_item_icon}>
              <Icon name='cogs' color='white' size={20} style={{flex: 1}} />
            </View>
            <View style={styles.menu_item_view_descricao}>
              <View style={styles.menu_item_view_text_descricao}>
                <Text style={styles.menu_item_text_value}>Cadastro</Text>
              </View>            
            </View>
            <View style={styles.menu_item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={20} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.menu_item} onTouchEnd={_handleAulasRealizadas}>
          <View style={styles.menu_item_interno}>
            <View style={styles.menu_item_icon}>
              <Icon name='check-circle' color='white' size={20} style={{flex: 1}} />
            </View>
            <View style={styles.menu_item_view_descricao}>
              <View style={styles.menu_item_view_text_descricao}>
                <Text style={styles.menu_item_text_value}>Aulas Realizadas</Text>
              </View>            
            </View>
            <View style={styles.menu_item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={20} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.menu_item} onTouchEnd={_handleProximasAulas}>
          <View style={styles.menu_item_interno}>
            <View style={styles.menu_item_icon}>
              <Icon name='exclamation-circle' color='white' size={20} style={{flex: 1}} />
            </View>
            <View style={styles.menu_item_view_descricao}>
              <View style={styles.menu_item_view_text_descricao}>
                <Text style={styles.menu_item_text_value}>Próximas Aulas</Text>
              </View>            
            </View>
            <View style={styles.menu_item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={20} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.menu_item} onTouchEnd={_handleAgendar}>
          <View style={styles.menu_item_interno}>
            <View style={styles.menu_item_icon}>
              <Icon name='car' color='white' size={20} style={{flex: 1}} />
            </View>
            <View style={styles.menu_item_view_descricao}>
              <View style={styles.menu_item_view_text_descricao}>
                <Text style={styles.menu_item_text_value}>Agendar Nova</Text>
              </View>            
            </View>
            <View style={styles.menu_item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={20} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.menu_item} onTouchEnd={() => {}}>
          <View style={styles.menu_item_interno}>
            <View style={styles.menu_item_icon}>
              <Icon name='envelope' color='white' size={20} style={{flex: 1}} />
            </View>
            <View style={styles.menu_item_view_descricao}>
              <View style={styles.menu_item_view_text_descricao}>
                <Text style={styles.menu_item_text_value}>Mensagens</Text>
              </View>            
            </View>
            <View style={styles.menu_item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={20} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.menu_item} onTouchEnd={() => {}}>
          <View style={styles.menu_item_interno}>
            <View style={styles.menu_item_icon}>
              <Icon name='comments' color='white' size={20} style={{flex: 1}} />
            </View>
            <View style={styles.menu_item_view_descricao}>
              <View style={styles.menu_item_view_text_descricao}>
                <Text style={styles.menu_item_text_value}>Contato</Text>
              </View>            
            </View>
            <View style={styles.menu_item_seta}>
              <IconEntypo name="chevron-thin-right" color='#A79898' size={20} style={{flex: 1}} />
            </View>
          </View>
        </View>

        <View style={styles.menu_item_sair} onTouchEnd={_handleSair}>
          <View style={styles.menu_item_interno}>
            <View style={styles.menu_item_icon}>
              <Icon name='arrow-circle-left' color='white' size={20} style={{flex: 1}} />
            </View>
            <View style={styles.menu_item_sair_view}>
              <View style={styles.menu_item_view_text_descricao}>
                <Text style={styles.menu_item_text_value}>Sair da conta</Text>
              </View>            
            </View>
          </View>
        </View>
        
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <MenuDrawer 
          open={menuOpened} 
          drawerContent={drawerContent()}
          drawerPercentage={65}
          animationTime={400}
          overlay={false}
          opacity={0.2}
        >

      <Appbar.Header statusBarHeight={15} style={{height: 45, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="menu" size={30} onPress={() => setMenuOpened(true)} />
        <Appbar.Content title="Jonatas Vasconcellos" />
        <Appbar.Action icon="bell" size={30} onPress={() => {}} />
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

      </MenuDrawer>

    </KeyboardAvoidingView>

  );
}

export default AlunoDashboard;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
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

  animatedMenuBox: {
    flex: 1,
    backgroundColor: "#47476b",
    padding: 15
  },

  menu_text_voltar: {
    flex: 1,
    color: '#A79898',
    fontSize: 22,
  },

  menu_item: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menu_item_sair: {
    marginTop: 20,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menu_item_interno: {
    flex: 1,
    flexDirection: 'row',
   /*  backgroundColor: '#F1F1F1', */
    height: '90%',
  },

  menu_item_icon: {
    flex: 1,
    paddingTop: 15,
    alignItems: 'center',
  },

  menu_item_view_descricao: {
    flex: 5,
    paddingTop: 15,
    paddingLeft: 15,
  },

  menu_item_sair_view: {
    flex: 6,
    paddingTop: 15,
    paddingLeft: 15,
  },

  menu_item_view_text_descricao: {
    flex: 1,
  },
  
  menu_item_text_value: {
    flex: 1,
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold'
  },

  menu_item_seta: {
    flex: 1,
    paddingTop: 16,
    alignItems: 'center',
  },

});