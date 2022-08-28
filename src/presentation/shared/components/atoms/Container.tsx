import React, {ForwardedRef, forwardRef, ReactNode} from 'react';
import {View, StyleSheet, ViewStyle, StyleProp} from 'react-native';

type SpaceTypes = 'around' | 'between' | 'evenly';

export interface ContainerProps {
  row?: boolean;
  flex?: boolean | number;
  center?: boolean;
  middle?: boolean;
  space?: SpaceTypes;
  backgroundColor?: ViewStyle['backgroundColor'];
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

const Container = forwardRef((props: ContainerProps, ref: ForwardedRef<View>) => {
    const {
        row, flex, center, middle, space, backgroundColor, style, children
    } = props;

    const {blockStyle, rowStyle, centerStyle, middleStyle} = styles;

    let justifyContentSpace: ViewStyle['justifyContent'];

    if (space) {
      switch (space) {
        case 'around':
          justifyContentSpace = 'space-around';
          break;
        case 'between':
          justifyContentSpace = 'space-between';
          break;
        default:
          justifyContentSpace = 'space-evenly';
          break;
      }
    }

    const styleBlock: ViewStyle[] = [
      blockStyle,
      row ? rowStyle : {},
      flex ? {flex: flex === true ? 1 : flex} : {},
      center ? centerStyle : {},
      middle ? middleStyle : {},
      space ? {justifyContent: justifyContentSpace} : {},
      backgroundColor ? {backgroundColor} : {},,
    ];

    if (children) {
      return (
        <View ref={ref} style={[...styleBlock, style]}>
          {children}
        </View>
      );
    }

    return <View ref={ref} style={[...styleBlock, style]} />;
  },
);

Container.defaultProps = {
  row: false,
  flex: false,

  center: false,
  middle: false,
  space: undefined,
  backgroundColor: 'transparent',

  style: {},
  children: null,
};

const styles = StyleSheet.create({
  blockStyle: {
    flexDirection: 'column',
  },
  rowStyle: {
    flexDirection: 'row',
  },
  centerStyle: {
    alignItems: 'center',
  },
  middleStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export {Container};
