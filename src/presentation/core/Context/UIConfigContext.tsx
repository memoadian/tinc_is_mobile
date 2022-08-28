import React, { createContext, useReducer } from "react";
import { UIConfig, uiConfigReducer } from "./UIConfigReducer";

interface UIConfigProviderProps {
    uiConfigDefault: UIConfig,
    children?: JSX.Element | JSX.Element[]
}

interface UIConfigContextProps {
    uiConfig: UIConfig;
    setShowBtnAccount: (show: boolean) => void;
}

export const UIConfigContext = createContext({} as UIConfigContextProps);

export const UIConfigProvier = ( {uiConfigDefault, children}: UIConfigProviderProps) => {

    const [uiConfig, dispatch] = useReducer(uiConfigReducer, uiConfigDefault);

    const setShowBtnAccount = (show: boolean) => {
        dispatch({ type: 'setBtnAccount', payload: show})
    }

    return (
        <UIConfigContext.Provider value={{
            uiConfig,
            setShowBtnAccount
        }}>
            {children}
        </UIConfigContext.Provider>
    )
}