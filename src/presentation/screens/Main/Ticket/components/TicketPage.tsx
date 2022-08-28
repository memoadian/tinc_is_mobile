import React, {useContext, useEffect, useRef, useState} from 'react';
import {createContext} from '../../../../shared/bloc/ContextFactory';
import {TicketBloc} from '../TicketBloc';
import * as DependenciesTicketProvider from "../di/TicketProvider";
import {Alert, StyleSheet, View} from 'react-native';
import {TicketList} from './TicketList';
import {HeaderScreen} from '../../../../shared/components/HeaderScreen';
import {TicketFilterView} from './TicketFilterView';
import {TicketFilterContext} from '../context/TicketFilterContext';
import {datesTicketFilter, priorityTicketFilter, statesTicketFilter, typeTicketFilter} from '../util/catalogues';
import {LocationModalComponent} from '../../LocationModal/presentation/components/LocationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MenuAlert} from '../../../../shared/components/MenuAlert';
import {TicketData} from '../../../../../domain/ListTickets/models/Ticket.model';
import {BlocBuilder} from '../../../../shared/bloc';
import {AuthContext} from '../../../../core/Context/AuthContext';
import {LoadingComponent} from '../../../../shared/components/LoadingComponent';
import {ToastModule} from '../../../../shared/components/Toast';
import {ticketsInitState, TicketState} from '../TicketState';
import {SingleSelectionModal, MultipleSelectionModal} from '../../../../shared/components/Selections';
import {ItemRowSelection} from '../../../../shared/components/Selections/types';
import {UpdatedWhenChangeContext} from "../../../../context/updateWhenChange/UpdatedWhenChangeContext";

const [ticketsBloc, useticketsBloc] = createContext<TicketBloc>();
export const useTicketsBloc = useticketsBloc;

export const TicketPageComponent = () => {
    return (
        <ticketsBloc.Provider value={DependenciesTicketProvider.provideTicketBloc()}>
            <TicketPage/>
        </ticketsBloc.Provider>
    )
}

