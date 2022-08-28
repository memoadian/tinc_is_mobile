import { Theme } from "@react-navigation/native";
import { TextStyle, ViewStyle } from 'react-native';

type ThemeAction =
    | { type: 'set_theme', payload: TimTheme }

export interface SwitchStyle {
    trackColor: string;
    trackDisableColor: string;
    thumbColor: string;
}

export interface TimTheme extends Theme {
    currentTheme: 'ligth' | 'dark',
    disableButton: ViewStyle,
    disableTextButton: TextStyle,
    primaryButton: ViewStyle,
    primaryTextButton: TextStyle,
    secondaryButton: ViewStyle,
    secondaryTextButton: TextStyle,
    primaryRoundedButton: ViewStyle,
    secondaryRoundedButton: ViewStyle,
    primaryRoundedTextButton: TextStyle,
    secondaryRoundedTextButton: TextStyle,
    acceptButton: ViewStyle,
    acceptTextButton: TextStyle,
    cancelButton: ViewStyle,
    cancelTextButton: TextStyle    
};


export const themeReducer = (state: TimTheme, action: ThemeAction): TimTheme => {
    console.log(state)
    switch (action.type) {
        case 'set_theme':
            return { ...action.payload }
        default:
            return state
    }
}