import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../../../context/theme';
import { AlertDataInterface } from '../../../context';
import { Container, Text, Touchable } from '../atoms';
import { ModalCard, TextContainer } from '../molecules';

interface AlertProps {
  visible: boolean,
  data: AlertDataInterface
}

const Alert: React.FC<AlertProps> = (props: AlertProps) => {
  const { visible, data } = props;
  const {
    title, message, onAccept, onCancel, onClose
  } = data;

  const { t } = useTranslation();

  return (
    <ModalCard visible={visible}>
      <Container>
        {onClose && (
          <Container style={{
            position: 'absolute', top: -12, right: -12, zIndex: 10
          }}
          >
            <Touchable onPress={onClose} style={{ padding: 4 }}>
              <Icon name="close" size={24} />
            </Touchable>
          </Container>
        )}
        {/* <Text typography="subtitle" text={title} textColor='white'/> */}
        <TextContainer text={message} marginTop={4} textColor='white' textAlign='center'/>
        {/* <Container row style={{ justifyContent: 'space-between', marginTop: 24 }}>
          <Container flex>
            {onCancel && (
              <Touchable onPress={onCancel}>
                <TextContainer
                  text='Cancelar'
                  textAlign="center"
                  fontWeight="bold"
                  textColor={Colors.Red}
                />
              </Touchable>
            )}
          </Container>
          <Container flex>
            <Touchable onPress={onAccept!}>
              <TextContainer
                text='Aceptar'
                textAlign={onCancel ? 'center' : 'right'}
                fontWeight="bold"
                textColor={Colors.Red}
              />
            </Touchable>
          </Container>
        </Container> */}
      </Container>
    </ModalCard>
  );
};

export { Alert };
