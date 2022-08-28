import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from '@rneui/base';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ScrollView } from 'react-native-gesture-handler'
import { HeaderCustomScreen } from '../../../../shared/components/HeaderCustomScreen';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useNavigation } from '@react-navigation/native';
import { ActiveItem } from '../../ActiveSearch/bloc/ActiveSearchState';
import { UserItem } from '../../UserSearch/UserSearchState';
import { useForm } from '../../../../shared/hooks/useForm';
import { ProviderItem } from '../../ProviderSearch/ProviderSearchState';
import { Divider } from '../../../../shared/components/Divider';
import { AppCatalogs } from '../../../../config/catalogs';
import DatePicker from 'react-native-date-picker';
import { simpleDateFormat } from '../../../../shared/util/Date';
import { AuthContext } from '../../../../core/Context/AuthContext';
import { TextField, TextFieldRefProps } from '../../../../shared/components/TextField';
import { createContext } from '../../../../shared/bloc/ContextFactory';
import { FormOrderServiceBloc } from '../FormOrderServiceBloc';
import { providerOrderServiceModule } from '../di/ProviderOrderService';
import { FormOrderServiceState } from '../FormOrderServiceState';
import { BlocBuilder } from '../../../../shared/bloc';
import { StackScreenProps } from '@react-navigation/stack';
import { LoadingComponent } from '../../../../shared/components/LoadingComponent';
import { ToastModule } from '../../../../shared/components/Toast';
import { TouchableFeedback } from '../../../../shared/components/TouchableFeedback';
import { RootStackParams } from '../../../../shared/navigation/MainNavigator';
import { CreateOrdenServiceRequest } from '../../../../../domain/FormOrderService/model/FormOrderService.model';
import { ItemUnicSelection, PresentantionModal } from '../../../../shared/components/Selections';

const [orderServiceBloc, useOrderServiceBloc] = createContext<FormOrderServiceBloc>();
export const formOrderServiceBloc = useOrderServiceBloc
export interface IServiceRouteProps {
    active: ActiveItem,
    idTicket: string
}
export interface OrderServiceProps extends StackScreenProps<RootStackParams, 'FormOrderServiceScreen'> { }

export const FormOrderServiceScreenComponent = ({ navigation, route }: OrderServiceProps) => {
    return (
        <orderServiceBloc.Provider value={providerOrderServiceModule.providerOrderServiceBloc()} >
            <FormOrderServiceScreen route={route} navigation={navigation} />
        </orderServiceBloc.Provider>
    )
}

