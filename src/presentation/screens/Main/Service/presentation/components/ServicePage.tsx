import React, {useContext, useEffect, useRef, useState} from 'react';
import {createContext} from '../../../../../shared/bloc/ContextFactory';
import {ServiceBloc} from '../ServiceBloc';
import * as DependenciesServiceProvider from "../di/ServiceProvider";
import {Alert, StyleSheet, View} from 'react-native';
import {ServiceList} from './ServiceList';
import {HeaderScreen} from '../../../../../shared/components/HeaderScreen';
import {ServiceFilterView} from './ServiceFilterView';
import {ServiceFilterContext} from '../context/ServiceFilterContext';
import {datesServiceFilter, priorityServiceFilter, statesServiceFilter, typeServiceFilter} from '../util/catalogues';
import {servicesInitState, ServiceState} from '../ServiceState';
import {LocationModalComponent} from '../../../LocationModal/presentation/components/LocationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MenuAlert} from '../../../../../shared/components/MenuAlert';
import {ServiceData} from '../../../../../../domain/ListService/models/Service.model';
import {BlocBuilder} from '../../../../../shared/bloc';
import {AuthContext} from '../../../../../core/Context/AuthContext';
import {LoadingComponent} from '../../../../../shared/components/LoadingComponent';
import {ToastModule} from '../../../../../shared/components/Toast';
import {
    ItemRowSelection,
    MultipleSelectionModal,
    SingleSelectionModal
} from '../../../../../shared/components/Selections';
import {UpdatedWhenChangeContext} from "../../../../../context/updateWhenChange/UpdatedWhenChangeContext";

const [servicesBloc, useservicesBloc] = createContext<ServiceBloc>();
export const useServicesBloc = useservicesBloc;

