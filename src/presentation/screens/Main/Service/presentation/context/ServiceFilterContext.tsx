import React, { createContext, useReducer } from "react";
import { ticketFilterReducer, ticketFilterState, ServiceFilterState } from "./ServiceFilterReducer";

export interface ServiceFilterContextProps {
    filterState: ServiceFilterState;
    setSearch: (value: string | null) => void;
    setMyWork: (value: string | null) => void;
    setDate: (value: number[] | null) => void;
    setStatus: (value: number[] | null) => void;
    setPriority: (value: number[] | null) => void;
    setLocation: (value: string | null) => void;
    setRequestType: (value: number[] | null) => void;
    setQueryPath: (value: string | null) => void;
    cleanFilters: () => void;
}

export const ServiceFilterContext = createContext({} as ServiceFilterContextProps);

export const ServiceFilterProvider = ({ children }: any) => {

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

    const setDate = (value: number[] | null) => {
        dispatch({
            type: 'date',
            date: value,
        });
    };

    const setStatus = (value: number[] | null) => {
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
        <ServiceFilterContext.Provider
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
        </ServiceFilterContext.Provider>
    )
}