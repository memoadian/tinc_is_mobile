import React, { createContext, useReducer } from "react";
import { ticketFilterReducer, ticketFilterState, TicketFilterState } from "./TicketFilterReducer";

export interface TicketFilterContextProps {
    filterState: TicketFilterState;
    setSearch: (value: string | null) => void;
    setMyWork: (value: string | null) => void;
    setDate: (value: number[] | null) => void;
    setStatus: (value: string | null) => void;
    setPriority: (value: number[] | null) => void;
    setLocation: (value: string | null) => void;
    setRequestType: (value: number[] | null) => void;
    setQueryPath: (value: string | null) => void;
    cleanFilters: () => void;
}

export const TicketFilterContext = createContext({} as TicketFilterContextProps);

export const TicketFilterProvider = ({ children }: any) => {

    const [filterState, dispatch] = useReducer(ticketFilterReducer, ticketFilterState)

    const setMyWork = (value: string | null) => {
        dispatch({
            type: 'myWork',
            myWork: value,
        });
    };

    const setSearch = (value: string | null) => {
        dispatch({
            type: 'search',
            search: value,
        });
    };

    const setDate = (value: number | null) => {
        dispatch({
            type: 'date',
            date: value,
        });
    };

    const setStatus = (value: string | null) => {
        dispatch({
            type: 'status',
            status: value,
        });
    };

    const setPriority = (value: number[] | null) => {
        dispatch({
            type: 'priority',
            priority: value,
        });
    };

    const setLocation = (value: string | null) => {
        dispatch({
            type: 'location',
            location: value,
        });
    };

    const setRequestType = (value: number[] | null) => {
        dispatch({
            type: 'requestType',
            requestType: value,
        });
    };

    const cleanFilters = () => {
        dispatch({
            type: 'clean'
        })
    }

    const setQueryPath = (value: string | null) => {
        dispatch({
            type: 'queryPath',
            queryPath: value,
        });
    }

    return (
        <TicketFilterContext.Provider
            value={{
                filterState,
                setSearch,
                setMyWork,
                setDate,
                setStatus,
                setPriority,
                setLocation,
                setRequestType,
                cleanFilters,
                setQueryPath
            }}>
            {children}
        </TicketFilterContext.Provider>
    )
}