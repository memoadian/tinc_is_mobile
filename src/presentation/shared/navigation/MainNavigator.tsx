import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { UIConfigProvier } from '../../core/Context/UIConfigContext';
import { ActiveItem } from '../../screens/Main/ActiveSearch/bloc/ActiveSearchState';
import { ActiveSearchListScreenComponent } from '../../screens/Main/ActiveSearch/componentes/ActiveListScreen';
import {
    FormOrderServiceScreenComponent,
    IServiceRouteProps
} from '../../screens/Main/FormOrderService/components/FormOrderServiceScreen';
import { MainPage } from '../../screens/Main/MainPage';
import { ProviderSearchListScreenComponent } from '../../screens/Main/ProviderSearch/Components/ProviderListScreen';
import { ScanQRScreen } from '../../screens/Main/ScanQRScreen/ScanQRScreen';
import { ServiceItemPageComponent } from '../../screens/Main/ServiceItem/components/ServiceItemPage';
import { UserSearchComponent } from '../../screens/Main/UserSearch/components/UserSearchList';
import { FormTicketScreenComponent } from '../../screens/Main/FormTicket/components/FormTicketScreen';
import { UserItem } from '../../screens/Main/UserSearch/UserSearchState';
import { ProviderItem } from '../../screens/Main/ProviderSearch/ProviderSearchState';
import { PartsSearchComponent } from '../../screens/Main/PartsSearch/components/PartsListScreen';
import {PartItem, PartMaterialItem} from '../../screens/Main/PartsSearch/bloc/PartsSearchState';
import { TicketItemPage } from '../../screens/Main/TicketItem/components/TicketItemPage';
import { NotificationService } from '../../screens/Main/Configuration/component/ConfigurationScreen';

const Stack = createStackNavigator();

export type RootStackParams = {
    FormTicketScreen: { onSuccess?: (idCreated: number) => void; };
    FormOrderServiceScreen: {
        onReturn?: () => IServiceRouteProps;
        onSuccess?: (idCreated: number) => void;
    };
    PartsSearchComponent: { onReturn: (result: { part: PartItem, material: PartMaterialItem[] }) => void; }
    ScanQRScreen: { onReturn: (result: any) => void; }
    UserSearchComponent: { onReturn: (result: UserItem) => void; }
    ProviderListScreen: { onReturn: (result: ProviderItem) => void; }
    ServiceItemScreen: { onReturn: () => number; }
    ActiveSearchListScreenComponent: { onReturn: (result: ActiveItem) => void; }
    TicketItemScreen: { onReturn: () => string }
    ConfigurationScreen: { onReturn: () => void; }
}

export const MainNavigator = () => {
    return (
        <UIConfigProvier uiConfigDefault={{
            showBtnAccount: true
        }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Main' component={MainPage} />
                <Stack.Screen name='FormTicketScreen' component={FormTicketScreenComponent} />
                <Stack.Screen name='FormOrderServiceScreen' component={FormOrderServiceScreenComponent} />
                <Stack.Screen name='ActiveSearchListScreenComponent' component={ActiveSearchListScreenComponent} />
                <Stack.Screen name="UserSearchComponent" component={UserSearchComponent} />
                <Stack.Screen name="PartsSearchComponent" component={PartsSearchComponent} />
                <Stack.Screen name="ProviderListScreen" component={ProviderSearchListScreenComponent} />
                <Stack.Screen name='ServiceItemScreen' component={ServiceItemPageComponent} />
                <Stack.Screen name='TicketItemScreen' component={TicketItemPage} />
                <Stack.Screen name='ScanQRScreen' component={ScanQRScreen} />
                <Stack.Screen name='ConfigurationScreen' component={NotificationService} />

            </Stack.Navigator>
        </UIConfigProvier>
    )
}
