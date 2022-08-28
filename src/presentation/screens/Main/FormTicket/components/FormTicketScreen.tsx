import { Button, Divider } from '@rneui/base'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ScrollView } from 'react-native-gesture-handler'
import { FormTicketBloc } from '../bloc/FormTicketBloc';
import { ProviderFormTicketModule } from '../di/ProviderFormTicket';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useNavigation } from '@react-navigation/native';
import { FormTicketState } from '../bloc/FormTicketStates';
import { StackScreenProps } from '@react-navigation/stack';
import { createContext } from '../../../../shared/bloc/ContextFactory';
import { TextField, TextFieldRefProps } from '../../../../shared/components/TextField';
import { LocationEntity } from '../../../../../domain/Locations/models/Location.model';
import { AppCatalogs } from '../../../../config/catalogs';
import { AuthContext } from '../../../../core/Context/AuthContext';
import { BlocBuilder } from '../../../../shared/bloc';
import { HeaderCustomScreen } from '../../../../shared/components/HeaderCustomScreen';
import { LoadingComponent } from '../../../../shared/components/LoadingComponent';
import { ToastModule } from '../../../../shared/components/Toast';
import { TouchableFeedback } from '../../../../shared/components/TouchableFeedback';
import { useForm } from '../../../../shared/hooks/useForm';
import { ActiveItem } from '../../ActiveSearch/bloc/ActiveSearchState';
import { LocationModalComponent } from '../../LocationModal/presentation/components/LocationModal';
import { UserItem } from '../../UserSearch/UserSearchState';
import { ItemUnicSelection, PresentantionModal } from '../../../../shared/components/Selections';
import { RootStackParams } from '../../../../shared/navigation/MainNavigator';

export interface FormTicketScreenComponentProps
    extends StackScreenProps<RootStackParams, 'FormTicketScreen'> { }

const [ticketBloc, useFormTicketBloc] = createContext<FormTicketBloc>();
export const formTicketBloc = useFormTicketBloc;

export const FormTicketScreenComponent = ({ navigation, route }: FormTicketScreenComponentProps) => {
    return (
        <ticketBloc.Provider value={ProviderFormTicketModule.getBloc()} >
            <FormTicketScreen navigation={navigation} route={route} />
        </ticketBloc.Provider>
    )
}

