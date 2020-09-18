import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet, View, KeyboardAvoidingView, Platform,  
} from 'react-native';
import { Appbar, TextInput, DefaultTheme, Chip, Text } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text'

/* 
ToDos:
- Botão Salvar
- Trazer dados reais/consistir
- Campos numéricos nao tem botão 'fechar' no teclado
- Quando está nos campos de baixo o teclado fica por cima
*/

const cadastroEndereco = () => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  const [nome, setNome] = React.useState('');
  const [sobrenome, setSobrenome] = React.useState('');
  const [genero, setGenero] = React.useState('');
  const [CPF, setCPF] = React.useState('');  
  const [whatsapp, setWhatsapp] = React.useState('');
  const [dataNascimento, setDataNascimento] = React.useState('');
  const [email, setEmail] = React.useState('');

  const [tamanhoFonteGenero, setTamanhoFonteGenero] = React.useState(0);
  const [genMascSelecionado, setGenMascSelecionado] = React.useState(false);
  const [genFemSelecionado, setGenFemSelecionado] = React.useState(false);
  const [genOutrosSelecionado, setGenOutrosSelecionado] = React.useState(false);
  const [colorGenMasc, setColorGenMasc] = React.useState('black');
  const [colorGenFem, setColorGenFem] = React.useState('black');
  const [colorGenOutros, setColorGenOutros] = React.useState('black');

  const handleSelecaoGenero = (genero: string) => {
    if(genero.includes('Masculino'))
    {
      //faz a selecao da cor antes pra nao sofrer o efeito async do useState
      if(genMascSelecionado == true){
        setColorGenMasc('black')
        setTamanhoFonteGenero(16)
      }else{
        setColorGenMasc('blue')
        setTamanhoFonteGenero(12)
      }      

      setGenMascSelecionado(!genMascSelecionado)      

      setGenFemSelecionado(false)
      setColorGenFem('black')

      setGenOutrosSelecionado(false)
      setColorGenOutros('black')
      
    }
    else if(genero.includes('Feminino'))
    {
      //faz a selecao da cor antes pra nao sofrer o efeito async do useState
      if(genFemSelecionado == true){
        setColorGenFem('black')
        setTamanhoFonteGenero(16)
      }else{
        setColorGenFem('blue')
        setTamanhoFonteGenero(12)
      }     

      setGenFemSelecionado(!genFemSelecionado)      

      setGenMascSelecionado(false)
      setColorGenMasc('black')
      
      setGenOutrosSelecionado(false)
      setColorGenOutros('black')      
    }
    else if(genero.includes('Outros'))
    { 
      //faz a selecao da cor antes pra nao sofrer o efeito async do useState
      if(genOutrosSelecionado == true){
        setColorGenOutros('black')
        setTamanhoFonteGenero(16)
      }else{
        setColorGenOutros('blue')
        setTamanhoFonteGenero(12)
      }    

      setGenOutrosSelecionado(!genOutrosSelecionado)

      setGenMascSelecionado(false)
      setColorGenMasc('black')

      setGenFemSelecionado(false)
      setColorGenFem('black')
    }
  }

  React.useEffect(() => {
    setTamanhoFonteGenero(16)
  }, [])

  const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#B70A0A',
      accent: '#212F3C',
      text: 'white',
      surface: 'white',
      background: 'black',
      placeholder: '#A79898',
    },
  };

  return (
    <KeyboardAvoidingView
      style={styles.container_principal}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Appbar.Header statusBarHeight={-15} style={{ height: 45, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Dados Pessoais" />
      </Appbar.Header>

      <TextInput theme={theme} label="Nome" value={nome} onChangeText={text => setNome(text)}/>
      <TextInput theme={theme} label="Sobrenome" value={sobrenome} onChangeText={text => setSobrenome(text)}/>
      <Text  style={{color: '#A79898', marginStart: 12, marginTop: 10, marginBottom: 10, fontSize: tamanhoFonteGenero}}>Gênero</Text>
      <View style={{flexDirection: 'row'}}>
        <Chip selected={genMascSelecionado} selectedColor={colorGenMasc} onPress={() => {handleSelecaoGenero('Masculino')}} style={{width: 110, marginStart: 10, marginEnd: 10}}>Masculino</Chip>
        <Chip selected={genFemSelecionado} selectedColor={colorGenFem} onPress={() => {handleSelecaoGenero('Feminino')}} style={{width: 100, marginEnd: 10}}>Feminino</Chip>
        <Chip selected={genOutrosSelecionado} selectedColor={colorGenOutros} onPress={() => {handleSelecaoGenero('Outros')}} style={{width: 100}}>Outros</Chip>
      </View> 
      <TextInput theme={theme} label="CPF" value={CPF}
        render={props =><TextInputMask
          {...props}
          type={'cpf'}
          value={CPF}
          onChangeText={text => setCPF(text)}
        />}
      />
      <TextInput theme={theme} label="WhatsApp/Celular" value={whatsapp}
        render={props =><TextInputMask
          {...props}
          type={'cel-phone'}
          options={{
            maskType: 'BRL',
            withDDD: true,
            dddMask: '(99) '
          }}
          value={whatsapp}
          onChangeText={text => setWhatsapp(text)}
        />}
      />
      <TextInput theme={theme} label="Data de Nascimento" value={dataNascimento}
        render={props =><TextInputMask
          {...props}
          type={'datetime'}
          options={{format: 'DD/MM/YYYY'}}
          value={dataNascimento}
          onChangeText={text => setDataNascimento(text)}
        />}
      />
      <TextInput theme={theme} label="Email" value={email} onChangeText={text => setEmail(text)}/>
      
    </KeyboardAvoidingView>
  );
};

export default cadastroEndereco;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },
  
});