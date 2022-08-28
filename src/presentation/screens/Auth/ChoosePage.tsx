
import { StackScreenProps } from '@react-navigation/stack';
import { Image, Button, Text } from '@rneui/themed'
import React, { useEffect } from 'react'
import { Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import { Logo } from '../../shared/components/Logo';
interface Props extends StackScreenProps<any, any> { };


export const ChoosePage = ({ navigation }: Props) => {
    const { width: windowsWidth } = Dimensions.get('window');
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <LinearGradient colors={['#0D419A', '#4596E7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
            <SafeAreaView>
                <Logo></Logo>
                <View style={[styles.text_Center2]}>
                    <Text style={styles.fontWhite}>Selecciona tu entorno de trabajo</Text>
                </View>
                
                <View style={styles.centerObjects}>

                    <TouchableOpacity activeOpacity={.7} style={[styles.buttonTouchableOpacity, { width: 300, marginBottom: 30, marginTop:30 }]} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.buttonText}>TINC CMMS IS</Text>
                    </TouchableOpacity>


                </View>

                <View style={styles.centerObjects}>

                    <TouchableOpacity activeOpacity={.7} style={[styles.buttonTouchableOpacity, { width: 300 }]}>
                        <Text style={styles.buttonText}>TINC CMMS ES</Text>
                    </TouchableOpacity>


                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}
const styles = StyleSheet.create({
    gradient: {
        width: '100%',
        height: '100%',
    },
    text_Center2: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 80,
        marginTop:5

    },
    centerObjects: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    fontWhite: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold'
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
        elevation: 6,
    },

});