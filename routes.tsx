import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './pages/Login/splashScreen';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import AlunoDashboard from './pages/Aluno';
import AlunoRealizadas from './pages/Aluno/realizadas';
import AlunoProximas from './pages/Aluno/proximas';
import AlunoAgendar from './pages/Aluno/agendar';
import AlunoCadastro from './pages/Aluno/cadastro';
import CadastroDadosPessoais from './pages/Comum/cadastroDadosPessoais';
import CadastroEndereco from './pages/Comum/cadastroEndereco';
import CadastroDocumentosAluno from './pages/Aluno/cadastroDocumentos';
import AulaDetalheInstrutor from './pages/Aula/detalhe';
import UploadDocumento from './pages/Comum/uploadDocumento';
import Notificacoes from './pages/Comum/notificacoes';

const AppStack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: 'white',
          },
        }}
      >
        <AppStack.Screen name="SplashScreen" component={SplashScreen} />
        <AppStack.Screen name="Onboarding" component={Onboarding} />
        <AppStack.Screen name="Login" component={Login} />
        <AppStack.Screen name="AlunoDashboard" component={AlunoDashboard} />
        <AppStack.Screen name="AlunoRealizadas" component={AlunoRealizadas} />
        <AppStack.Screen name="AlunoProximas" component={AlunoProximas} />
        <AppStack.Screen name="AlunoAgendar" component={AlunoAgendar} />
        <AppStack.Screen name="AlunoCadastro" component={AlunoCadastro} />
        <AppStack.Screen name="CadastroDadosPessoais" component={CadastroDadosPessoais} />
        <AppStack.Screen name="CadastroEndereco" component={CadastroEndereco} />
        <AppStack.Screen name="CadastroDocumentosAluno" component={CadastroDocumentosAluno} />
        <AppStack.Screen name="AulaDetalheInstrutor" component={AulaDetalheInstrutor} />
        <AppStack.Screen name="UploadDocumento" component={UploadDocumento} />
        <AppStack.Screen name="Notificacoes" component={Notificacoes} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;