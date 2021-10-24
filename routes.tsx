import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './pages/Login/splashScreen';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import AlunoDashboard from './pages/Aluno';
import InstrutorDashboard from './pages/Instrutor';
import AdminDashboard from './pages/Admin';
import AlunoRealizadas from './pages/Aluno/realizadas';
import InstrutorRealizadas from './pages/Instrutor/realizadas';
import AlunoProximas from './pages/Aluno/proximas';
import InstrutorProximas from './pages/Instrutor/proximas';
import InstrutorPendentes from './pages/Instrutor/pendentes';
import AlunoAgendar from './pages/Aluno/agendar';
import AlunoCadastro from './pages/Aluno/cadastro';
import InstrutorCadastro from './pages/Instrutor/cadastro';
import CadastroDadosPessoais from './pages/Comum/cadastroDadosPessoais';
import CadastroEndereco from './pages/Comum/cadastroEndereco';
import CadastroVeiculoInstrutor from './pages/Instrutor/cadastroVeiculo';
import CadastroDocumentosAluno from './pages/Aluno/cadastroDocumentos';
import CadastroDocumentosInstrutor from './pages/Instrutor/cadastroDocumentos';
import AulaDetalheInstrutor from './pages/Aluno/aulaDetalhe';
import AulaDetalheAluno from './pages/Instrutor/aulaDetalhe';
import AulaAprovacaoInstrutor from './pages/Instrutor/aulaAprovacao';
import InstrutorDisponibilidades from './pages/Instrutor/disponibilidades';
import UploadDocumento from './pages/Comum/uploadDocumento';
import Notificacoes from './pages/Comum/notificacoes';
import AdminConfiguracoes from './pages/Admin/configuracoes';
import ListaAlunos from './pages/Admin/listaAlunos';

const AppStack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        initialRouteName="SplashScreen"
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: 'black',
            
          },
        }}
      >
        <AppStack.Screen name="SplashScreen" component={SplashScreen} />
        <AppStack.Screen name="Onboarding" component={Onboarding} />
        <AppStack.Screen name="Login" component={Login} />
        <AppStack.Screen name="AlunoDashboard" component={AlunoDashboard} />
        <AppStack.Screen name="InstrutorDashboard" component={InstrutorDashboard} />
        <AppStack.Screen name="AdminDashboard" component={AdminDashboard} />        
        <AppStack.Screen name="AdminConfiguracoes" component={AdminConfiguracoes} />
        <AppStack.Screen name="ListaAlunos" component={ListaAlunos} />
        <AppStack.Screen name="AlunoRealizadas" component={AlunoRealizadas} />
        <AppStack.Screen name="InstrutorRealizadas" component={InstrutorRealizadas} />
        <AppStack.Screen name="AlunoProximas" component={AlunoProximas} />
        <AppStack.Screen name="InstrutorProximas" component={InstrutorProximas} />
        <AppStack.Screen name="InstrutorPendentes" component={InstrutorPendentes} />
        <AppStack.Screen name="AlunoAgendar" component={AlunoAgendar} />
        <AppStack.Screen name="AlunoCadastro" component={AlunoCadastro} />
        <AppStack.Screen name="InstrutorCadastro" component={InstrutorCadastro} />
        <AppStack.Screen name="CadastroDadosPessoais" component={CadastroDadosPessoais} />
        <AppStack.Screen name="CadastroEndereco" component={CadastroEndereco} />
        <AppStack.Screen name="CadastroVeiculoInstrutor" component={CadastroVeiculoInstrutor} />
        <AppStack.Screen name="CadastroDocumentosAluno" component={CadastroDocumentosAluno} />
        <AppStack.Screen name="CadastroDocumentosInstrutor" component={CadastroDocumentosInstrutor} />
        <AppStack.Screen name="AulaDetalheInstrutor" component={AulaDetalheInstrutor} />
        <AppStack.Screen name="AulaDetalheAluno" component={AulaDetalheAluno} />
        <AppStack.Screen name="AulaAprovacaoInstrutor" component={AulaAprovacaoInstrutor} />
        <AppStack.Screen name="InstrutorDisponibilidades" component={InstrutorDisponibilidades} />
        <AppStack.Screen name="UploadDocumento" component={UploadDocumento} />
        <AppStack.Screen name="Notificacoes" component={Notificacoes} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;