import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Platform,
  StyleSheet, 
  View,
  Image,
} from 'react-native';
import { Appbar, Snackbar, Text } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RectButton } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

export default class uploadDocumento extends React.Component {
  constructor(props: any) {
    super(props);

    this.state = {
      nomeDocumento: props.route.params.nomeDocumento,
      imagemUri: '',
      imagemHeight: 300,
      imagemWidth:300,
      snackSalvarVisible: false,      
    };
    
  }  

  render(){

    const { navigation } = this.props;

    const _goBack = () => {
      navigation.goBack();
    };

    const onToggleSnackSalvar = () => this.setState({snackSalvarVisible: !this.state.snackSalvarVisible})

    const ipickImageFromLibrary = async () => {

      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Desculpa, precisamos de acesso ao rolo de foto para essa funcionalidade! \n Caso mude de ideia, altere via ajustes de configurações de suas aplicações');
        }
        else {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
          });
            
          if (!result.cancelled) {
            this.setState({imagemUri: result.uri})
            if (result.height > result.width) {
              this.setState({imagemHeight: 300, imagemWidth: 300 * result.width / result.height})
            } else {
              this.setState({imagemHeight: 300 * result.height / result.width, imagemWidth: 300})
            }
          }
        }
      }
    };

    const ipickImageFromCamera = async () => {

      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Desculpa, precisamos de acesso à câmera para essa funcionalidade! \n Caso mude de ideia, altere via ajustes de configurações de suas aplicações');
        }
        else {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
          });
            
          if (!result.cancelled) {
            this.setState({imagemUri: result.uri})
            if (result.height > result.width) {
              this.setState({imagemHeight: 300, imagemWidth: 300 * result.width / result.height})
            } else {
              this.setState({imagemHeight: 300 * result.height / result.width, imagemWidth: 300})
            }
          }
        }
      }
    };

    return (
      <KeyboardAwareScrollView
        style={styles.container_principal}
      >
        <Appbar.Header statusBarHeight={0} style={{ height: 45, backgroundColor: '#212F3C' }}>
          <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
          <Appbar.Content title={this.state.nomeDocumento}/>
        </Appbar.Header>

        <View style={styles.view_documento} >
          <Image
            style={{ height: this.state.imagemHeight, width: this.state.imagemWidth, borderColor: 'white', borderWidth: 0.5, }}
            source={{
              uri: this.state.imagemUri
            }}
          />
        </View>

        <View style={styles.buttonView}>
          <RectButton style={styles.button} onPress={ipickImageFromLibrary}>
            <Text style={styles.buttonText}>Escolher imagem do álbum</Text>
          </RectButton>
        </View>

        <View style={styles.buttonView}>
          <RectButton style={styles.button} onPress={ipickImageFromCamera}>
            <Text style={styles.buttonText}>Usar câmera</Text>
          </RectButton>
        </View>

        <View style={styles.buttonView}>
          <RectButton style={styles.button} onPress={onToggleSnackSalvar}>
            <Text style={styles.buttonTextBold}>Salvar</Text>
          </RectButton>
        </View>


        <View style={{marginTop: 50}} >
          <Snackbar 
            visible={this.state.snackSalvarVisible}
            onDismiss={onToggleSnackSalvar}
            action={{
              label: 'Ok',
              onPress: _goBack,
            }}>
            Dados salvos com sucesso!
          </Snackbar>
        </View>

      </KeyboardAwareScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },

  view_documento: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  
  buttonView: {
    marginTop: 15,
    alignItems: 'center'
  },

  button: {
    backgroundColor: '#0081DA',
    height: 45,
    width: '80%',
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

  buttonTextBold: {
    flex: 1,
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
});
