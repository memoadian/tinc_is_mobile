import React, { createContext, useEffect, useState } from 'react'
import { ApiCore } from '../../config/api';
import AuthService from '../auth/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MailingService from '../auth/MailingService';
import { useJwt } from "react-jwt";

type AuthContextProps = {
    activate: boolean;
    account: string;
    accountName: string;
    login: (email: string, password: string) => void;
    sigin: (email: string, password: string, full_name: string) => void;
    logout: () => void;
    setToken: (token: any) => Promise<void>;
    setAccountE: (acc: any) => Promise<void>;
    setAccountName: (name: string) => Promise<void>;
    getRol: () => Promise<string>;
    getAccountUser: () => Promise<string>;
    getEmail: (params: any) => Promise<void>;
    getListAccounts: () => Promise<void>;
    getName: () => Promise<void>;
    getCurrency: () => Promise<void>;
    getToken: (params: any) => Promise<void>;
    isAuthenticated: (params: any) => Promise<void>;
    isExpiredToken: () => void;
    forgetPassword: (email: string) => void;
    verify: (params: any) => Promise<void>;
    recaptchat: (params: any) => Promise<void>;
    errorHander: (params: any) => Promise<void>;
    errorHanderVerify: (params: any) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

    const { decodedToken, isExpired, reEvaluateToken } = useJwt('');
    const [activate, setActivate] = useState(false);
    const [account, setAccount] = useState('');
    const [accountName, setAccountNameState] = useState('');

    useEffect(() => {
        isExpiredToken();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const resp = await AuthService.post(ApiCore.LOGIN, { email: email, password: password });
            await AsyncStorage.setItem('token', resp.data.token);
            await AsyncStorage.setItem('data', JSON.stringify(resp.data));
            return resp.data
        } catch (error) {
            console.error(error);
        }
    }
    const forgetPassword = async (email: string) => {
        try {
            const resp = MailingService.post(ApiCore.FORGET_PASSWORD, { email: email });
            resp.then(
                (response: any) => {
                    return response
                });
            return resp;
        } catch (error) {
            console.error(error);
        }
    }
    const sigin = async (email: string, password: string, full_name: string) => {
        const resp = AuthService.get(ApiCore.SIGNIN).then(
            (response: any) => {
                return response
            })
    }
    const logout = async () => {
        AsyncStorage.removeItem('token');
        setActivate(false);
    }
    const setToken = async (params: Array<any>) => {
        const resp = AuthService.get(ApiCore.LOGIN).then(
            (response: any) => {
                return response
            })
    }
    const setAccountE = async (acc: any) => {
        setAccount(acc);
        AsyncStorage.setItem('account', acc);
    }
    const setAccountName = async (name: string) => {
        setAccountNameState(name);
        AsyncStorage.setItem('accountName', name);
    }
    const getEmail = async (params: Array<any>) => {
        const resp = AuthService.get(ApiCore.LOGIN).then(
            (response: any) => {
                return response
            })
    }
    const getName = async () => {
        try {
            let data: any = await AsyncStorage.getItem('data');
            let response = JSON.parse(data);
            return response.data.full_name;
        } catch (error) {

        }
    }
    const getCurrency = async () => {
         try {
            let data: any = await AsyncStorage.getItem('data');
            let response = JSON.parse(data);
            return response.data.currency_name;
        } catch (error) {
        } 
    }
    
    const getRol = async () => {
        try {
            let data: any = await AsyncStorage.getItem('data');
           
            let response = JSON.parse(data);
            return response.data.id_role
        } catch (error) {
            return "0"
        }
    }

    const getAccountUser = async () => {
        try {
            let data: any = await AsyncStorage.getItem('data');
           
            let response = JSON.parse(data);
            return response.data.id_user
        } catch (error) {
            return "0"
        }
    }


    const getListAccounts = async () => {
        try {
            let data: any = await AsyncStorage.getItem('data');
            let response = JSON.parse(data);
            return response.data.corporate_accounts;
        } catch (error) {

        }
    }
    const getToken = async (params: Array<any>) => {
        const resp = AuthService.get(ApiCore.LOGIN).then(
            (response: any) => {
                return response
            })
    }
    const isAuthenticated = async (params: Array<any>) => {
        const resp = AuthService.get(ApiCore.LOGIN).then(
            (response: any) => {
                return response
            })
    }

    const isExpiredToken = async () => {
        const token: any = await AsyncStorage.getItem('token').then((response) => {
            return response;
        })
        if (token === null || token === '') {
            setActivate(false);
            return
        };
        await reEvaluateToken(token);
        setActivate(isExpired)
    }
    const verify = async (params: Array<any>) => {
        const resp = AuthService.get(ApiCore.LOGIN).then(
            (response: any) => {
                return response
            })
    }
    const recaptchat = async (params: Array<any>) => {
        const resp = AuthService.get(ApiCore.LOGIN).then(
            (response: any) => {
                return response
            })
    }
    const errorHander = async (params: Array<any>) => {
        const resp = AuthService.get(ApiCore.LOGIN).then(
            (response: any) => {
                return response
            })
    }
    const errorHanderVerify = async (params: Array<any>) => {
        const resp = AuthService.get(ApiCore.LOGIN).then(
            (response: any) => {
                return response
            })
    }

    return (
        <AuthContext.Provider value={{
            activate,
            account,
            accountName,
            login,
            sigin,
            logout,
            setToken,
            setAccountE,
            setAccountName,
            getRol,
            getAccountUser,
            getEmail,
            getListAccounts,
            getName,
            getCurrency,
            getToken,
            isAuthenticated,
            isExpiredToken,
            forgetPassword,
            verify,
            recaptchat,
            errorHander,
            errorHanderVerify
        }}>
            {children}
        </AuthContext.Provider>
    )
}

