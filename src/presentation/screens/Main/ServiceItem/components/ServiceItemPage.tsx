import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions, StyleSheet, View, Alert} from 'react-native';
import {Text} from '@rneui/base';
import {TouchableFeedback} from '../../../../shared/components/TouchableFeedback';
import LinearGradient from 'react-native-linear-gradient';
import {FontelloIcon} from '../../../../shared/components/Icon';
import TabLayout from 'react-native-simple-tablayout';
import {TabGeneralView} from './TabGeneralView';
import {createContext} from '../../../../shared/bloc/ContextFactory';
import {ServiceItemBloc} from '../ServiceItemBloc';
import * as DependenciesServiceProvider from '../di/ServiceItemProvider';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../../../shared/navigation/MainNavigator';
import {BlocBuilder} from '../../../../shared/bloc';
import {TabDetailServiceComponent, TabDetailServicePage} from './TabDetailServicePage';
import {ServiceItemState} from '../ServiceItemState';
import {LoadingComponent} from '../../../../shared/components/LoadingComponent';
import {ToastModule} from '../../../../shared/components/Toast';
import {ServiceData} from '../../../../../domain/ListService/models/Service.model';
import {TabPartView} from './TabPartView';
import {Part} from '../../../../../domain/ServiceItem/models/Service.model';
import {MenuAlert} from '../../../../shared/components/MenuAlert';
import {TabSignatureComponent, TabSignatureView} from './TabSignatureView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TabExpensesComponent, TabExpensesView} from './TabExpensesView';
import {TabAnnexesStateService} from './TabAnnexesView';
import {UpdatedState} from "../../../../context/updateWhenChange/UpdatedWhenChangeReducer";
import {UpdatedWhenChangeProvider} from "../../../../context/updateWhenChange/UpdatedWhenChangeContext";

export interface ServiceItemProps extends StackScreenProps<RootStackParams, 'ServiceItemScreen'> {
}

const [servicesBlock, useServicesBloc] = createContext<ServiceItemBloc>();
export const servicesBloc = useServicesBloc;
const defaultUpdate: UpdatedState = {
    updated: 0
}

export interface Props {
    onChangedPage: () => void;
}

export const ServiceItemPageComponent = ({navigation, route}: ServiceItemProps) => {
    return (
        <UpdatedWhenChangeProvider stateDefault={defaultUpdate}>
            <servicesBlock.Provider value={DependenciesServiceProvider.provideServiceItemBloc()}>
                <ServiceItemPage navigation={navigation} route={route}/>
            </servicesBlock.Provider>
        </UpdatedWhenChangeProvider>

    )
}

const onChangedPage = (isNextPage: boolean) => {
    /**
     * Logica para controlar si se avanza o retrocede los tabs.
     * Esta interfaz debería ser global para no repetir codigo.
     */

}

