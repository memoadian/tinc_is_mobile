import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { HeaderCustomScreen } from '../../../shared/components/HeaderCustomScreen'
import { RootStackParams } from '../../../shared/navigation/MainNavigator'

export interface ScanQRProps
    extends StackScreenProps<RootStackParams, 'ScanQRScreen'> { }

export const ScanQRScreen = ({ navigation, route }: ScanQRProps) => {
    const onSucces = (event: BarCodeReadEvent) => {
        route.params.onReturn(event.data);
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.AndroidSafeArea} >
            <StatusBar
                barStyle='dark-content'
            />
            <HeaderCustomScreen
                showContinue={false}
                backgroundColor='#FFF'
                onBack={() => { navigation.goBack() }}
                title={' Escanea el código QR.'} />
            <QRCodeScanner
                onRead={(e) => { onSucces(e) }}
                flashMode={RNCamera.Constants.FlashMode.auto}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
});