export const FormOrderServiceScreen = ({ navigation, route }: OrderServiceProps) => {
    const bloc = formOrderServiceBloc();
    const [isVisibleStatusModal, setIsVisibleStatusModal] = useState(false);
    const [isVisibleServiceModal, setIsVisibleServiceModal] = useState(false);
    const [statusSelected, setStatusSelected] = useState<any>(null);
    const [serviceSelected, setServiceSelected] = useState<any>(null);
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [requireActive, setRequireActive] = useState(false);
    const [engineer, setEngineer] = useState<UserItem>();
    const [active, setActive] = useState<ActiveItem>();
    const [provider, setProvider] = useState<ProviderItem>();
    const { account, accountName } = useContext(AuthContext);
    const [enableButton, setEnableButton] = useState(false);
    const [isDisabledActive, setIsDisabledActive] = useState(false);
    const [folio, setFolio] = useState('')

    let checkbox: BouncyCheckbox | null = null;

    const { engineerName, status, service, activeName, providerName, dateService, onChange } = useForm({
        account: account,
        engineerName: '',
        activeName: '',
        providerName: '',
        status: 0,
        service: 0,
        dateService: '',
    });
    const activeInput = useRef<TextFieldRefProps>(null);

    useEffect(() => {
        if (route.params.onReturn) {
            const routeParams: IServiceRouteProps = route.params.onReturn();
            setIsDisabledActive(true);
            setFolio(routeParams.active.idTinc);
            if (routeParams.active.id !== undefined) {
                setActive(routeParams.active);
                onChange(active?.asset_type_name ?? '', 'activeName')
            } else {
                checkbox?.onPress()
            }
        }
    }, [route.params])

    useEffect(() => {
        onChange(engineer?.fullname ?? '', 'engineerName')
    }, [engineer])

    useEffect(() => {
        if (active && active.is_account_main_id !== account) {
            ToastModule.show('error', 'El activo no pertenece a la cuenta de la Orden de Servicio')
        } else if (active  && active.is_asset_status_cat_id && active.is_asset_status_cat_id.toString() === '8') {
            ToastModule.show('error','El activo esta dado de baja no se puede relacionar')            
        } else {
            onChange(active?.asset_type_name ?? '', 'activeName')
        }
    }, [active])

    useEffect(() => {
        onChange(provider?.name ?? '', 'providerName')
    }, [provider])

    useEffect(() => {
        validForm()
    }, [engineerName, activeName, providerName, dateService, requireActive, status, service])

    const validForm = () => {
        if (status !== 0 && service !== 0 && dateService !== ''
            && providerName !== ''
        ) {
            if (!requireActive && activeName !== '') {
                setEnableButton(true)
            } else if (requireActive) {
                setEnableButton(true)
            } else {
                setEnableButton(false)
            }
        } else {
            setEnableButton(false)
        }
    }

    const StatusModal = () => (
        <PresentantionModal
            isVisible={isVisibleStatusModal}
            onOutsidePressed={() => {
                setIsVisibleStatusModal(false)
            }}
        >
            <View style={styles.modal}>
                <FlatList
                    data={AppCatalogs.es_service_status_cat}
                    renderItem={({ item }: any) => (
                        <ItemUnicSelection
                            title={item.description}
                            value={item}
                            checked={statusSelected?.id === item.id}
                            onPressed={(value, checked) => {
                                setIsVisibleStatusModal(false)
                                setStatusSelected(value)
                                onChange(value.id, 'status')
                            }} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => <Divider />}
                />
            </View>
        </PresentantionModal>
    );

    const ServiceModal = () => (
        <PresentantionModal
            isVisible={isVisibleServiceModal}
            onOutsidePressed={() => {
                setIsVisibleServiceModal(false)
            }}
        >
            <View style={styles.modal}>
                <FlatList
                    data={AppCatalogs.es_service_type_cat}
                    renderItem={({ item }: any) => (
                        <ItemUnicSelection
                            title={item.description}
                            value={item}
                            checked={serviceSelected?.id === item.id}
                            onPressed={(value, checked) => {
                                setIsVisibleServiceModal(false)
                                setServiceSelected(value)
                                onChange(value.id, 'service')
                            }} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => <Divider />}
                />
            </View>
        </PresentantionModal>
    );

    return (
        <SafeAreaView style={styles.AndroidSafeArea} >
            <HeaderCustomScreen
                onBack={() => navigation.goBack()}
                backButton={'close'}
                showContinue={false}
                title='Crear Orden de Servicio' />
            <BlocBuilder
                bloc={bloc}
                builder={(state: FormOrderServiceState) => {
                    switch (state.kind) {
                        case 'LoadingSavedOrderState':
                            return (
                                <View style={[styles.container]}>
                                    <LoadingComponent />
                                </View>)
                        case 'ErrorSavedOrderState':
                            return (
                                <>
                                    {ToastModule.show('error', state.error, 'top')}
                                </>)
                        case 'SavedOrderState':
                            return (
                                <>
                                    {route.params.onSuccess?.(state.data.created)}
                                    {navigation.goBack()}
                                </>)
                        case 'GetActiveState':
                            return <>
                                {setActive(state.data)}
                                {bloc.emptyState()}
                            </>
                        default: return <></>
                    }
                }}
            />
            <ScrollView>
                {/* Cuenta actual */}
                <Text style={styles.titleInput}>Cuenta*</Text>
                <TextField
                    placeholder='Cuenta'
                    multiline={false}
                    autoCapitalize='none'
                    value={accountName}
                    editable={false}
                />
                {/* Estatus */}
                <Text style={styles.titleInput}>Estatus*</Text>
                <TextField
                    placeholder='Estatus'
                    multiline={false}
                    autoCapitalize='none'
                    value={statusSelected?.description}
                    editable={true}
                    onPressIn={() => {
                        setIsVisibleStatusModal(true)
                    }}
                    onRightIcon={() => {
                        setIsVisibleStatusModal(true)
                    }}
                    onFocus={() => {
                        setIsVisibleStatusModal(true)
                    }}
                    rightIcon={<Icon name="caret-down" size={20} color="black" />}
                />
                {/* Tipo de servicio */}
                <Text style={styles.titleInput}>Tipo de servicio*</Text>
                <TextField
                    placeholder='Tipo de servicio'
                    multiline={false}
                    autoCapitalize='none'
                    value={serviceSelected?.description}
                    editable={true}
                    onFocus={() => {
                        setIsVisibleServiceModal(true)
                    }}
                    onPressIn={() => {
                        setIsVisibleServiceModal(true)
                    }}
                    onRightIcon={() => {
                        setIsVisibleServiceModal(true)
                    }}
                    rightIcon={<Icon name="caret-down" size={20} color="black" />}
                />
                {/* Proveedor */}
                <Text style={styles.titleInput}>Proveedor*</Text>
                <View onTouchEnd={() => {
                    navigation.navigate('ProviderListScreen', {
                        onReturn: (item: ProviderItem) => {
                            setProvider(item)
                        }
                    });
                }}>
                    <TextField
                        placeholder='Proveedor'
                        multiline={false}
                        autoCapitalize='none'
                        value={providerName}
                        editable={false}
                        rightIcon={
                            <Icon name="search" size={20} color="black" />
                        }
                    /* onFocus={() => {
                        nav.navigate('ProviderListScreen', {
                            onReturn: (item: ProviderItem) => {
                                setProvider(item)
                            }
                        });
                    }}
                    onPressIn={() => {
                        nav.navigate('ProviderListScreen', {
                            onReturn: (item: ProviderItem) => {
                                setProvider(item)
                            }
                        });
                    }}
                    onRightIcon={() => {
                        nav.navigate('ProviderListScreen', {
                            onReturn: (item: ProviderItem) => {
                                setProvider(item)
                            }
                        });
                    }} */
                    />
                </View>

                {/* Activo */}
                <Text style={styles.titleInput}>Activo*</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginEnd: 16,
                }} >
                    <View style={{
                        flex: 1,
                    }} onTouchEnd={() => {
                        (activeInput.current?.isEnable() && route.params?.onReturn === undefined) ?
                            navigation.navigate('ActiveSearchListScreenComponent', {
                                onReturn: (item: ActiveItem) => {
                                    setActive(item)
                                }
                            })
                            : null
                    }}>
                        <TextField
                            ref={activeInput}
                            placeholder='Activo'
                            multiline={false}
                            autoCapitalize='none'
                            value={activeName}
                            editable={false}
                            onFocus={
                                () => {
                                    (activeInput.current?.isEnable() && !isDisabledActive) ?
                                        navigation.navigate('ActiveSearchListScreenComponent', {
                                            onReturn: (item: ActiveItem) => {
                                                setActive(item)
                                            }
                                        })
                                        : null
                                }
                            }
                            rightIcon={
                                <Icon name="search" size={20} color="black" />
                            }
                        /*  onPressIn={() => {
                             (activeInput.current?.isEnable() && !isDisabledActive) ?
                                 nav.navigate('ActiveSearchListScreenComponent', {
                                     onReturn: (item: ActiveItem) => {
                                         setActive(item)
                                     }
                                 })
                                 : null
                         }}
                         onRightIcon={() => {
                             (activeInput.current?.isEnable() && !isDisabledActive) ?
                                 nav.navigate('ActiveSearchListScreenComponent', {
                                     onReturn: (item: ActiveItem) => {
                                         setActive(item)
                                     }
                                 })
                                 : null
                         }} */
                        />
                    </View>
                    <TouchableFeedback onPress={() => {
                        if (!isDisabledActive) {
                            navigation.navigate('ScanQRScreen', {
                                onReturn: (data: any) => {
                                    let url: string = data;
                                    let valuesSplit = url.split('id=');
                                    if (valuesSplit.length === 2) {
                                        let idActive: string = valuesSplit[1];
                                        bloc.getActiveDetail(idActive)
                                    }
                                }
                            })
                        }
                    }} >
                        <Icon name="qrcode" size={20} color="black" />
                    </TouchableFeedback>
                </View>
                <View style={{ margin: 16 }}>
                    <BouncyCheckbox
                        ref={(ref: any) => (checkbox = ref)}
                        size={18}
                        fillColor='#8e8a8e'
                        iconStyle={{
                            borderWidth: 2,
                            borderColor: '#8e8a8e',
                            borderRadius: 0,
                        }}
                        textStyle={{
                            color: '#8e8a8e'
                        }}
                        disabled={isDisabledActive}
                        onPress={(isChecked: boolean) => {
                            setRequireActive(isChecked)
                            if (isChecked) {
                                activeInput?.current?.disable()
                                onChange('', 'activeName')
                                setActive(undefined)
                            } else {
                                activeInput?.current?.enable()
                            }
                        }}
                        textComponent={<Text style={{ marginHorizontal: 8 }}>El servicio no se relaciona con un activo</Text>}
                    />
                </View>
                {/* Fecha programada */}
                <Text style={styles.titleInput}>Fecha programada*</Text>
                <View onTouchEnd={() => setOpen(true)}>
                <TextField
                    placeholder='Fecha programada'
                    rightIcon={<Icon name="calendar-alt" size={20} color="black" />}
                    multiline={false}
                    autoCapitalize='none'
                    value={dateService}
                    //onPressIn={() => setOpen(true)}
                />
                </View>
                
                {/* Ing. Asignado */}
                <Text style={styles.titleInput}>Ing. Asignado</Text>
                <View onTouchEnd={() => {
                    navigation.navigate('UserSearchComponent', {
                        onReturn: (item: UserItem) => {
                            setEngineer(item)
                        }
                    });
                }}>
                    <TextField
                        placeholder='Ing. Asignado'
                        multiline={false}
                        autoCapitalize='none'
                        value={engineerName}
                        editable={false}
                        rightIcon={
                            <Icon name="search" size={20} color="black" />
                        }                    
                    />
                </View>

                <View style={{ height: 60, justifyContent: 'center' }}>
                    <Button
                        title="Crear"
                        disabled={!enableButton}
                        onPress={() => {
                            let req: CreateOrdenServiceRequest = {
                                is_account_main_id: account,
                                es_service_status_cat_id: statusSelected.id.toString(),
                                es_service_type_cat_id: serviceSelected.id.toString(),
                                es_supplier_main_id: provider?.id ?? '',
                                is_asset_main_id: (activeName !== '') ? (active?.id ? +active.id : null) : null,
                                scheduled_date: dateService,
                                es_service_origin_cat_id: 5,
                            }
                            if (engineer) {
                                req = { ...req, is_user_profile_id: engineer?.id }
                            }
                            if (folio !== '') {
                                req = { ...req, reference: folio }
                            }
                            bloc.saveOrderService(req);
                        }}
                        containerStyle={{ alignSelf: 'flex-end' }}
                        buttonStyle={styles.buttonItemStyle}
                        titleStyle={styles.buttonTitleStyle} />
                </View>
                <View style={{ height: 100 }} />
                <StatusModal />
                <ServiceModal />
                <DatePicker
                    modal
                    mode="date"
                    locale='es-MX'
                    title='Selecciona la fecha'
                    cancelText='Cancelar'
                    confirmText='Confirmar'
                    open={open}
                    date={date}
                    onConfirm={date => {
                        setOpen(false);
                        setDate(date);
                        onChange(simpleDateFormat(date), 'dateService')
                    }}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#D8D8D8',
        width: '100%',
        paddingHorizontal: 8,
        paddingVertical: 8,
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
        marginHorizontal: 16,
        marginTop: 16
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
    },
    modal: {
        backgroundColor: '#FFFFFF',
        width: 350,
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.25,
        elevation: 4,
        borderRadius: 8
    },
    container: {
        height: '100%',
        width: '100%',
        justifyContent: "center",
    },
});

