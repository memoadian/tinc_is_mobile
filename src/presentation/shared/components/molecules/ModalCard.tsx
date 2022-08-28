import React from 'react';
import {StyleSheet} from 'react-native';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
// import {Colors} from '@AppTheme';
import {Container, Modal, ModalProps} from '../atoms';

interface Props extends ModalProps {}

const ModalCard: React.FC<Props> = (props: Props) => {
  const {modalCenterCardStyle} = styles;
  const {visible, children, onDismiss} = props;

  return (
    <Modal visible={visible} onDismiss={onDismiss} avoidKeyboard>
      <Container flex middle style={{ top: '-40%' }}>
        <Container style={modalCenterCardStyle}>{children}</Container>
      </Container>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalCenterCardStyle: {
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    shadowOpacity: 1,
    shadowRadius: 2.62,
    backgroundColor: '#2B2B2B',
    color: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
    margin:5,
    paddingVertical:5
    
    
  },
});

export {ModalCard};
