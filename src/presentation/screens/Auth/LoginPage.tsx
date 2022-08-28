import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Image, Input, Text} from '@rneui/themed';
import SplashScreen from 'react-native-splash-screen';
import LinearGradient from 'react-native-linear-gradient';
import {AppConstants} from '../../config/constants';
import {Logo} from '../../shared/components/Logo';
import {useForm} from '../../shared/hooks/useForm';
import {AuthContext} from '../../core/Context/AuthContext';
import Toast from 'react-native-toast-message';
import {TextInput} from 'react-native-paper';
import { useAlert } from '../../context';
import { ToastModule } from '../../shared/components/Toast';

interface Props extends StackScreenProps<any, any> {}

const {width: windowsWidth} = Dimensions.get('window');

export const Login = ({navigation}: Props) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const {login} = useContext(AuthContext);
  const Alert = useAlert();

  const termAndConditionsPage = async () => {
    const url = AppConstants.TEMRS_AND_CONDITIONS;
    await Linking.canOpenURL(url);
    Linking.openURL(url);
  };
  const PP = async () => {
    const url = AppConstants.PRIVACY_POLICY;
    await Linking.canOpenURL(url);
    Linking.openURL(url);
  };
  const showToast = (text1: string, type: string) => {
    Toast.show({
      type,
      text1,
    });
  };

  const showModal = (title: string, message: string) => {
    Alert.show({
      title,
      message
    })
    setTimeout(() => {
      Alert.hide();
    }, 5000);
  }

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const {email, password, onChange} = useForm({
    email: 'pruebastinc@gmail.com',
    password: 'TincISStage2019*',
  });

  const onLogin = async () => {
    if (email === '' || password === '') {
      return  ToastModule.show('error', 'Ingresa un usuario/contraseña');
    }
    const response: any = await login(email, password);
    if (response === undefined) {
      ToastModule.show('error', 'Usuario o contraseña incorrectos')
      //return showModal('Error', 'Usuario o contraseña incorrecto');
    }
    if (response.data.id_role === '4') {
      return  ToastModule.show(
        'error',
        'Usuario no habilitado para ingresar a la aplicacion',
      
      );
    }
    navigation.navigate('ChooseEnviroment');
  };

  return (
    <LinearGradient
      colors={['#0D419A', '#4596E7']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={styles.gradient}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Choose');
          }}
          style={{width: 60, marginLeft: 10, marginTop: 0}}>
          <Image
            style={{
              height: 60,
              width: 60,
            }}
            source={require('../../assets/img/arrow-left.png')}
          />
        </TouchableOpacity>
        <View>
          <Logo></Logo>
          <View style={[styles.margin]}>
            <View>
              <Text style={[styles.fontWhite]}>Tu usuario</Text>
            </View>
            <View>
              <TextInput
                style={[styles.input]}
                onChangeText={value => onChange(value, 'email')}
                value={email}
                placeholder="Usuario"
              />
            </View>
            <View>
              <Text style={[styles.fontWhite]}>Tu contraseña</Text>

              <TextInput
                style={[styles.input]}
                value={password}
                secureTextEntry={secureTextEntry}
                onChangeText={value => onChange(value, 'password')}
                right={
                  <TextInput.Icon
                    style={{marginTop: 25, size: 5}}
                    name="eye"
                    color="gray"
                    onPress={() => {
                      setSecureTextEntry(!secureTextEntry);
                      return false;
                    }}
                  />
                }
              />
               <Text
                style={[styles.fontWhite, styles.lostPassword]}
                onPress={() => navigation.navigate('Recovery')}>
                Olvidé mi contraseña
              </Text>
            </View>

           
          </View>
          <View style={{justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.buttonTouchableOpacity,
                  {marginTop: windowsWidth-170, marginVertical: 10, width: 250},
                ]}
                onPress={onLogin}>
                <Text style={styles.buttonText}>Ingresar</Text>
              </TouchableOpacity>
            </View>
          <View style={{marginHorizontal: 50}}>
            <Text style={[styles.tyc, styles.fontWhite]}>
              Al continuar, estas aceptando{' '}
              <Text
                style={[styles.lostPassword, styles.fontWhite]}
                onPress={PP}>
                la politica de privacidad
              </Text>
              ,{' '}
              <Text
                style={[styles.lostPassword, styles.fontWhite]}
                onPress={termAndConditionsPage}>
                terminos y condiciones
              </Text>{' '}
              de TINC CMMS
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  buttonTouchableOpacity: {
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#20BFC8',
    borderRadius: 5,
    shadowColor: '#000',
    height: 40,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },

  gradient: {
    width: '100%',
    height: '100%',
  },
  margin: {
    marginLeft: windowsWidth * 0.2,
    marginRight: windowsWidth * 0.025,
  },
  lostPassword: {
    textDecorationLine: 'underline',
    marginTop: 10,
    fontSize: 12,
  },

  fontWhite: {
    color: '#ffffff',
  },
  centerObjects: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 20,
    fontSize: 15,
    marginVertical: 1,
    borderBottomWidth: 0,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderColor: '#979797',
    width: '80%',
    color: 'black',
  },
  input2: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderColor: '#979797',
    width: '80%',
    fontSize: 15,
    color: 'black',
  },
  tyc: {
    fontSize: 10,
    textAlign: 'center',
  },
});
