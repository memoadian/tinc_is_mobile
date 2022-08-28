import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { ChooseEnviroment } from '../../screens/Auth/ChooseEnviroment';
import { ChoosePage } from '../../screens/Auth/ChoosePage';
import { Login } from '../../screens/Auth/LoginPage';
import { RecoveryPassword } from '../../screens/Auth/RecoveryPassword';
import { AuthContext } from '../../core/Context/AuthContext';
import { MainNavigator } from './MainNavigator';

const Stack = createStackNavigator();

export const StackNavigator = () => {
    const { activate } = useContext(AuthContext);
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {activate === false ? (
                <>
                    <Stack.Screen name="Choose" component={ChoosePage} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Recovery" component={RecoveryPassword} />
                    <Stack.Screen name="ChooseEnviroment" component={ChooseEnviroment} /> 
                </>
            ) : (
                <>
                    <Stack.Screen name="MainApp" component={MainNavigator} />
                </>
            )}
        </Stack.Navigator>
    );
};
