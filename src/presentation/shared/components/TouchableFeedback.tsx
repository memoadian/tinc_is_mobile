import React from "react";
import { Platform, StyleProp, TouchableNativeFeedback, TouchableOpacity, View, ViewStyle } from "react-native";

interface Props {
    contentStyle?: StyleProp<ViewStyle>;
    onPress?: () => void;
    children?: React.ReactNode
}

export const TouchableFeedback = ({ contentStyle, onPress, children }: Props) => {
    const android = () => (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('rgba(255, 255, 255, 0.1)', false)}
            onPress={onPress}
        >
            <View>{children}</View>
        </TouchableNativeFeedback>
    )

    const ios = () => (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            {children}
        </TouchableOpacity>
    )
    return (
        <View style={contentStyle} >
            {Platform.OS == 'android' ? android() : ios()}
        </View>);
};
