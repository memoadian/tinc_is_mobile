import React, { useContext } from "react";
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { TimThemeContext } from "../../context/theme/ThemeContext";
import { TouchableFeedback } from "./TouchableFeedback";

interface TButtonProps {
    title: string;
    type: 'primary' | 'secondary' | 'primary_rounded' | 'secondary_rounded' | 'transparent' | 'accept' | 'cancel'
    onPress?: () => void;
    disable?: boolean;
    contentStyle?: ViewStyle;
    styleButton?: ViewStyle;
    styleText?: TextStyle;
}

export const TButton = ({
    title = 'Button',
    type = 'primary',
    onPress = () => { },
    disable = false,
    contentStyle,
    styleButton,
    styleText
}: TButtonProps) => {

    const { theme: { primaryButton,
        primaryTextButton,
        secondaryButton,
        secondaryTextButton,
        primaryRoundedButton,
        secondaryRoundedButton,
        primaryRoundedTextButton,
        secondaryRoundedTextButton,
        disableButton,
        disableTextButton,
        acceptButton,
        cancelButton,
        cancelTextButton,
        acceptTextButton
    } }
        = useContext(TimThemeContext);

    const getStyleBackground = (): ViewStyle => {
        switch (type) {
            case 'primary': return { ...primaryButton };
            case 'secondary': return { ...secondaryButton };
            case 'primary_rounded': return { ...primaryRoundedButton };
            case 'secondary_rounded': return { ...secondaryRoundedButton };
            case 'accept': return { ...acceptButton };
            case 'cancel': return { ...cancelButton };
            case 'transparent': return {}
        }
    }

    const getStyleText = (): TextStyle => {
        switch (type) {
            case 'primary': return { ...primaryTextButton, };
            case 'secondary': return { ...secondaryTextButton };
            case 'primary_rounded': return { ...primaryRoundedTextButton };
            case 'secondary_rounded': return { ...secondaryRoundedTextButton };
            case 'accept': return { ...acceptTextButton };
            case 'cancel': return { ...cancelTextButton };
            case 'transparent': return {}
        }
    }

    return (
        <TouchableFeedback
            contentStyle={contentStyle}
            onPress={() => {
                if (!disable) {
                    onPress()
                }
            }}
        >
            <View
                style={[
                    getStyleBackground(),
                    styleButton,
                    (disable) ? disableButton : undefined
                ]}
            >
                <Text
                    style={{
                        ...getStyleText(),
                        ...styleText,
                        ...((disable) ? disableTextButton : undefined)
                    }}>
                    {title}
                </Text>
            </View>
        </TouchableFeedback >
    )
};