export const TicketPage = () => {

    const {
        filterState,
        setSearch,
        setMyWork,
        setDate,
        setStatus,
        setPriority,
        setLocation,
        setRequestType,
        cleanFilters
    } = useContext(TicketFilterContext);
    const [isVisibleDateModal, setIsVisibleDateModal] = useState(false);
    const [isVisibleStatusModal, setIsVisibleStatusModal] = useState(false);
    const [isVisiblePriorityModal, setIsVisiblePriorityModal] = useState(false);
    const [isVisibleLocationModal, setIsVisibleLocationModal] = useState(false);
    const [isVisibleTicketModal, setIsVisibleTicketModal] = useState(false);
    const [isVisibleOptionMenu, setIsVisibleOptionMenu] = useState(false);
    const bloc = useTicketsBloc();
    const {value} = useContext(UpdatedWhenChangeContext)
    const [idUser, setIdUser] = useState('');
    const ticketRemove = useRef<TicketData>();
    const {account} = useContext(AuthContext);
    const [elementsPriority, setElementsPriority] = useState<ItemRowSelection[]>(
        priorityTicketFilter.flatMap((element) => {
            return {
                id: element.value,
                name: element.title,
                checked: false
            }
        })
    );
    const [elementsStatus, setElementsStatus] = useState<ItemRowSelection[]>(
        statesTicketFilter.flatMap((element) => {
            return {
                id: element.value,
                name: element.title,
                checked: false
            }
        })
    );
    const [elementsTypeTicket, setElementsTypeTicket] = useState<ItemRowSelection[]>(
        typeTicketFilter.flatMap((element) => {
            return {
                id: element.value,
                name: element.title,
                checked: false
            }
        })
    );
    const [elementsDatesTicket, setElementsDatesTicket] = useState<ItemRowSelection[]>(
        datesTicketFilter.flatMap(element => {
            return {
                id: element.value,
                name: element.title,
                checked: false
            }
        })
    )
    useEffect(() => {
        AsyncStorage.getItem('data').then((sessionData: any) => {
            const value = JSON.parse(sessionData);
            setIdUser(String(value.data.id_user))
        })
    })

    useEffect(() => {
        setElementsTypeTicket(elementsTypeTicket.flatMap((element) => {
            return {
                ...element,
                checked: (filterState.requestType ?? []).filter(value => element.id === value).length > 0
            }
        }))
        setElementsPriority(elementsPriority.flatMap((element) => {
            return {
                ...element,
                checked: (filterState.priority ?? []).filter(value => element.id === value).length > 0
            }
        }))
        setElementsDatesTicket(elementsDatesTicket.flatMap((element) => {
            return {
                ...element,
                checked: (filterState.date ?? []).filter(value => element.id === value).length > 0
            }
        }))
        if (filterState.status == null) {
            setElementsStatus(elementsStatus.flatMap((element) => {
                return {
                    ...element,
                    checked: false
                }
            }))
        }

    }, [filterState])


    useEffect(() => {
        bloc.loadTickets({
            ...ticketsInitState.info.query,
            orderby: 'create_at',
            ordertype: 'DESC',
            page: 0,
            perpage: 1000,
            is_account_main_id: account,
            is_user_profile_id: filterState.myWork,
            mobile_searcher: filterState.search,
            request_date_auto: filterState.date,
            ticket_priority_multi: arrayQuery(filterState.priority),
            ticket_request_multi: arrayQuery(filterState.requestType),
            ticket_status_name: filterState.status,
            is_account_location_id: filterState.location,
            queryPath: filterState.queryPath
        })
    }, [account, filterState.queryPath, value.updateTickets])

    const arrayQuery = (values: number[] | null): string | null => {
        if (values && values.filter(value => value != 0).length > 0) {
            return values.filter(value => value != 0).join(',')
        }
        return null
    }

    const showAlertDelete = () => {
        Alert.alert(
            "Eliminar Ticket",
            "¿Estás seguro de querer eliminar el siguiente Ticket?",
            [
                {
                    text: "Cancelar",
                    style: 'destructive'
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        if (ticketRemove.current) {
                            bloc.deleteTicket(`${ticketRemove.current?.id}`)
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
            <HeaderScreen title='Tickets'/>
            <TicketFilterView
                onMyWorkPress={() => {
                    setMyWork(filterState.myWork ? null : `${idUser}`);
                    bloc.loadTickets({
                        ...ticketsInitState.info.query,
                        is_account_main_id: account,
                        is_user_profile_id: filterState.myWork ? null : `${idUser}`,
                        mobile_searcher: filterState.search,
                        request_date_auto: filterState.date,
                        ticket_priority_multi: arrayQuery(filterState.priority),
                        ticket_request_multi: arrayQuery(filterState.requestType),
                        ticket_status_name: filterState.status,
                        is_account_location_id: filterState.location
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
                bloc.loadTickets({
                    ...ticketsInitState.info.query,
                    is_account_main_id: account,
                    mobile_searcher: null,
                    request_date_auto: null,
                    ticket_priority_multi: null,
                    ticket_request_multi: null,
                    ticket_status_name: null,
                    is_user_profile_id: null,
                    is_account_location_id: null
                });
            }} onChangeSearchText={(text: string) => {
                setSearch(text);
            }} onSearchByText={(text: string) => {
                setSearch(text);
                bloc.loadTickets({
                    ...ticketsInitState.info.query,
                    is_account_main_id: account,
                    mobile_searcher: text,
                    is_user_profile_id: filterState.myWork,
                    request_date_auto: filterState.date,
                    ticket_priority_multi: arrayQuery(filterState.priority),
                    ticket_request_multi: arrayQuery(filterState.requestType),
                    ticket_status_name: filterState.status,
                    is_account_location_id: filterState.location
                });
            }} onRequestType={() => {
                setIsVisibleTicketModal(true);
            }}/>
            <TicketList
                onOptionMenu={(ticket) => {
                    ticketRemove.current = ticket
                    setIsVisibleOptionMenu(true)
                }}
            />
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
                    setIsVisibleDateModal(false)
                    if (checked) {
                        setDate(elements)
                    } else {
                        setDate(null)
                    }
                    setElementsDatesTicket(elementsDatesTicket.flatMap(element => {
                        return {...element, checked: element.id === value && checked}
                    }))
                    bloc.loadTickets({
                        ...ticketsInitState.info.query,
                        is_account_main_id: account,
                        is_user_profile_id: filterState.myWork,
                        mobile_searcher: filterState.search,
                        request_date_auto: (value != '' && checked) ? value : null,
                        ticket_priority_multi: arrayQuery(filterState.priority),
                        ticket_request_multi: arrayQuery(filterState.requestType),
                        ticket_status_name: filterState.status,
                        is_account_location_id: filterState.location
                    })
                }}
            />
            {/* END: DATE */}
            {/* BEGIN: STATUS */}
            <SingleSelectionModal
                data={elementsStatus}
                showing={isVisibleStatusModal}
                onOutside={() => {
                    setIsVisibleStatusModal(false)
                }}
                onItemPressed={(value, checked) => {
                    setIsVisibleStatusModal(false)
                    if (checked) {
                        setStatus(value)
                    } else {
                        setStatus(null)
                    }
                    setElementsStatus(elementsStatus.flatMap(element => {
                        return {...element, checked: element.id === value && checked}
                    }))
                    bloc.loadTickets({
                        ...ticketsInitState.info.query,
                        is_account_main_id: account,
                        is_user_profile_id: filterState.myWork,
                        mobile_searcher: filterState.search,
                        request_date_auto: filterState.date,
                        ticket_priority_multi: arrayQuery(filterState.priority),
                        ticket_request_multi: arrayQuery(filterState.requestType),
                        ticket_status_name: (value != '' && checked) ? value : null,
                        is_account_location_id: filterState.location,
                    })
                }}
            />
            {/* END: STATUS */}
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
                    setElementsPriority(elements)
                }}
                onOutside={() => {
                    setIsVisiblePriorityModal(false)
                }}
                onContinue={(elements) => {
                    setPriority(elements)
                    setIsVisiblePriorityModal(false)
                    bloc.loadTickets({
                        ...ticketsInitState.info.query,
                        is_account_main_id: account,
                        is_user_profile_id: filterState.myWork,
                        mobile_searcher: filterState.search,
                        request_date_auto: filterState.date,
                        ticket_priority_multi: arrayQuery(elements),
                        ticket_request_multi: arrayQuery(filterState.requestType),
                        ticket_status_name: filterState.status,
                        is_account_location_id: filterState.location
                    })
                }}
            />
            {/* END: PRIORIDAD /> */}
            {/* BEGIN: TIPO */}
            <MultipleSelectionModal
                data={elementsTypeTicket}
                showing={isVisibleTicketModal}
                onCancel={() => {
                    setElementsTypeTicket(elementsTypeTicket.flatMap((element) => {
                        return {
                            ...element,
                            checked: (filterState.requestType ?? []).filter(value => element.id === value).length > 0
                        }
                    }))
                    setIsVisibleTicketModal(false);
                }}
                onOutside={() => {
                    setIsVisibleTicketModal(false);
                }}
                onContinue={(elements) => {
                    setIsVisibleTicketModal(false);
                    setRequestType(elements);
                    bloc.loadTickets({
                        ...ticketsInitState.info.query,
                        is_account_main_id: account,
                        is_user_profile_id: filterState.myWork,
                        mobile_searcher: filterState.search,
                        request_date_auto: filterState.date,
                        ticket_priority_multi: arrayQuery(filterState.priority),
                        ticket_request_multi: arrayQuery(elements),
                        ticket_status_name: filterState.status,
                        is_account_location_id: filterState.location
                    })
                }}
            />
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
                        bloc.loadTickets({
                            ...ticketsInitState.info.query,
                            is_account_main_id: account,
                            mobile_searcher: filterState.search,
                            request_date_auto: filterState.date,
                            ticket_priority_multi: arrayQuery(filterState.priority),
                            ticket_request_multi: arrayQuery(filterState.requestType),
                            ticket_status_name: filterState.status,
                            is_account_location_id: item.id
                        });
                    } else {
                        setLocation(null);
                        bloc.loadTickets({
                            ...ticketsInitState.info.query,
                            is_account_main_id: account,
                            mobile_searcher: filterState.search,
                            is_user_profile_id: filterState.myWork,
                            request_date_auto: filterState.date,
                            ticket_priority_multi: arrayQuery(filterState.priority),
                            ticket_request_multi: arrayQuery(filterState.requestType),
                            ticket_status_name: filterState.status,
                            is_account_location_id: null
                        });
                    }
                }} onOutsidePressed={() => {
                setIsVisibleLocationModal(false);
            }}/>
            <BlocBuilder
                bloc={bloc}
                builder={(state: TicketState) => {
                    switch (state.kind) {
                        case 'DeleteTicketLoadingState':
                            return (<>
                                <View style={{
                                    ...StyleSheet.absoluteFillObject
                                }}>
                                    <LoadingComponent/>
                                </View>
                            </>)
                        case 'ErrorTicketState':
                            return (<>
                                {ToastModule.show('success', state.error)}
                                {bloc.dontUpdate()}
                            </>)
                        case 'DeleteTicketDeletedState':
                            return (<>
                                {ToastModule.show('success', "El Ticket se eliminó correctamente")}
                                {bloc.dontUpdate()}
                            </>)
                    }
                    return (<></>)
                }}/>
        </View>
    );
};