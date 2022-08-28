import React from 'react';

import { Container, TextContainer, Touchable } from '../../components';
import { Colors } from '../../../context/theme';

interface ConfirmButtonsProps {
  onAcceptText?: string
  onPressAccept: () => void
  onCancelText?: string
  onPressCancel?: () => void
}

const ConfirmButtons: React.FC<ConfirmButtonsProps> = (props: ConfirmButtonsProps) => {
  const {
    onAcceptText, onPressAccept, onCancelText, onPressCancel
  } = props;

  return (
    <Container row style={{ justifyContent: 'space-between' }}>
      {onPressCancel && (
        <Container flex>
          <Touchable onPress={onPressCancel}>
            <TextContainer
              text={onCancelText!}
              textAlign="center"
              fontWeight="bold"
              textColor={Colors.Red}
            />
          </Touchable>
        </Container>
      )}
      <Container flex>
        <Touchable onPress={onPressAccept}>
          <TextContainer
            text={onAcceptText!}
            textAlign="center"
            fontWeight="bold"
            textColor={Colors.Red}
          />
        </Touchable>
      </Container>
    </Container>
  );
};

ConfirmButtons.defaultProps = {
  onAcceptText: 'Aceptar',
  onCancelText: 'Cancelar',
  onPressCancel: undefined
};

export { ConfirmButtons };
