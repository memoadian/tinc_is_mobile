import { ListItem, Text } from '@rneui/themed';
import React from 'react'
import { ScrollView, StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { PresentantionModal } from './Selections';

export interface OptionMenu {
    text: string;
    onPressed: () => void;
    textSytle?: StyleProp<TextStyle>;
}

export interface Props {
    isVisible: boolean;
    options: OptionMenu[];
    onCancelPressed: () => void;
    onOutsidePressed: () => void;
}

export const MenuAlert = ({
    isVisible,
    options,
    onCancelPressed,
    onOutsidePressed
}: Props) => {
    return (
        <PresentantionModal
            isVisible={isVisible}
            onOutsidePressed={onOutsidePressed}>
            <View style={styles.modal}>
                <ScrollView>
                    {options.map((item: OptionMenu, index) => (
                        <ListItem
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            key={index}
                            onPress={() => {
                                item.onPressed()
                            }}>
                            <Text style={[item.textSytle, { alignSelf: 'center' }]}>
                                {item.text}
                            </Text>
                        </ListItem>
                    ))}
                    <ListItem key={options.length}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={onCancelPressed}
                    >
                        <Text style={{
                            color: 'red',
                            alignSelf: 'center'
                        }}>
                            Cancelar
                        </Text>
                    </ListItem>
                </ScrollView>
            </View>
        </PresentantionModal >
    )
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#FFFFFF',
        width: 300,
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.25,
        elevation: 4,
        borderRadius: 8,
        padding: 4,
    }
})