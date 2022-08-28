import React from 'react';
import {
  Container, Text, TextProps, Touchable
} from '../atoms';

export interface TextContainerProps extends TextProps {
  text: string,
  onPress?: () => void,
  flex?: boolean,
  marginBottom?: number,
  marginLeft?: number,
  marginRight?: number,
  marginTop?: number,
  marginHorizontal?: number
}

const TextContainer: React.FC<TextContainerProps> = (props: TextContainerProps) => {
  const {
    text, typography, textColor, textAlign, fontWeight,
    fontSize, fontFamily, numberOfLines, transform,
    marginBottom, marginLeft, marginRight, marginTop,
    marginHorizontal, onPress, allowFontScaling, adjustsFontSizeToFit,
    flex, textDecorationColor, textDecorationLine
  } = props;

  const marginStyle = marginHorizontal === undefined
    ? {
      marginLeft, marginRight, marginTop, marginBottom
    }
    : { marginHorizontal, marginTop, marginBottom };

  const TextRender = () => (
    <Container style={[marginStyle, flex && { flex: 1 }]}>
      <Text
        text={text}
        fontSize={fontSize}
        typography={typography}
        textColor={textColor}
        textAlign={textAlign}
        fontWeight={fontWeight}
        numberOfLines={numberOfLines}
        fontFamily={fontFamily}
        transform={transform}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        allowFontScaling={allowFontScaling}
        textDecorationColor={textDecorationColor}
        textDecorationLine={textDecorationLine}
      />
    </Container>
  );

  if (onPress) {
    return (
      <Touchable onPress={onPress}>
        <TextRender />
      </Touchable>
    );
  }

  return <TextRender />;
};

TextContainer.defaultProps = {
  flex: false,
  marginRight: 0,
  marginBottom: 0,
  marginTop: 0,
  marginLeft: 0,
  marginHorizontal: undefined,
  onPress: undefined
};

export { TextContainer };
