import React, { useContext } from 'react'
import { StyleSheet, View, TextInput, Dimensions, TouchableOpacity,TouchableHighlight } from 'react-native';
import { Button, Image } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from '@rneui/base';
import { AppConstants } from '../../config/constants';
import { StackScreenProps } from '@react-navigation/stack';
import { useForm } from '../../shared/hooks/useForm';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../core/Context/AuthContext';
import { useAlert } from '../../context';
import { Container } from '../../shared/components';
import { ToastModule } from '../../shared/components/Toast';
interface Props extends StackScreenProps<any, any> { };

const { width: windowsWidth } = Dimensions.get('window');

export const RecoveryPassword = ({ navigation }: Props) => {
  const Alert = useAlert();

  const { email, onChange } = useForm({
    email: ''
  });

  const { forgetPassword } = useContext(AuthContext)

  const sendEmail = async () => {
    if (email === '') return ToastModule.show('error', 'Ingresa un correo')
    
    // if (email === '') { return showToast('Ingresa un correo', 'error') }
    const response: any = await forgetPassword(email);
    if (response === undefined) return ToastModule.show('error', 'No se logro enviar el correo')
    ToastModule.show('success','Recibirás un correo con la liga de restablecimiento');
    navigation.navigate("Login");
  }

  const showModal = (title: string, message: string) => {
    Alert.show({
      title,
      message
      // onAccept: () => { Alert.hide() }
    })
    setTimeout(() => {
      Alert.hide();
    }, 5000);
  };
  
  const showToast = (text1: string, type: string) => {
    Toast.show({
      type,
      text1,
    });
  };

  return (
    <LinearGradient colors={['#0D419A', '#4f97df']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
      <View>
      <TouchableOpacity onPress={() => {navigation.navigate("Login");}} style={{width:60,marginLeft:10,marginTop:0}}>
        <Image
          style={{
              height: 60,
              width: 60,
              
          }}
          source={require('../../assets/img/arrow-left.png')}/>
      </TouchableOpacity>
        
     
        <View style={[styles.item]}>
       
          <Image
            source={{ uri: AppConstants.DEFAULT_IMAGE }}
            containerStyle={styles.image}
          />
        </View>
        <View style={styles.margin}>
          <View >
            <Text style={[styles.fontWhite, styles.textTitle]}>Restablecer contraseña</Text>
          </View>
          <View style={{width:300, alignContent:'flex-start'}} >
            <Text style={[styles.fontWhite, { marginBottom: 5, }]}>Tu correo</Text>
          </View>
          <View>
            <TextInput style={[styles.input, { width: 300 }]} onChangeText={(value) => onChange(value, 'email')}
              placeholder='correousuario@gmail.com' />
          </View>         
          <TouchableOpacity activeOpacity={.7} style={[styles.buttonTouchableOpacity, { marginTop: 10, marginVertical: 10, width: 300 }]} onPress={sendEmail}>
            <Text style={styles.buttonText}>Restablecer contraseña</Text>
          </TouchableOpacity>


        </View>
      </View>
      <View>

      </View>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: 'bold'
  },

  buttonTouchableOpacity: {
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#20BFC8',
    borderRadius: 5,
    shadowColor: "#000",
    height: 40,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },

  textTitle: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 10

  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderColor: '#979797',
    width: '100%',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 25
  },
  item: {
    width: '100%',
    height: 100,
    marginBottom:100,
    justifyContent: 'center',
    alignItems: 'center',

  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  margin: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  fontWhite: {
    color: '#ffffff'
  },
  imageArrow: {
    width: 100,
    height: 100,
},
})

