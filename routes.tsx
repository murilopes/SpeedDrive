import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import AlunoDashboard from './pages/Aluno';
import AlunoRealizadas from './pages/Aluno/realizadas';
import AlunoProximas from './pages/Aluno/proximas';
import AlunoAgendar from './pages/Aluno/agendar';
import AlunoCadastro from './pages/Aluno/cadastro';
import CadastroDadosPessoais from './pages/Comum/cadastroDadosPessoais';
import AulaDetalheInstrutor from './pages/Aula/detalheInstrutor';


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
        <AppStack.Screen name="Onboarding" component={Onboarding} />
        <AppStack.Screen name="Login" component={Login} />
        <AppStack.Screen name="AlunoDashboard" component={AlunoDashboard} />
        <AppStack.Screen name="AlunoRealizadas" component={AlunoRealizadas} />
        <AppStack.Screen name="AlunoProximas" component={AlunoProximas} />
        <AppStack.Screen name="AlunoAgendar" component={AlunoAgendar} />
        <AppStack.Screen name="AlunoCadastro" component={AlunoCadastro} />
        <AppStack.Screen name="AulaDetalheInstrutor" component={AulaDetalheInstrutor} />
        <AppStack.Screen name="CadastroDadosPessoais" component={CadastroDadosPessoais} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;