export const ServicePage = () => {
    const {
        filterState,
        setSearch,
        setMyWork,
        setDate,
        setStatus,
        setPriority,
        setLocation,
        setRequestType,
        cleanFilters,
    } = useContext(ServiceFilterContext);
    const [isVisibleDateModal, setIsVisibleDateModal] = useState(false);
    const [isVisibleStatusModal, setIsVisibleStatusModal] = useState(false);
    const [isVisiblePriorityModal, setIsVisiblePriorityModal] = useState(false);
    const [isVisibleLocationModal, setIsVisibleLocationModal] = useState(false);
    const [isVisibleServiceModal, setIsVisibleServiceModal] = useState(false);
    const [isVisibleOptionMenu, setIsVisibleOptionMenu] = useState(false);
    const bloc = useServicesBloc();
    const [idUser, setIdUser] = useState('')
    const serviceRemove = useRef<ServiceData>()
    const {account} = useContext(AuthContext)
    const {value} = useContext(UpdatedWhenChangeContext)
    
    const [elementsDatesTicket, setElementsDatesTicket] = useState<ItemRowSelection[]>(
        datesServiceFilter.flatMap(element => {
            return {
                id: element.value,
                name: element.title,
                checked: false
            }
        })
    )
    const [elementsStatus, setElementsStatus] = useState<ItemRowSelection[]>(
        statesServiceFilter.flatMap((element) => {
            return {
                id: element.value,
                name: element.title,
                checked: false
            }
        })
    );
    const [elementsPriority, setElementsPriority] = useState<ItemRowSelection[]>(
        priorityServiceFilter.flatMap((element) => {
            return {
                id: element.value,
                name: element.title,
                checked: false
            }
        })
    );
    const [elementsTypeTicket, setElementsTypeTicket] = useState<ItemRowSelection[]>(
        typeServiceFilter.flatMap((element) => {
            return {
                id: element.value,
                name: element.title,
                checked: false
            }
        })
    );
    useEffect(() => {
        AsyncStorage.getItem('data').then((sessionData: any) => {
            const value = JSON.parse(sessionData);
            setIdUser(String(value.data.id_user))
        })
    })

    useEffect(() => {
        setElementsPriority(elementsPriority.flatMap((element) => {
            return {
                ...element,
                checked: (filterState.priority ?? []).filter(value => element.id === value).length > 0
            }
        }))
        setElementsTypeTicket(elementsTypeTicket.flatMap((element) => {
            return {
                ...element,
                checked: (filterState.requestType ?? []).filter(value => element.id === value).length > 0
            }
        }))
        setElementsStatus(elementsStatus.flatMap((element) => {
            return {
                ...element,
                checked: (filterState.status ?? []).filter(value => element.id === value).length > 0
            }
        }))
        setElementsDatesTicket(elementsDatesTicket.flatMap((element) => {
            return {
                ...element,
                checked: (filterState.date ?? []).filter(value => element.id === value).length > 0
            }
        }))      
    }, [filterState])


    const showToast = (type: 'success' | 'error', message: string) => {
        ToastModule.show(
            type,
            message,
        );
    }

    const arrayQuery = (values: number[] | null): string | null => {
        if (values && values.filter(value => value != 0).length > 0) {
            return values.filter(value => value != 0).join(',')
        }
        return null
    }

    useEffect(() => {
        bloc.loadServices({
            ...servicesInitState.info.query,
            orderby: 'scheduled_date',
            page: 0,
            perpage: 1000,
            is_account_main_id: account,
            is_user_profile_id: filterState.myWork,
            mobile_searcher: filterState.search,
            scheduled_date_auto: filterState.date,
            service_priority_multi: arrayQuery(filterState.priority),
            service_type_multi: arrayQuery(filterState.requestType),
            service_status_multi: arrayQuery(filterState.status),
            asset_location_id: filterState.location,
            queryPath: filterState.queryPath
        })
    }, [account, filterState.myWork, filterState.queryPath, value.updateService])

    const showAlertDelete = () => {
        Alert.alert(
            "Eliminar Servicio",
            "¿Estás seguro de querer eliminar la siguiente Orden de Servicio?",
            [
                {
                    text: "Cancelar",
                    style: 'destructive'
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        if (serviceRemove.current) {
                            bloc.deleteService(`${serviceRemove.current?.id}`)
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
        <View style={{flex: 1}}>
            <HeaderScreen title='Servicios'/>
            <ServiceFilterView
                onMyWorkPress={() => {
                    setMyWork(filterState.myWork ? null : `${idUser}`);
                    bloc.loadServices({
                        ...servicesInitState.info.query,
                        is_account_main_id: account,
                        is_user_profile_id: filterState.myWork ? null : `${idUser}`,
                        mobile_searcher: filterState.search,
                        scheduled_date_auto: filterState.date,
                        service_priority_multi: arrayQuery(filterState.priority),
                        service_type_multi: arrayQuery(filterState.requestType),
                        service_status_multi: arrayQuery(filterState.status),
                        asset_location_id: filterState.location
                    })
                }} onDatePress={() => {
                setIsVisibleDateModal(true);
            }} onStatusPress={() => {
                setIsVisibleStatusModal(true);
            }} onPriorityPress={() => {
                setIsVisiblePriorityModal(true);
            }} onLocationPress={() => {
                setIsVisibleLocationModal(true);
            }} onCleanPress={() => {
                cleanFilters();
                bloc.loadServices({
                    ...servicesInitState.info.query,
                    is_account_main_id: account,
                    mobile_searcher: null,
                    scheduled_date_auto: null,
                    service_priority_multi: null,
                    service_type_multi: null,
                    service_status_multi: null,
                    is_user_profile_id: null,
                    asset_location_id: null
                });
            }} onChangeSearchText={(text: string) => {
                setSearch(text);
            }} onSearchByText={(text: string) => {
                setSearch(text);
                bloc.loadServices({
                    ...servicesInitState.info.query,
                    is_account_main_id: account,
                    mobile_searcher: text,
                    is_user_profile_id: filterState.myWork,
                    scheduled_date_auto: filterState.date,
                    service_priority_multi: arrayQuery(filterState.priority),
                    service_type_multi: arrayQuery(filterState.requestType),
                    service_status_multi: arrayQuery(filterState.status),
                    asset_location_id: filterState.location
                });
            }} onRequestType={() => {
                setIsVisibleServiceModal(true);
            }}/>
            <ServiceList
                onOptionMenu={(service) => {
                    serviceRemove.current = service
                    setIsVisibleOptionMenu(true)
                }}
            />
            {/* <DateModal /> */}
            {/* BEGIN: DATE */}
            <SingleSelectionModal
                data={elementsDatesTicket}
                showing={isVisibleDateModal}
                onOutside={() => {
                    setIsVisibleDateModal(false)
                }}
                onItemPressed={(value, checked) => {
                    var elements: number[]
                    elements = [value];
                    if (checked) {

                        setDate(elements)
                    } else {
                        setDate(null)
                    }
                    setElementsDatesTicket(elementsDatesTicket.flatMap(element => {
                        return {...element, checked: element.id === value && checked}
                    }))
                    bloc.loadServices({
                        ...servicesInitState.info.query,
                        is_account_main_id: account,
                        is_user_profile_id: filterState.myWork,
                        mobile_searcher: filterState.search,
                        scheduled_date_auto: (value != '' && checked) ? value : null,
                        service_priority_multi: arrayQuery(filterState.priority),
                        service_type_multi: arrayQuery(filterState.requestType),
                        service_status_multi: arrayQuery(filterState.status),
                        asset_location_id: filterState.location
                    })
                    setIsVisibleDateModal(false);
                }}
            />
            {/* END: DATE */}
            {/* <StatusModal /> */}
            {/* BEGIN: TYPE */}
            <MultipleSelectionModal
                data={elementsTypeTicket}
                showing={isVisibleServiceModal}
                onCancel={() => {
                    setElementsTypeTicket(elementsTypeTicket.flatMap((element) => {
                        return {
                            ...element,
                            checked: (filterState.requestType ?? []).filter(value => element.id === value).length > 0
                        }
                    }))
                    setIsVisibleServiceModal(false);
                }}
                onOutside={() => {
                    setIsVisibleServiceModal(false);
                }}
                onContinue={(elements) => {
                    setRequestType(elements);
                    bloc.loadServices({
                        ...servicesInitState.info.query,
                        is_account_main_id: account,
                        is_user_profile_id: filterState.myWork,
                        mobile_searcher: filterState.search,
                        scheduled_date_auto: filterState.date,
                        service_priority_multi: arrayQuery(filterState.priority),
                        service_type_multi: arrayQuery(elements),
                        service_status_multi: arrayQuery(filterState.status),
                        asset_location_id: filterState.location
                    })
                    setIsVisibleServiceModal(false);
                }}
            />
            {/* END: TYPE */}
            {/* BEGIN: PRIORIDAD /> */}
            <MultipleSelectionModal
                data={elementsPriority}
                showing={isVisiblePriorityModal}
                onCancel={() => {
                    let elements = elementsPriority.flatMap((element) => {
                        return {
                            ...element,
                            checked: (filterState.priority ?? []).filter(value => element.id === value).length > 0
                        }
                    })
                    setIsVisiblePriorityModal(false)
                    //  setElementsPriority(elements)
                }}
                onOutside={() => {
                    setIsVisiblePriorityModal(false)
                }}
                onContinue={(elements) => {
                    setPriority(elements)
                    setIsVisiblePriorityModal(false)
                    bloc.loadServices({
                        ...servicesInitState.info.query,
                        is_account_main_id: account,
                        is_user_profile_id: filterState.myWork,
                        mobile_searcher: filterState.search,
                        scheduled_date_auto: filterState.date,
                        service_priority_multi: arrayQuery(elements),
                        service_type_multi: arrayQuery(filterState.requestType),
                        service_status_multi: arrayQuery(filterState.status),
                        asset_location_id: filterState.location
                    })
                }}
            />
            {/* BEGIN: STATUS */}
            <MultipleSelectionModal
                data={elementsStatus}
                showing={isVisibleStatusModal}
                onCancel={() => {
                    setElementsStatus(elementsStatus.flatMap((element) => {
                        return {
                            ...element,
                            checked: (filterState.status ?? []).filter(value => element.id === value).length > 0
                        }
                    }))
                    setIsVisibleStatusModal(false);
                }}
                onOutside={() => {
                    setIsVisibleStatusModal(false);
                }}
                onContinue={(elements) => {
                    setStatus(elements);
                    bloc.loadServices({
                        ...servicesInitState.info.query,
                        is_account_main_id: account,
                        is_user_profile_id: filterState.myWork,
                        mobile_searcher: filterState.search,
                        scheduled_date_auto: filterState.date,
                        service_priority_multi: arrayQuery(filterState.priority),
                        service_type_multi: arrayQuery(filterState.requestType),
                        service_status_multi: arrayQuery(elements),
                        asset_location_id: filterState.location
                    })
                    setIsVisibleStatusModal(false);
                }}
            />
            {/* END: STATUS */}
            {/* <ServicesTypeModal /> */}
            <MenuAlert
                isVisible={isVisibleOptionMenu}
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
            <LocationModalComponent
                isVisible={isVisibleLocationModal}
                idSelected={filterState.location}
                onSelected={(item) => {
                    setIsVisibleLocationModal(false);
                    if (item) {
                        setLocation(item.id);
                        bloc.loadServices({
                            ...servicesInitState.info.query,
                            is_account_main_id: account,
                            mobile_searcher: filterState.search,
                            scheduled_date_auto: filterState.date,
                            service_priority_multi: arrayQuery(filterState.priority),
                            service_type_multi: arrayQuery(filterState.requestType),
                            service_status_multi: arrayQuery(filterState.status),
                            asset_location_id: item.id
                        });
                    } else {
                        setLocation(null);
                        bloc.loadServices({
                            ...servicesInitState.info.query,
                            is_account_main_id: account,
                            mobile_searcher: filterState.search,
                            is_user_profile_id: filterState.myWork,
                            scheduled_date_auto: filterState.date,
                            service_priority_multi: arrayQuery(filterState.priority),
                            service_type_multi: arrayQuery(filterState.requestType),
                            service_status_multi: arrayQuery(filterState.status),
                            asset_location_id: null
                        });
                    }
                }} onOutsidePressed={() => {
                setIsVisibleLocationModal(false);
            }}/>
            <BlocBuilder
                bloc={bloc}
                builder={(state: ServiceState) => {
                    switch (state.kind) {
                        case 'DeleteServiceLoadingState':
                            return (<>
                                <View style={{
                                    ...StyleSheet.absoluteFillObject
                                }}>
                                    <LoadingComponent/>
                                </View>
                            </>)
                        case 'ErrorServiceState':
                            return (<>
                                {showToast('success', state.error)}
                                {bloc.dontUpdate()}
                            </>)
                        case 'DeleteServiceDeletedState':
                            return (<>
                                {showToast('success', "El Servicio se eliminó correctamente")}
                                {bloc.dontUpdate()}
                            </>)
                    }
                    return (<></>)
                }}/>
        </View>
    );
};

export const ServicePageComponent = () => {
    return (
        <servicesBloc.Provider value={DependenciesServiceProvider.provideServiceBloc()}>
            <ServicePage/>
        </servicesBloc.Provider>
    )
}

