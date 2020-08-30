import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import Onboarding from 'react-native-onboarding-swiper';

const OnboardingX = () => {
  const navigation = useNavigation();
  const route = useRoute();

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToLogin() {
    navigation.navigate('Login');
  }

  return (
      <Onboarding
        nextLabel = 'Próximo'
        skipLabel = 'Pular'
        onDone = {handleNavigateToLogin}
        onSkip = {handleNavigateToLogin}
        pages={[
          {
            backgroundColor: '#FC515B', 
            image: (
              <Icon
                name="car"
                type="font-awesome"
                size={100}
                color="white"
              />
            ),
            title: 'Seja bem vindo!',
            subtitle: 'aqui inicia a sua jornada rumo a liberdade ;D',          
          },
          {
            backgroundColor: '#4AAFEE',
            image: (
              <Icon
                name="id-card-o"
                type="font-awesome"
                size={100}
                color="white"
              />
            ),
            title: 'Você já possui CNH',
            subtitle: 'okay.. mas ainda tem receio de dirigir?', 
          },
          {
            backgroundColor: '#C04DEE',
            image: (
              <Icon
                name="hand-peace-o"
                type="font-awesome"
                size={100}
                color="white"
              />
            ),
            title: 'Está no lugar certo!',
            subtitle: 'agende aulas com instrutores especializados e sinta-se mais seguro', 
          }           
        ]}
      />
  )
}

export default OnboardingX;