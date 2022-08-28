import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useForm } from '../hooks/useForm';
import { PresentantionModal } from './Selections';
import { TButton } from './TButton';
import { TextField } from './TextField';

export interface AlertInputProps {
    isVisible?: boolean;
    title?: string;
    message?: string;
    placeholder?: string;
    onCancelPressed?: () => void;
    onOutsidePressed?: () => void;
    onAcceptPressed?: (input: string) => void;
}

export const AlertInput = ({
    isVisible,
    title,
    message,
    placeholder,
    onCancelPressed,
    onOutsidePressed,
    onAcceptPressed
}: AlertInputProps) => {

    const { width } = Dimensions.get('window')

    const { value, onChange } = useForm({
        value: ''
    });

    return (
        <PresentantionModal
            isVisible={isVisible ? isVisible : false}
            onOutsidePressed={(onOutsidePressed) ? onOutsidePressed : () => { }}
        >
            <View style={{
                ...styles.modal,
                width: width - 32,
                padding: 8
            }}>
                <Text style={{
                    color: '#000',
                    fontSize: 16,
                    fontWeight: '600',
                    margin: 8
                }}>{title}</Text>
                <Text style={{
                    color: '#000',
                    fontSize: 14,
                    marginHorizontal: 8
                }}>{message}</Text>
                <View>
                    <Text style={styles.titleInput}>{placeholder}</Text>
                    <TextField
                        placeholder={placeholder}
                        multiline={false}
                        autoCapitalize='none'
                        value={value}
                        onChangeText={(text) => {
                            onChange(text, 'value')
                        }}
                        keyboardType='ascii-capable'
                    />
                </View>
                <View style={{
                    flexDirection: 'row-reverse',
                }}>
                    <TButton
                        title='Terminar'
                        type='transparent'
                        onPress={() => {
                            if (onAcceptPressed) {
                                onAcceptPressed(value)
                                onChange('', 'value')
                            }
                        }}
                        styleText={{
                            color: '#2961BE'
                        }}
                        contentStyle={{
                            marginVertical: 8,
                            marginHorizontal: 8
                        }} />
                    <TButton
                        title='Cancelar'
                        type='transparent'
                        onPress={onCancelPressed}
                        styleText={{
                            color: '#BE2929'
                        }}
                        contentStyle={{
                            marginVertical: 8,
                            marginHorizontal: 8
                        }} />
                </View>
            </View>
        </PresentantionModal>
    )
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#FFFFFF',
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.25,
        elevation: 4,
        borderRadius: 8
    },
    titleInput: {
        marginHorizontal: 10,
        marginTop: 8,
        fontSize: 12
    },
    input: {
        height: 50,
        borderBottomWidth: 1,
    },
})