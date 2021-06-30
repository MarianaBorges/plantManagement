import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Alert
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Button} from '../components/Button';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function UserIdentification() {

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [name, setName] = useState<string>();
  const navigation = useNavigation();

  async function handleSubmit(){
    if (!name)
      return Alert.alert('Me diz como chamar você ) ;');
    try {
      await AsyncStorage.setItem('@plantmanagement:user', name);
      navigation.navigate('Confirmation',{
        title:'Prontinho',
        subtitle:'Agora vamos começar a cuidar das suas plantinhas com muito cuidado',
        buttonTitle: "Começar",
        icon: 'smile',
        nextScreen: 'PlantSelect',
      });
    } catch (error) {
        Alert.alert('Não foi possivel salvar o seu número')
    }
  }

  function handleInputBlur(){
    setIsFocused(false);
    setIsFilled(!!name);
  }

  function handleInputFocus(){
    setIsFocused(true)
  }

  function handleInputChange(value:string){
    setIsFilled(!!value);
    setName(value);
  }

  return (
    <SafeAreaView style={styles.conteiner}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.conteiner}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height' }
        >
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.emoji}>
                  emoji
                </Text>
                <Text style={styles.title}>
                  Como podemos{'\n'} chamar você?
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  (isFocused || isFilled) && {borderColor: colors.green}
                ]}
                placeholder='Digite um nome'
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChangeText={handleInputChange}
                 />

              <View style={styles.footer}>
                <Button
                  title="Confirmar"
                  onPress={handleSubmit}
                 />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  conteiner:{
    flex:1,
    width: '100%',
    alignItems:'center',
    justifyContent: 'space-around',
  },
  content:{
    flex:1,
    width:'100%'
  },
  form:{
    flex:1,
    justifyContent:'center',
    paddingHorizontal: 54,
    alignItems: 'center',
  },
  header:{
    alignItems: 'center',
  },
  emoji:{
    fontSize: 44
  },
  input:{
    borderBottomWidth:1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center',
  },
  title:{
    fontSize:24,
    textAlign:'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight:32,
    marginTop:20,
  },
  footer:{
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20,
  }
})
