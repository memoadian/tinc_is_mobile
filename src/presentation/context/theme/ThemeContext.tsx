import React, { createContext, useReducer } from "react";
import { themeReducer, TimTheme } from './ThemeReducer';

interface TimThemeProviderProps {
    themeDefault: TimTheme,
    children: JSX.Element | JSX.Element[]
}

interface TimThemeContextProps {
    theme: TimTheme;
    setTheme: (theme: TimTheme) => void;
}

export const TimThemeContext = createContext({} as TimThemeContextProps);

export const TimThemeProvider = ({ themeDefault, children }: TimThemeProviderProps) => {

    const [timTheme, dispatch] = useReducer(themeReducer, themeDefault);

    const setTheme = (theme: TimTheme) => {
        dispatch({ type: 'set_theme', payload: theme })
    }

    return (
        <TimThemeContext.Provider value={{
            theme: timTheme,
            setTheme
        }}>
            {children}
        </TimThemeContext.Provider>
    )
}