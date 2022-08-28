import { PixelRatio, Dimensions } from 'react-native';

const ratio = PixelRatio.get();

const normalize = (size: number): number => {
  const { width, height } = Dimensions.get('window');

  if (ratio >= 2 && ratio < 3) {
    if (width < 360) {
      return size * 0.95;
    }
    if (height < 667) {
      return size;
    }
    if (height >= 667 && height <= 735) {
      return size * 1.15;
    }

    return size * 1.25;
  }

  if (ratio >= 3 && ratio < 3.5) {
    if (width < 360) {
      return size;
    }
    if (height < 667) {
      return size * 1.15;
    }
    if (height >= 667 && height <= 735) {
      return size * 1.2;
    }

    return size * 1.27;
  }

  if (ratio >= 3.5) {
    if (width < 360) {
      return size;
    }
    if (height < 667) {
      return size * 1.2;
    }
    if (height >= 667 && height <= 735) {
      return size * 1.25;
    }

    return size * 1.4;
  }

  return size;
};

const Sizes = {
  Heading: normalize(24),
  Title: normalize(18),
  Subtitle: normalize(16),
  Paragraph: normalize(12),
  Caption: normalize(11),

  Button: 16,

  Margin: 32,
  HalfMargin: 16,

  BorderRadius: 16,
  BorderRadiusView: 24
};

export default Sizes;
