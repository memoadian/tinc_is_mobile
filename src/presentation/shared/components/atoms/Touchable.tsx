import React, { ReactNode } from 'react';
import {
  Platform, StyleProp, Pressable, View, ViewStyle
} from 'react-native';
import { Colors } from '../../../context/theme';

import Ripple from 'react-native-material-ripple';

export interface TouchableProps {
  onPress?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  disabled?: boolean,
  rounded?: boolean,
  ripple?: boolean,
  flex?: boolean | number,
  style?: StyleProp<ViewStyle>
  children: ReactNode
}

const Touchable: React.FC<TouchableProps> = (props: TouchableProps) => {
  const {
    children, onPress, disabled, rounded, flex, ripple, style, onPressIn, onPressOut
  } = props;

  if (Platform.OS === 'android' && ripple) {
    return (
      <Ripple
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        rippleColor={Colors.White}
        rippleOpacity={0.7}
        rippleContainerBorderRadius={rounded ? 1000 : 0}
        rippleDuration={600}
        style={[{ flex: typeof flex === 'boolean' && flex ? 1 : flex || 0 }, style]}
      >
        <View style={{ backgroundColor: 'transparent' }}>
          {children}
        </View>
      </Ripple>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={[{ flex: typeof flex === 'boolean' && flex ? 1 : flex || 0, zIndex: 2 }, style]}
    >
      <View pointerEvents="none">
        {children}
      </View>
    </Pressable>
  );
};

Touchable.defaultProps = {
  disabled: false,
  rounded: false,
  flex: false,
  ripple: true,
  style: undefined,
  onPress: undefined,
  onPressIn: undefined,
  onPressOut: undefined
};

export { Touchable };
