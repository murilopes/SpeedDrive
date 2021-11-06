import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserAuthData = async() => {
    try {
        const value = await AsyncStorage.getItem('UserAuthData')
        if (value !== null) {
            return value
        } else {
          return undefined
        }
    } catch (e) {
        console.log('Ocorreu erro ao recuperar dado guardado no async storage')
    }
}

export const storeUserAuthData = async (value: string) => {
  try {
    await AsyncStorage.setItem('UserAuthData', value)
  } catch (e) {
    console.log('Ocorreu erro ao armazenar dados do usuario no AsyncStorage')
  }
}

export const removeUserAuthData = async () => {
  try {
    await AsyncStorage.removeItem('UserAuthData')
  } catch (e) {
    console.log('Ocorreu erro ao armazenar dados do usuario no AsyncStorage')
  }
}