export const ServiceItemPage = ({navigation, route}: ServiceItemProps) => {
    const nav = useNavigation();
    const bloc = servicesBloc();
    const [hasPermission, setHasPermission] = useState(false);
    const [isVisibleOptionMenu, setIsVisibleOptionMenu] = useState(false);
    const [position, setPosition] = useState(4);
    const partRemove = useRef<Part>();
    const tabName: string[] = ['General', 'Detalles', 'Partes', 'Firmas', 'Gastos', 'Anexos'];
    const data = [
        <TabGeneralView
            onChangedPage={(isNextPage: boolean) => {
                onChangedPage(isNextPage)
            }}
            hasPermissions={hasPermission}
        />,
        <TabDetailServiceComponent
            hasPermissions={hasPermission}
        />,
        <TabPartView
            onInitComponent={() => {
                bloc.getPartsOfService(route.params.onReturn().toString());
            }}
            onChangedPage={(isNextPage: boolean) => {
                onChangedPage(isNextPage)
            }}
            onPartPress={(part: Part) => {
                partRemove.current = part;
                setIsVisibleOptionMenu(true);
            }}

            hasPermissions={hasPermission}
            idService={route.params.onReturn().toString()}
        />,
        <TabSignatureComponent hasPermissions={hasPermission}/>,
        <TabExpensesComponent/>,
        <TabAnnexesStateService
            idService={route.params.onReturn()}
            onChangedPage={(isNextPage: boolean) => {
                onChangedPage(isNextPage)
            }} hasPermissions={hasPermission}/>,
        ///<Screen1 text="Anexos" color="#ffb338" />
    ];

    useEffect(() => {
        let serviceId: string = String(route.params.onReturn())
        bloc.getService(serviceId);
        AsyncStorage.getItem('data').then((token: any) => {
            const list = JSON.parse(token);
            const role = list.data.id_role;
            setHasPermission(['2', '3'].includes(role));
        })
    }, [])

    const showAlertDelete = () => {
        Alert.alert(
            "Eliminar Parte",
            "¿Estas seguro de querer eliminar la Parte relacionada a la Orden de Servicio?",
            [
                {
                    text: "Cancelar",
                    style: 'destructive'
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        if (partRemove.current) {
                            bloc.deletePartOfService(partRemove.current?.id, String(route.params.onReturn()));
                        }
                    }
                }
            ],
            {
                cancelable: true,
                onDismiss: () => {
                }
            }
        );
    }

    return (
        <SafeAreaView
            style={styles.AndroidSafeArea}
        >
            <TouchableFeedback onPress={() => {
                nav.goBack()
            }}>
                <LinearGradient
                    style={{
                        paddingVertical: 8,
                        marginBottom: 0
                    }}
                    colors={['#3571c9', '#3571c9']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                >
                    <FontelloIcon
                        style={{
                            marginLeft: 10
                        }}
                        color='white'
                        name='001-arrow'
                        size={20}
                    />
                </LinearGradient>
            </TouchableFeedback>
            <View
                style={{height: '96%'}}
            >
                <BlocBuilder
                    bloc={bloc}
                    builder={(state: ServiceItemState) => {
                        switch (state.kind) {
                            case 'LoadingProviderServiceItemState':
                                return (
                                    <View style={{flex: 1}}>
                                        <LoadingComponent/>
                                    </View>
                                );
                            case 'LoadedProviderServiceItemState':
                                return (
                                    <TabLayout
                                        selectedTab={position}
                                        screens={data}
                                        tabName={tabName}
                                        indicatorHeight={3}
                                        indicatorRadius={5}
                                        titleFontSize={14}
                                        titleColor="white"
                                        tabHeight={46}
                                        tabColor="#3571c9"
                                        onTabSelected={(e: Event) => {
                                            setPosition(2);
                                        }}
                                    />
                                );
                            case 'ErrorProviderServiceItemState':
                                return (<>{ToastModule.show('error', state.error)}</>)
                            default:
                                return <><Text>default</Text></>
                        }
                    }}
                />
            </View>
            <MenuAlert
                isVisible={isVisibleOptionMenu && hasPermission}
                options={[{
                    text: 'Eliminar',
                    textSytle: {
                        color: '#000'
                    },
                    onPressed: () => {
                        setIsVisibleOptionMenu(false);
                        showAlertDelete();
                    }
                }]}
                onCancelPressed={() => {
                    setIsVisibleOptionMenu(false);
                }} onOutsidePressed={() => {
                setIsVisibleOptionMenu(false)
            }}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        width: '100%',
        paddingHorizontal: 8,
        height: 50
    },
    title: {
        fontWeight: '600',
        color: 'black'
    },
    button: {
        fontWeight: '400',
        color: 'black'
    },
    titleInput: {
        marginHorizontal: 10,
        marginBottom: 4,
        marginTop: 8
    },
    input: {
        height: 50,
        borderBottomWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    buttonItemStyle: {
        backgroundColor: '#e92267',
        height: 35,
        width: 120,
        borderRadius: 5,
        marginTop: 10,
        marginHorizontal: 10,
    },
    buttonTitleStyle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginHorizontal: 4
    }
})
