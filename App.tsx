import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StackNavigator} from './src/presentation/shared/navigation/StackNavigator';
import {AuthProvider} from './src/presentation/core/Context/AuthContext';
import Toast from 'react-native-toast-message';
import {ApiProvider} from './src/presentation/core/Context/ApiContext';
import {TimThemeProvider} from './src/presentation/context/theme/ThemeContext';
import lightTheme from './src/presentation/context/theme/ligthTheme';
import {AlertContextProvider} from './src/presentation/context';
import {ToastModule} from './src/presentation/shared/components/Toast';
import {UpdatedState} from "./src/presentation/context/updateWhenChange/UpdatedWhenChangeReducer";
import {UpdatedWhenChangeProvider} from "./src/presentation/context/updateWhenChange/UpdatedWhenChangeContext";

const defaultUpdate: UpdatedState = {
    updatePrincipal: 0,
    updateService: 0,
    updateTickets: 0,
    updateServiceTabExpenses: 0
}

const AppState = ({children}: any) => {
    return (
        <TimThemeProvider themeDefault={lightTheme}>
            <AuthProvider>
                <ApiProvider>
                    {children}
                </ApiProvider>
            </AuthProvider>
        </TimThemeProvider>
    )
}


export const App = () => {
    return (
        <NavigationContainer>
            <AlertContextProvider>
                <AppState>
                    <UpdatedWhenChangeProvider stateDefault={defaultUpdate}>
                        <StackNavigator></StackNavigator>
                    </UpdatedWhenChangeProvider>
                </AppState>
            </AlertContextProvider>
            <Toast config={ToastModule.toastConfig}/>
        </NavigationContainer>

    )
}

export default App;