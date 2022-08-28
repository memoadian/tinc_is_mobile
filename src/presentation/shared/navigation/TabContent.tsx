import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddBottomSheet from '../components/BottomMenuSheet';
import { TicketPageComponent } from '../../screens/Main/Ticket/components/TicketPage';
import { ServicePageComponent } from '../../screens/Main/Service/presentation/components/ServicePage'
import { HomePageComponent } from '../../screens/Main/Principal/components/HomePage';
import { FontelloIcon } from '../components/Icon';
import BottomMenuAdd from '../components/BottomMenuAdd';

const Tab = createBottomTabNavigator();
export const TabContent = () => {
    const screenOptions = (route: any, color: any) => {
        let iconName: string = 'home';
        switch (route.name) {
            case 'Principal':
                iconName = '003-home';
                break;
            case 'Servicios':
                iconName = '004-wrench'
                break;
            case 'Mas':
                iconName = '017-add'
                break;
            case 'Tickets':
                iconName = '005-invoice'
                break;
            case 'Menu':
                iconName = '006-menu'
                break;
        }
        return (
            <FontelloIcon
                name={iconName}
                color={color.color}
                size={27} />
        )
    }
    const AddScreenComponent = () => {
        return null;
    }
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: (color) => screenOptions(route, color),
                headerShown: false,
                tabBarInactiveTintColor: '#000000',
                tabBarActiveTintColor: '#0097FA',
            })}

            initialRouteName="Principal"
        >
            <Tab.Screen
                name="Principal"
                component={HomePageComponent}
            />
            <Tab.Screen
                name="Servicios"
                component={ServicePageComponent} />
            <Tab.Screen name="Mas"
                options={{
                    tabBarButton: () => <BottomMenuAdd />
                }}
                component={AddScreenComponent} />
            <Tab.Screen
                name="Tickets"
                component={TicketPageComponent} />
            
            <Tab.Screen 
                name="Menu" 
                component={AddScreenComponent} 
                options={{
                tabBarButton: () => <AddBottomSheet />,
                }}
            />
        </Tab.Navigator>
    )
}

