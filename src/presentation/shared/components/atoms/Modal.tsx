import React, {ReactNode} from 'react';
import {StyleSheet, View, Modal as ModalRN} from 'react-native';
import ModalNative, {SupportedAnimation} from 'react-native-modal';

export interface ModalProps {
  visible: boolean;
  children: ReactNode;
  onDismiss?: () => void;
  animationIn?: SupportedAnimation;
  animationOut?: SupportedAnimation;
  avoidKeyboard?: boolean;
  native?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  animationIn,
  animationOut,
  children,
  onDismiss,
  avoidKeyboard,
  native,
}: ModalProps) => {
  if (native) {
    return (
      <ModalRN
        visible={visible}
        style={{margin: 0}}
        onDismiss={onDismiss}
        animationType="fade">
        <View style={styles.modalContainer}>{children}</View>
      </ModalRN>
    );
  }

  return (
    <ModalNative
      isVisible={visible}
      style={{margin: 0}}
      onDismiss={onDismiss}
      animationIn={animationIn}
      animationOut={animationOut}
      avoidKeyboard={avoidKeyboard}>
      <View style={styles.modalContainer}>{children}</View>
    </ModalNative>
  );
};

Modal.defaultProps = {
  onDismiss: () => {},
  animationIn: 'slideInUp',
  animationOut: 'slideOutDown',
  avoidKeyboard: false,
  native: false,
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
});

export {Modal};
