import React, { ReactNode } from 'react';
import { Modal } from '../atoms';
import { ModalCard } from '../molecules';

interface AlertProps {
  visible: boolean,
  fullScreen: boolean,
  children: ReactNode
}

const CustomAlert: React.FC<AlertProps> = (props: AlertProps) => {
  const { visible, fullScreen, children } = props;

  if (fullScreen) {
    return (
      <Modal visible={visible} native>
        {children}
      </Modal>
    );
  }

  return (
    <ModalCard visible={visible}>
      {children}
    </ModalCard>
  );
};

export { CustomAlert };
