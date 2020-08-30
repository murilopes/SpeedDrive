import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppLoading } from 'expo';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import Routes from './routes';

export default function App() {
/*   const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold,
  }); */

/*   if (!fontsLoaded) {
    return <AppLoading />;
  } */

  return (
      <>
        <PaperProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <Routes />
        </PaperProvider>
      </>
  );
}