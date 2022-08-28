import React, { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react';
import { useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { TouchableFeedback } from './TouchableFeedback';

export interface TextFieldProps extends TextInputProps {
    contentStyle?: StyleProp<ViewStyle>;
    rightIcon?: React.ReactNode;
    disable?: boolean;
    onRightIcon?: () => void;
}

export interface TextFieldRefProps {
    isEnable: () => boolean;
    enable: () => void;
    disable: () => void;
}

export const TextField = forwardRef<TextFieldRefProps, TextFieldProps>(
    (props: TextFieldProps, ref: ForwardedRef<TextFieldRefProps>) => {
        const inputRef = useRef<TextInput>(null)
        const [disable, setDisable] = useState(props.disable)
        const {
            contentStyle,
            style,
            rightIcon,
            onRightIcon, } = props;

        useImperativeHandle(
            ref, () => ({
                isEnable: () => (disable) ? !disable : true,
                enable: () => {
                    inputRef?.current?.setNativeProps({ editable: true })
                    setDisable(false)
                },
                disable: () => {
                    inputRef?.current?.setNativeProps({ editable: false })
                    setDisable(true)
                },
            }));

        return (
            <View style={(!disable) ?
                [styles.contentDefault, contentStyle] :
                [styles.contentDefaultDisable, contentStyle]} >
                <TextInput
                    ref={inputRef}
                    style={(style) ? style : styles.input}
                    {...props}
                />
                <TouchableFeedback onPress={onRightIcon} contentStyle={{ marginEnd: 8 }}>
                    {rightIcon}
                </TouchableFeedback>
            </View >
        )
    })

const styles = StyleSheet.create({
    contentDefault: {
        marginHorizontal: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#827f87',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:30
    },
    contentDefaultDisable: {
        marginHorizontal: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#827f87',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEEEEE',
        height:30        
    },
    input: {
        color: '#0d0c0c',
        flex: 1,
        height: 50,
        padding: 0,
        fontSize:14
    }
});
