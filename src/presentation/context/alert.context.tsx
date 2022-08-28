import React, { ReactNode, useState } from 'react';
import { Alert, CustomAlert } from '../../presentation/shared/components';

export interface AlertDataInterface {
  title: string,
  message: string,
  onAccept?: () => void,
  onCancel?: () => void,
  onClose?: () => void
}

export interface AlertInterface {
  visible: boolean,
  data: AlertDataInterface
}

export interface CustomAlertInterface {
  visible: boolean,
  fullScreen: boolean,
  children: ReactNode
}

interface Props {
  children: ReactNode
}

const alertInitialState: AlertInterface = {
  visible: false,
  data: { message: '', title: '' }
};

const customAlertInitialState: CustomAlertInterface = {
  visible: false,
  fullScreen: false,
  children: null
};

export const AlertContextProvider = ({ children }: Props) => {
  const [alertState, setAlertState] = useState<AlertInterface>(alertInitialState);
  const [customAlertState, setCustomAlertState] = useState<CustomAlertInterface>(customAlertInitialState);

  const show = (data: AlertDataInterface) => {
    setTimeout(() => {
      setAlertState({
        visible: true,
        data: {
          title: data.title,
          message: data.message,
          onAccept: data.onAccept || hide,
          onCancel: data.onCancel,
          onClose: data.onClose
        }
      });
    }, 350);
  };

  const hide = () => setAlertState(alertInitialState);

  const showCustom = (customChildren: ReactNode, fullScreen: boolean = false) => {
    setTimeout(() => {
      setCustomAlertState({
        visible: true,
        fullScreen,
        children: customChildren
      });
    }, 350);
  };

  const hideCustom = () => setCustomAlertState(customAlertInitialState);

  return (
    <>
      <AlertContext.Provider value={{
        show, hide, showCustom, hideCustom
      }}
      >
        {children}
      </AlertContext.Provider>
      <Alert
        visible={alertState.visible}
        data={alertState.data}
      />
      <CustomAlert
        visible={customAlertState.visible}
        fullScreen={customAlertState.fullScreen}
      >
        {customAlertState.children}
      </CustomAlert>
    </>
  );
};

interface AlertContextInterface {
  show: (data: AlertDataInterface) => void,
  hide: () => void,
  showCustom: (children: ReactNode, fullScreen?: boolean,) => void,
  hideCustom: () => void
}

export const AlertContext = React.createContext<AlertContextInterface>({} as AlertContextInterface);

export const useAlert = () => React.useContext(AlertContext);
