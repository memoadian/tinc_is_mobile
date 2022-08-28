import React, {createContext, useReducer} from "react";
import {UpdatedState, updatedWhenChangeReducer} from "./UpdatedWhenChangeReducer";

interface UpdatedWhenChangeProviderProps {
    stateDefault: UpdatedState,
    children: JSX.Element | JSX.Element[]
}

interface UpdatedWhenChangeContextProps {
    value: UpdatedState;
    updatePrincipal: (value: number) => void;
    updateTickets: (value: number) => void;
    updateService: (value: number) => void;
    updateServiceTabExpenses: (value: number) => void;
}

export const UpdatedWhenChangeContext = createContext({} as UpdatedWhenChangeContextProps);

export const UpdatedWhenChangeProvider = ({stateDefault, children}: UpdatedWhenChangeProviderProps) => {

    const [value, dispatch] = useReducer(updatedWhenChangeReducer, stateDefault);

    const updatePrincipal = (value: number) => {
        dispatch({type: 'updatePrincipal', payload: value})
    }

    const updateTickets = (value: number) => {
        dispatch({type: 'updateTickets', payload: value})
    }

    const updateService = (value: number) => {
        dispatch({type: 'updateService', payload: value})
    }
    const updateServiceTabExpenses = (value: number) => {
        dispatch({type: 'updateServiceTabExpenses', payload: value})
    }

    return (
        <UpdatedWhenChangeContext.Provider value={{
            value,
            updatePrincipal,
            updateTickets,
            updateService,
            updateServiceTabExpenses,
        }}>
            {children}
        </UpdatedWhenChangeContext.Provider>
    )
}