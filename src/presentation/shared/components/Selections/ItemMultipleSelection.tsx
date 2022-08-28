import React from 'react'
import { Text, View } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { ItemMultipleSelectionProps } from './types';

const ItemMultipleSelection = ({ title, checked, value, onPressed }: ItemMultipleSelectionProps) => {
    return (
        <View style={{
            flexDirection: 'row',
            padding: 4,
        }}>
            <View style={{
                marginStart: 8,
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <BouncyCheckbox
                    fillColor='#fc41a0'
                    unfillColor="#FFFFFF"
                    iconStyle={{
                        borderColor: '#fc41a0',
                        borderRadius: 2,
                        borderWidth: 2
                    }}
                    size={20}
                    isChecked={checked}
                    onPress={(isChecked: boolean) => { onPressed(value, !checked) }}
                />
            </View>
            <View style={{
                width: '90%',
                justifyContent: 'center',
                paddingEnd: 16
            }}>
                <Text style={{
                    width: '100%',
                    color: '#000',
                    fontSize: 14,
                }}> {title} </Text>
            </View>
        </View>
    )
}

export default ItemMultipleSelection;