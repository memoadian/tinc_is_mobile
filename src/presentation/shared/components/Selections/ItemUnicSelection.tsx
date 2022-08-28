import React from 'react'
import { Text, View } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { TouchableFeedback } from '../TouchableFeedback';
import { ItemUnicSelectionProps } from './types';

const ItemUnicSelection = ({ title, checked, value, onPressed }: ItemUnicSelectionProps) => {
    return (
        <TouchableFeedback onPress={() => { onPressed?.(value, !checked) }} >
            <View style={{
                flexDirection: 'row',
                padding: 4,
            }}>
                <View style={{
                    width: '90%',
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        width: '100%',
                        color: '#000',
                        fontSize: 14,
                    }}> {title} </Text>
                </View>
                <View style={{
                    marginStart: 8,
                    width: '10%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <BouncyCheckbox
                        size={20}
                        fillColor='transparent'
                        isChecked={checked}
                        checkIconImageSource={require('../../../assets/img/checkbox_circle.png')}
                        iconStyle={{
                            borderWidth: 2,
                            borderColor: '#fc41a0',
                            borderRadius: 10,
                        }}
                        onPress={(isChecked: boolean) => { onPressed?.(value, isChecked) }}
                    />
                </View>
            </View>
        </TouchableFeedback>
    )
}

export default ItemUnicSelection;