import { StackScreenProps } from '@react-navigation/stack';
import { Card } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Linking, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import SplashScreen from 'react-native-splash-screen';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConstants } from '../../config/constants';
import { LoadingComponent } from '../../shared/components/LoadingComponent';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../core/Context/AuthContext';
import { useAlert } from '../../context';
import { ToastModule } from '../../shared/components/Toast';

const { width: windowsWidth } = Dimensions.get('window');
interface Props extends StackScreenProps<any, any> { };

export const ChooseEnviroment = ({ navigation }: Props) => {
    const { isExpiredToken, setAccountE, setAccountName } = useContext(AuthContext)
    const Alert = useAlert();

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
          // onAccept: () => { Alert.hide() }
        })
        setTimeout(() => {
          Alert.hide();
        }, 5000);
      };

    const TC = async () => {
        const url = AppConstants.TEMRS_AND_CONDITIONS;
        await Linking.canOpenURL(url);
        Linking.openURL(url);
    };
    const PP = async () => {
        const url = AppConstants.PRIVACY_POLICY;
        await Linking.canOpenURL(url);
        Linking.openURL(url);
    };
    //[{ label: 'Hospital TINC', value: 'Hospital TINC' }]
    const [items, setItems]: any = useState([{ label: '', value: '' }]);
    const [company, setCompany]: any = useState();
    const [loading, setLoading] = useState(false);
    const [coorporateImage, setImage]: any = useState(false);
    const [welcomeText, setWelcomeText]: any = useState(false);
    var list: any;
    //  var coorporateImage: any;

    useEffect(() => {
        SplashScreen.hide();
        AsyncStorage.getItem('data').then((token: any) => {
            list = JSON.parse(token);
            setImage(list.data.corporate_image)
            setWelcomeText(list.data.corporate_name)
            onEndGetData(list.data.corporate_accounts);
        })
    }, []);
    const onEndGetData = (payload: any) => {
        setItems(payload.map((item: any) => ({ label: item.is_account_main_name, value: item.is_account_main_id })));
    };
    const goHome = async () => {
        if (company === undefined || company === null) {
            setLoading(false);
            return ToastModule.show('error', 'Selecciona una cuenta corporativa')
        }
        await isExpiredToken();
        setLoading(false);
    }
    const setEnviroment = () => {
        let item = items.filter((item => item.value === company))
        if (item.length > 0) {
            setAccountName(item[0].label)
        }
        setAccountE(company);
        setLoading(true);
        goHome();
    }

    if (loading) {
        return <LoadingComponent />
    }

    return (
        <LinearGradient colors={['#0D419A', '#4596E7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
            <SafeAreaView>
                <View style={[styles.title_general, styles.item, { marginTop: 200, }]}>
                    <Image
                        source={{ uri: coorporateImage }}
                        style={styles.image}
                    />
                    <View>
                        <Text style={[styles.textTitle, styles.fontWhite]}>{welcomeText}</Text>
                    </View>

                    <Text style={[styles.fontWhite, styles.text_Center2]}>Para ingresar, selecciona una cuenta del corporativo</Text>
                    <Card containerStyle={[styles.card]}>
                        <View>
                            <Text style={{ fontSize: 14 }}>Cuenta</Text>
                            <RNPickerSelect
                                placeholder={{
                                    label: 'Selecciona una cuenta',
                                    value: null,
                                }}

                                onValueChange={(value) => {
                                    setCompany(value);
                                }}
                                items={items}
                                style={customPickerStyles}
                            //placeholder='Selecciona corporativo'
                            />
                        </View>
                    </Card>

                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 0
                }}>

                    <View>
                        <TouchableOpacity activeOpacity={.7} style={[styles.buttonTouchableOpacity, { marginTop: 230, width: 250 }]} onPress={() => { setEnviroment(); }}>
                            <Text style={styles.buttonText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>


                    <Text style={[styles.tyc, styles.fontWhite, { width: 300, marginTop: 15 }]}>Al continuar, estas aceptando <Text style={[styles.lostPassword, styles.fontWhite]} onPress={PP}>la politica de privacidad</Text>,  <Text style={[styles.lostPassword, styles.fontWhite]} onPress={TC}>terminos y condiciones</Text> de TINC CMMS</Text>

                </View>
                <View style={[styles.margin, { alignContent: 'center', justifyContent: 'center' }]}>


                </View>

            </SafeAreaView>
        </LinearGradient>
    )
}

const customPickerStyles = StyleSheet.create({
    inputIOS: {
        color: 'white',
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        textDecorationLine: 'underline'
        // backgroundColor: 'blue',
    },
    inputAndroid: {
        //color: 'red',
        fontWeight: 'bold',
        height: 100,
        textDecorationLine: 'underline line-through',
        borderStyle: 'solid',

        //  backgroundColor: 'blue',
    },
    underline: { borderBottomWidth: 1, borderColor: 'red' },


    icon: {
        position: 'absolute',
        backgroundColor: 'red',
        borderTopWidth: 5,
        borderTopColor: '#00000099',
        borderRightWidth: 5,
        borderRightColor: 'transparent',
        borderLeftWidth: 5,
        borderLeftColor: 'transparent',
        width: 0,
        height: 0,
        top: 20,
        right: 15,
    },
});

const styles = StyleSheet.create({
    gradient: {
        width: '100%',
        height: '100%',
    },
    text_Center2: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    card: {
        width: '85%',
        borderRadius: 5,
        marginHorizontal: 0,
        paddingBottom: 0
    },
    margin: {
        marginLeft: windowsWidth * 0.15,
        marginRight: windowsWidth * 0.020
    },
    lostPassword: {
        textDecorationLine: 'underline',
    },

    fontWhite: {
        color: '#ffffff'
    },
    input: {
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        borderColor: '#979797',
        height: 20,
        fontSize: 15,
        marginVertical: 1,
        borderBottomWidth: 0,
        width: '80%',
        color: 'black'
    },
    tyc: {
        fontSize: 10,
        textAlign: 'center'
    },
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
    title_general: {
        marginBottom: 0,
        fontSize: 50

    },
    text_Center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 25
    },
    item: {
        width: '100%',
        height: 200,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',

    },
    textTitle: {
        fontSize: 20,
        marginTop: 15,
        fontWeight: 'bold'
    },


})