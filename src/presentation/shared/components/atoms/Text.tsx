import React, { ReactNode } from 'react';
import {
  StyleSheet, Text as TextNative, TextStyle, StyleProp
} from 'react-native';
import { Colors, Fonts, Sizes } from '../../../context/theme';

export type TypographyTypes = 'header' | 'title' | 'subtitle' | 'paragraph' | 'caption';
export type TextAlignTypes = 'auto' | 'center' | 'left' | 'right';

export type FontFamilyTypes = '';
export type FontWeightTypes = 'light' | 'regular' | 'medium' | 'bold';

export interface TextProps {
  textAlign?: TextAlignTypes,
  textColor?: TextStyle['color'],
  typography?: TypographyTypes,

  fontWeight?: FontWeightTypes,
  fontFamily?: FontFamilyTypes,
  fontSize?: number,

  numberOfLines?: number,
  transform?: TextStyle['textTransform'],
  textDecorationLine?: TextStyle['textDecorationLine']
  textDecorationColor?: TextStyle['textDecorationColor']
  adjustsFontSizeToFit?: boolean,
  allowFontScaling?: boolean,
  text?: string,
  children?: ReactNode | string,
}

const Text: React.FC<TextProps> = ({
  text, typography, textColor, textAlign, fontWeight, adjustsFontSizeToFit,
  fontFamily, fontSize, numberOfLines, transform, children, allowFontScaling,
  textDecorationLine, textDecorationColor
}: TextProps) => {
  const textStyle: StyleProp<TextStyle> = [];
  switch (typography) {
    case 'header': textStyle.push(typographyStyle.header); break;
    case 'title': textStyle.push(typographyStyle.title); break;
    case 'subtitle': textStyle.push(typographyStyle.subtitle); break;
    case 'paragraph': textStyle.push(typographyStyle.paragraph); break;
    case 'caption': textStyle.push(typographyStyle.caption); break;
    default: break;
  }

  if (fontSize) textStyle.push({ fontSize });

  if (fontWeight || fontFamily) {
    let selectedWeight: FontWeightTypes = 'regular';

    // if (fontFamily) selectedFont = fontFamily;
    // else if (typography === 'paragraph' || typography === 'caption') selectedFont = 'roboto';

    if (fontWeight) selectedWeight = fontWeight;
    else {
      switch (typography) {
        case 'caption':
          selectedWeight = 'light';
          break;
        case 'header':
          selectedWeight = 'bold';
          break;
        case 'paragraph':
          selectedWeight = 'regular';
          break;
        case 'subtitle':
          selectedWeight = 'bold';
          break;
        case 'title':
          selectedWeight = 'regular';
          break;
        default: break;
      }
    }

    // textStyle.push({
    //   fontFamily: Fonts[selectedFont][selectedWeight]
    // });
  }

  return (
    <TextNative
      style={[
        textStyle,
        {
          color: textColor,
          textAlign,
          textTransform: transform,
          textDecorationLine,
          textDecorationColor, marginTop:-5
        }
      ]}
      adjustsFontSizeToFit={adjustsFontSizeToFit} 
      allowFontScaling={allowFontScaling}
      ellipsizeMode="tail"
      numberOfLines={numberOfLines}
    >
      {text || children}
      {/*       {text ? text.slice(0, 1024) : children} */}
    </TextNative>
  );
};

Text.defaultProps = {
  text: undefined,
  children: undefined,

  textAlign: 'auto',
  textColor: Colors.Black,
  typography: 'paragraph',

  fontWeight: undefined,
  fontFamily: undefined,
  fontSize: undefined,

  numberOfLines: undefined,
  transform: 'none',
  textDecorationLine: 'none',
  textDecorationColor: Colors.Black,

  adjustsFontSizeToFit: false,
  allowFontScaling: false
};

const typographyStyle = StyleSheet.create({
  header: {
    fontSize: Sizes.Heading,
    // fontFamily: Fonts.roboto.bold
  },
  title: {
    fontSize: Sizes.Title,
    // fontFamily: Fonts.roboto.bold
  },
  subtitle: {
    // fontFamily: Fonts.roboto.bold,
    fontSize: Sizes.Subtitle
  },
  paragraph: {
    fontSize: Sizes.Paragraph,
    // fontFamily: Fonts.roboto.regular
  },
  caption: {
    fontSize: Sizes.Caption,
    // fontFamily: Fonts.roboto.regular
  }
});

export { Text };
