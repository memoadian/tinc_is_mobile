import React, { useEffect } from 'react'
import { View, SafeAreaView, StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { TabContent } from '../../shared/navigation/TabContent';
import { ServiceFilterProvider } from './Service/presentation/context/ServiceFilterContext';
import { TicketFilterProvider } from './Ticket/context/TicketFilterContext';

export const MainPage = () => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar
                barStyle='dark-content'
                backgroundColor={'white'}
            />
            <View style={{ flex: 1 }}>
                <TicketFilterProvider >
                    <ServiceFilterProvider >
                        <TabContent />
                    </ServiceFilterProvider>
                </TicketFilterProvider>
            </View>
        </SafeAreaView>
    )
}