export const FormTicketScreen = ({ navigation, route }: FormTicketScreenComponentProps) => {
    const nav = useNavigation<FormTicketScreenComponentProps>();
    const bloc = formTicketBloc();
    const [engineer, setEngineer] = useState<UserItem>();
    const [active, setActive] = useState<ActiveItem>();
    const [location, setLocation] = useState<LocationEntity | null>(null);
    const [prioritySelected, setPrioritySelected] = useState<any>(null);
    const [requestSelected, setRequestSelected] = useState<any>(null);
    const [requireActive, setRequireActive] = useState(false);
    const activeInput = useRef<TextFieldRefProps>(null);
    const { account, accountName } = useContext(AuthContext);
    const [isVisibleLocationModal, setIsVisibleLocationModal] = useState(false);
    const [isVisiblePriorityModal, setVisiblePriorityModal] = useState(false);
    const [isVisibleRequestModal, setVisibleRequestModal] = useState(false);
    const [enableButton, setEnableButton] = useState(false);
    const {
        engineerName,
        activeName,
        requestor,
        subject,
        comments,
        contact_phone,
        onChange
    } = useForm({
        account: account,
        engineerName: '',
        activeName: '',
        es_ticket_priority_cat_id: '',
        es_ticket_request_cat: '',
        requestor: '',
        subject: '',
        comments: '',
        contact_phone: ''
    });

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
        validForm()
    }, [engineerName, activeName, requestor, subject, requireActive, location, requestSelected, prioritySelected])


    const validForm = () => {
        if (requestor !== ''
            && subject !== ''
            && location !== null
            && requestSelected !== null
            && prioritySelected !== null
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

    const PriorityModal = () => (
        <PresentantionModal
            isVisible={isVisiblePriorityModal}
            onOutsidePressed={() => {
                setVisiblePriorityModal(false)
            }}
        >
            <View style={styles.modal}>
                <FlatList
                    data={AppCatalogs.es_ticket_priority_cat}
                    renderItem={({ item }: any) => (
                        <ItemUnicSelection
                            title={item.description}
                            value={item}
                            checked={prioritySelected?.id === item.id}
                            onPressed={(value, checked) => {
                                setVisiblePriorityModal(false)
                                setPrioritySelected(value)
                                onChange(value.id, 'es_ticket_priority_cat_id')
                            }} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => <Divider />}
                />
            </View>
        </PresentantionModal>
    );

    const RequestModal = () => (
        <PresentantionModal
            isVisible={isVisibleRequestModal}
            onOutsidePressed={() => {
                setVisibleRequestModal(false)
            }}
        >
            <View style={styles.modal}>
                <FlatList
                    data={AppCatalogs.es_ticket_request_cat}
                    renderItem={({ item }: any) => (
                        <ItemUnicSelection
                            title={item.description}
                            value={item}
                            checked={prioritySelected?.id === item.id}
                            onPressed={(value, checked) => {
                                setVisibleRequestModal(false)
                                setRequestSelected(value)
                                onChange(value.id, 'es_ticket_request_cat')
                            }} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => <Divider />}
                />
            </View>
        </PresentantionModal>
    );

    return (<>
        <SafeAreaView style={styles.AndroidSafeArea} >
            <StatusBar
                barStyle='dark-content'
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
                        <HeaderCustomScreen
                            onBack={() => navigation.goBack()}
                            backButton={'close'}
                            showContinue={false}
                            title='Crear ticket de servicio' />
                        <BlocBuilder
                            bloc={bloc}
                            builder={(state: FormTicketState) => {
                                switch (state.kind) {
                                    case 'LoadingCreatedTicketState':
                                        return (
                                            <View style={[styles.container]}>
                                                <LoadingComponent />
                                            </View>)
                                    case 'ErrorCreatedTicketState':
                                        return (
                                            <>
                                                {ToastModule.show('error', state.error,'top')}
                                            </>)
                                    case 'CreatedTicketState':
                                        return (
                                            <>
                                                {route.params.onSuccess?.(state.data.created)}
                                                {navigation.goBack()}
                                            </>)
                                    case 'GetActiveState':
                                        return (<>
                                            {setActive(state.data)}
                                            {bloc.emptyState()}
                                        </>)
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
                            {/* Solicitante */}
                            <Text style={styles.titleInput}>Solicitante*</Text>
                            <TextField
                                placeholder='Solicitante'
                                multiline={false}
                                autoCapitalize='none'
                                value={requestor}
                                onChangeText={(value) => {
                                    onChange(value, 'requestor')
                                }}
                            />
                            {/* Ubicación */}
                            <Text style={styles.titleInput}>Ubicación Solicitante*</Text>
                            <View onTouchEnd={() => {
                                setIsVisibleLocationModal(true)
                            }}>
                                <TextField
                                    placeholder='Ubicación Solicitante'
                                    multiline={false}
                                    autoCapitalize='none'
                                    value={location?.name}
                                    editable={false}
                                    rightIcon={<Icon name="caret-down" size={20} color="black" />}
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
                                <View style={{ flex: 1 }} onTouchEnd={() => {
                                    (activeInput.current?.isEnable()) ?
                                        navigation.navigate('ActiveSearchListScreenComponent', {
                                            onReturn: (item: ActiveItem) => {
                                                setActive(item)
                                            }
                                        })
                                        : null
                                }}>
                                    <TextField
                                        ref={activeInput}
                                        contentStyle={{
                                            flex: 1,
                                        }}
                                        placeholder='Activo'
                                        multiline={false}
                                        autoCapitalize='none'
                                        value={activeName}
                                        editable={true}
                                        rightIcon={<Icon name="search" size={20} color="black" />}
                                    />
                                </View>
                                <TouchableFeedback onPress={() => {
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
                                }} >
                                    <Icon name="qrcode" size={20} color="black" />
                                </TouchableFeedback>
                            </View>
                            <View style={{ margin: 16 }}>
                                <BouncyCheckbox
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
                                    textComponent={<Text style={{ marginHorizontal: 8 }}>La solicitud no se relaciona con un activo</Text>}
                                />
                            </View>
                            {/* Solicitud */}
                            <Text style={styles.titleInput}>Solicitud*</Text>
                            <TextField
                                placeholder='Solicitud'
                                multiline={false}
                                autoCapitalize='none'
                                maxLength={255}
                                value={subject}
                                onChangeText={(value) => {
                                    onChange(value, 'subject')
                                }}
                            />
                            {/* Tipo de solicitud */}
                            <Text style={styles.titleInput}>Tipo de solicitud*</Text>
                            <View onTouchEnd={() => {
                                setVisibleRequestModal(true)
                            }}>
                                <TextField
                                    placeholder='Tipo de solicitud'
                                    multiline={false}
                                    autoCapitalize='none'
                                    value={requestSelected?.description}
                                    editable={true}
                                    rightIcon={<Icon name="caret-down" size={20} color="black" />}
                                />
                            </View>

                            {/* Prioridad */}
                            <Text style={styles.titleInput}>Prioridad*</Text>
                            <View onTouchEnd={() => {
                                setVisiblePriorityModal(true)
                            }}>
                                <TextField
                                    placeholder='Prioridad'
                                    multiline={false}
                                    autoCapitalize='none'
                                    value={prioritySelected?.description}
                                    editable={false}
                                    rightIcon={<Icon name="caret-down" size={20} color="black" />}
                                />
                            </View>

                            {/* Comentarios */}
                            <Text style={styles.titleInput}>Comentarios</Text>
                            <TextField
                                placeholder='Comentarios'
                                multiline={false}
                                autoCapitalize='none'
                                value={comments}
                                maxLength={255}
                                onChangeText={(value) => {
                                    onChange(value, 'comments')
                                }}
                            />
                            {/* Teléfono de Contacto */}
                            <Text style={styles.titleInput}> Teléfono de Contacto</Text>
                            <TextField
                                placeholder='Teléfono de Contacto'
                                multiline={false}
                                autoCapitalize='none'
                                keyboardType='phone-pad'
                                maxLength={15}
                                value={contact_phone}
                                onChangeText={(value) => {
                                    onChange(value, 'contact_phone')
                                }}
                            />
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
                                    editable={true}
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
                                        bloc.saveTicket({
                                            is_account_location_id: location?.id ?? '',
                                            subject: subject,
                                            es_ticket_priority_cat_id: prioritySelected?.id ?? '',
                                            es_ticket_request_cat_id: requestSelected?.id ?? '',
                                            es_ticket_status_cat_id: 1,
                                            requestor: requestor,
                                            is_asset_main_id: (activeName !== '') ? (active?.id ? active.id : null) : null,
                                            comments: comments,
                                            contact_phone: contact_phone,
                                            is_account_main_id: account,
                                            is_user_profile_id: engineer?.id ?? null,
                                        })
                                    }}
                                    containerStyle={{ alignSelf: 'flex-end' }}
                                    buttonStyle={styles.buttonItemStyle}
                                    titleStyle={styles.buttonTitleStyle} />
                            </View>
                            <PriorityModal />
                            <RequestModal />
                            <LocationModalComponent
                                isVisible={isVisibleLocationModal}
                                idSelected={location?.id ?? null}
                                showAllRow={false}
                                onSelected={(item) => {
                                    setIsVisibleLocationModal(false);
                                    if (item) {
                                        setLocation(item);
                                    } else {
                                        setLocation(null);
                                    }
                                }} onOutsidePressed={() => {
                                    setIsVisibleLocationModal(false);
                                }}
                            />
                            <View style={{ height: 100 }} />
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>

    </>
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
        marginHorizontal: 10,
        marginBottom: 4,
        marginTop: 8
    },
    input: {
        height: 50,
        borderBottomWidth: 1,
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
})