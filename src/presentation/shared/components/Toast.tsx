
import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import Toast, { ToastConfig } from 'react-native-toast-message';

const show = (
    type: 'success' | 'error',
    message: string,
    position: 'top' | 'bottom' = 'top',
    onPress?: () => void) => {
    Toast.show({
        type: 'tincToast',
        text1: message,
        position: position,
        props: {
            onPress: onPress
        }
    });
}

const toastConfig: ToastConfig = {
    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
    tincToast: ({ text1, props }) => (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={{
                width: '95%',
                marginTop: 16,
                paddingVertical: 8,
                backgroundColor: '#202020',
                display:'flex',
                justifyContent:'center',
                alignContent:'center',
                alignItems: 'center',
                alignSelf:'center',
                borderRadius: 10,
               
            }}>
                <Text style={{
                    flex: 1,
                    color: '#FFFFFF',
                    fontWeight: '400'                   
                }}>{text1}</Text> 
                {props.onPress && <Text style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                }}>
                    Ver
                </Text>}
            </View>
        </TouchableWithoutFeedback>
    )   
};

export const ToastModule = {
    show,
    toastConfig
}