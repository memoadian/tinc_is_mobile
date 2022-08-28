import React, {useEffect, useState} from "react"
import {Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native"
import {Dimensions} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {servicesBloc} from "./ServiceItemPage";
import {BlocBuilder} from '../../../../shared/bloc';
import {ServiceItemState} from "../ServiceItemState";
import DatePicker from "react-native-date-picker";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {geDate, simpleDateFormat, simpleDateFormatddmmyyyy} from "../../../../shared/util/Date";
import {Input} from "@rneui/themed";
import {ServiceData} from "../../../../../domain/ListService/models/Service.model";
import {GeneralStyles} from "../../../../shared/styles/generalStyles";
import {TextField} from "../../../../shared/components/TextField";
import {TButton} from "../../../../shared/components/TButton";
import {useNavigation} from "@react-navigation/native";
import {UserItem} from "../../UserSearch/UserSearchState";
import {createContext} from "../../../../shared/bloc/ContextFactory";
import {ServiceItemBloc, TabService} from "../ServiceItemBloc";
import * as DependenciesServiceProvider from '../di/ServiceItemProvider';
import {LoadingComponent} from "../../../../shared/components/LoadingComponent";
import {ItemUnicSelection, PresentantionModal} from "../../../../shared/components/Selections";
import {AppCatalogs} from "../../../../config/catalogs";
import {Divider} from "react-native-paper";
import { DetailServiceRequest } from "../../../../../domain/ServiceItem/models/Service.model";

const {width} = Dimensions.get('window');

export interface Props {
    hasPermissions: boolean
}

const [internalServicesBlock, internalUseServicesBloc] = createContext<ServiceItemBloc>();
export const internalServicebloc = internalUseServicesBloc;

export const TabDetailServiceComponent = (props: Props) => {
    return (
        <internalServicesBlock.Provider value={DependenciesServiceProvider.provideServiceItemBloc()}>
            <TabDetailServicePage
                hasPermissions={props.hasPermissions}/>
        </internalServicesBlock.Provider>
    )
}

export const TabDetailServicePage = ({hasPermissions}: Props) => {
    const internalServiceBloc = internalServicebloc()
    const nav = useNavigation();
    const serviceItemBloc = servicesBloc();
    const [isVisibleStartDatePickerState, setVisibilityStartDatePicker] = useState(false);
    const [isVisibleEndDatePickerState, setVisibilityEndDatePicker] = useState(false);
    const [currentServiceData, setCurrentServiceData] = useState<ServiceData | undefined>()
    const [isValidSave, setIsValidSave] = useState(false)
    const [isRepair, setIsRepair] = useState(false);

    /**
     * Data
     */
    const [engineerName, setEngineerName] = useState<string | undefined>('');
    const [engineerId, setEngineerId] = useState('');
    const [hours, setHours] = useState<string | undefined>('');
    const [minutes, setMinutes] = useState<string | undefined>('');
    const [summary, setSummary] = useState<string | undefined>('');
    const [description, setDescription] = useState<string | undefined>('');
    const [conclusion, setConclusion] = useState<string | undefined>('');
    const [startDate, setStartDate] = useState<string | undefined>();
    const [endDate, setEndDate] = useState<string | undefined>();
    const [height, setHeight] = useState(20)
    const [heightD, setHeightD] = useState(20)
    const [heightC, setHeightC] = useState(20)
    const [isVisibleFailureModal, setIsVisibleFailureModal] = useState(false);
    const [failureSelected, setFailureSelected] = useState<any>();

    useEffect(() => {
        initForm(currentServiceData)
    }, [currentServiceData]);

    useEffect(() => {
        let flag =
            (currentServiceData?.assigned_technician_from_fk !== engineerName) ||
            (currentServiceData?.hours !== hours) ||
            (currentServiceData?.minutes !== minutes) ||
            (currentServiceData?.summary !== summary) ||
            (currentServiceData?.description !== description) ||
            (currentServiceData?.start_date !== startDate) ||
            (currentServiceData?.end_date !== endDate) ||
            (currentServiceData?.conclusion !== conclusion) ||
            (failureSelected !== undefined && currentServiceData?.es_service_failure_reason_cat_id !== failureSelected?.id)
        setIsValidSave(flag as boolean)
    }, [engineerName, hours, minutes, summary, description, conclusion, startDate, endDate, failureSelected])

    const initForm = (serviceData: ServiceData | undefined) => {
        setEngineerName(serviceData?.assigned_technician_from_fk)
        setHours(serviceData?.hours)
        setMinutes(serviceData?.minutes)
        setSummary(serviceData?.summary)
        setDescription(serviceData?.description)
        setConclusion(serviceData?.conclusion)
        setFailureSelected(AppCatalogs.es_service_failure_reason_cat.find(x => x.id == serviceData?.es_service_failure_reason_cat_id))
        setEndDate(serviceData?.end_date)
        setStartDate(serviceData?.start_date)
        setIsRepair(serviceData?.es_service_type_cat_id == 3)
    }

    const updateService = () => {
        var detail : DetailServiceRequest = {
            is_user_profile_id: engineerId,
            assigned_technician: engineerName,
            start_date: startDate,
            end_date: endDate,
            hours: hours,
            minutes: minutes,
            summary: summary,
            conclusion: conclusion,
            description: description, 
            es_service_status_cat_id: currentServiceData?.es_service_status_cat_id?.toString(),
            es_service_failure_reason_cat_id: failureSelected?.id ?? null
        }
        if(
                (detail.es_service_status_cat_id != "5" && detail.es_service_status_cat_id != "6") &&
                detail.is_user_profile_id != null && 
                detail.start_date != null && 
                detail.end_date != null && 
                detail.summary != "" &&  detail.summary != null &&
                detail.description != "" && detail.description != null && 
                detail.conclusion  != "" && detail.conclusion  != null &&
                ((detail.hours ?? 0) > 0 || (detail.minutes ?? 0) > 0)
            )
            {
                Alert.alert(
                    "Conclusión de Servicio",
                    '¿Deseas cambiar el Estatus de este Servicio a "Concluido"?', 
                    [
                        {
                            text: "Cancelar",
                            style: 'destructive'
                        },
                        {
                            text: "Concluir",
                            style: 'destructive',
                            onPress: () => {
                                detail.es_service_status_cat_id = "5";
                                internalServiceBloc.updateServiceR(currentServiceData?.id.toString(), detail, TabService.DetailView)
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
            else
            {
                internalServiceBloc.updateServiceR(currentServiceData?.id.toString(), detail, TabService.DetailView)
            }
    }

    const FailureModal = () => (
        <PresentantionModal
            isVisible={isVisibleFailureModal}
            onOutsidePressed={() => {
                setIsVisibleFailureModal(false)
            }}
        >
            <View style={styles.modal}>
                <FlatList
                    data={AppCatalogs.es_service_failure_reason_cat}
                    renderItem={({item}: any) => (
                        <ItemUnicSelection
                            title={item.description}
                            value={item}
                            checked={failureSelected?.id === item.id}
                            onPressed={(value, checked) => {
                                setIsVisibleFailureModal(false)
                                setFailureSelected(value)
                            }}/>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => <Divider/>}
                />
            </View>
        </PresentantionModal>
    );

    return (
        <View>
            <BlocBuilder
                bloc={internalServiceBloc}
                builder={(state: ServiceItemState) => {
                    if (state.kindServiceTabs === 'LoadingUpdateDetailViewState') {
                        return <View style={{height: '100%', width}}>
                            <LoadingComponent/>
                        </View>
                    } else {
                        return <></>
                    }
                }}
            />
            <BlocBuilder
                bloc={serviceItemBloc}
                builder={(state: ServiceItemState) => {
                    if (state.kind === 'LoadedProviderServiceItemState') {
                        let serviceData = state.data[0];
                        setCurrentServiceData(serviceData)
                        if (serviceData.start_date) {
                            const thisStartDate = geDate(serviceData.start_date);
                            const thisEndDate = geDate(serviceData.end_date);
                            if (thisStartDate.getTime() !== geDate(startDate).getTime()) {
                                setStartDate(startDate);
                            }
                            if (thisEndDate.getTime() !== geDate(endDate).getTime()) {
                                setEndDate(endDate);
                            }
                        }
                        return (
                            <View
                                style={{
                                    flex: 1,
                                    width,
                                    paddingVertical: 15,
                                    paddingHorizontal: 10,
                                }}
                            >
                                <ScrollView>
                                    <View
                                        style={{
                                            flex: 1,
                                            marginBottom: 10,
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            paddingVertical: 14
                                        }}>
                                        <Text style={styles.InputHeader}>Ing. Asignado</Text>
                                        <View onTouchEnd={() => {
                                            nav.navigate('UserSearchComponent', {
                                                onReturn: (item: UserItem) => {
                                                    setEngineerName(item.fullname)
                                                    setEngineerId(item.id)
                                                }
                                            })
                                        }}>
                                            <TextField
                                                placeholder='Ing. asignado'
                                                value={engineerName}
                                                editable={false}
                                                onChangeText={newText => {
                                                    setEngineerName(newText)
                                                }}
                                                rightIcon={
                                                    <Icon name="search" size={20} color="black"/>
                                                }
                                            />
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row"
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flex: 1
                                                }}
                                            >
                                                <Text
                                                    style={[styles.InputHeader]}
                                                >Fecha de Inicio</Text>
                                                <DatePicker
                                                    modal
                                                    mode="date"
                                                    locale={'es'}
                                                    title={'Selecciona la fecha'}
                                                    open={isVisibleStartDatePickerState}
                                                    cancelText="Cancelar"
                                                    confirmText="Confirmar"
                                                    date={geDate(startDate)}
                                                    onConfirm={date => {
                                                        setVisibilityStartDatePicker(false);
                                                        setStartDate(simpleDateFormat(date));
                                                    }}
                                                    onCancel={() => {
                                                        setVisibilityStartDatePicker(false)
                                                    }}
                                                />
                                                <TextField
                                                    rightIcon={<Icon name="calendar-alt" size={20} color="black"/>}
                                                    onPressIn={() => {
                                                        if (hasPermissions) {
                                                            setVisibilityStartDatePicker(true)
                                                        }
                                                    }}
                                                    value={startDate}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    flex: 1
                                                }}
                                            >
                                                <Text
                                                    style={[styles.InputHeader]}
                                                >Fecha de Fin</Text>
                                                <DatePicker
                                                    modal
                                                    mode="date"
                                                    locale={'es'}
                                                    title={'Selecciona la fecha'}
                                                    open={isVisibleEndDatePickerState}
                                                    date={geDate(endDate)}
                                                    cancelText="Cancelar"
                                                    confirmText="Confirmar"
                                                    onConfirm={date => {
                                                        setVisibilityEndDatePicker(false);
                                                        setEndDate(simpleDateFormat(date));
                                                    }}
                                                    onCancel={() => {
                                                        setVisibilityEndDatePicker(false)
                                                    }}/>
                                                <TextField
                                                    rightIcon={<Icon name="calendar-alt" size={20} color="black"/>}
                                                    onPressIn={() => {
                                                        if (hasPermissions) {
                                                            setVisibilityEndDatePicker(true)
                                                        }
                                                    }}
                                                    value={endDate}
                                                />
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row"
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flex: 1
                                                }}
                                            >
                                                <Text
                                                    style={[styles.InputHeader]}
                                                >Duración (hrs)</Text>
                                                <TextField
                                                    multiline={false}
                                                    maxLength={3}
                                                    keyboardType={'numeric'}
                                                    value={hours}
                                                    onChangeText={newText => {
                                                        setHours(newText)
                                                    }}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    flex: 1
                                                }}
                                            >
                                                <Text
                                                    style={[styles.InputHeader]}
                                                >Duración (mins)</Text>
                                                <TextField
                                                    value={minutes}
                                                    keyboardType={'numeric'}
                                                    onChangeText={newText => {
                                                        setMinutes(newText)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View
                                        style={[GeneralStyles.simpleCardView, styles.marginTopCardView]}>
                                        <Text
                                            style={[styles.InputHeader]}
                                        >Resumen del servicio</Text>
                                        <TextInput
                                            value={summary}
                                            //   inputContainerStyle={styles.inputDate}
                                            //   inputStyle={{ fontWeight: 'bold', fontSize: 12 }}
                                            //    shake={() => { }}
                                            multiline
                                            onChangeText={newText => {
                                                setSummary(newText)
                                            }}
                                            style={{
                                                height: height,
                                                borderBottomColor: 'black',
                                                borderBottomWidth: 1,
                                                marginLeft: 15,
                                                marginRight: 18
                                            }}
                                            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                                        />
                                        <Text
                                            style={[styles.InputHeader]}
                                        >Descripción del servicio</Text>
                                        <TextInput
                                            value={description}
                                            //  inputContainerStyle={styles.inputDate}
                                            //  inputStyle={styles.textContent}
                                            //  shake={() => { }}

                                            multiline={true}
                                            onChangeText={newText => {
                                                setDescription(newText)
                                            }}
                                            style={{
                                                height: heightD,
                                                borderBottomColor: 'black',
                                                borderBottomWidth: 1,
                                                marginLeft: 15,
                                                marginRight: 18
                                            }}
                                            onContentSizeChange={e => setHeightD(e.nativeEvent.contentSize.height)}
                                        />
                                        <Text
                                            style={[styles.InputHeader]}
                                        >Conclusiones</Text>
                                        <TextInput
                                            value={conclusion}
                                            //  inputContainerStyle={styles.inputDate}
                                            //  inputStyle={styles.textContent}
                                            //  shake={() => { }}
                                            multiline={true}
                                            onChangeText={newText => {
                                                setConclusion(newText)
                                            }}
                                            style={{
                                                height: heightC,
                                                borderBottomColor: 'black',
                                                borderBottomWidth: 1,
                                                marginLeft: 15,
                                                marginRight: 18,
                                                marginBottom: 18
                                            }}
                                            onContentSizeChange={e => setHeightC(e.nativeEvent.contentSize.height)}
                                        />
                                        <FailureModal/>
                                        {
                                            isRepair &&
                                            <TextField
                                                placeholder='Motivo de la falla'
                                                multiline={false}
                                                autoCapitalize='none'
                                                value={failureSelected?.description}
                                                editable={false}
                                                onPressIn={() => {
                                                    setIsVisibleFailureModal(true)
                                                }}
                                                onRightIcon={() => {
                                                    setIsVisibleFailureModal(true)
                                                }}
                                                rightIcon={<Icon name="caret-down" size={24} color="black"/>}
                                            />
                                        }
                                    </View>
                                    {
                                        hasPermissions &&

                                        <TButton
                                            styleButton={{marginTop: 10}}
                                            title='Guardar'
                                            type='secondary'
                                            disable={!isValidSave}
                                            onPress={() => {

                                                updateService()
                                            }}
                                            contentStyle={{
                                                flex: 0.2,
                                                alignSelf: 'flex-end',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginEnd: 8,
                                                marginBottom: 16,
                                            }}
                                        />
                                    }
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            marginTop: 31,
                                            marginBottom: 31

                                        }}
                                    >
                                    </View>
                                </ScrollView>
                            </View>
                        )
                    } else {
                        return <></>
                    }
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        color: "#908E8E",
        fontSize: 10,
        marginTop: 15,
        marginLeft: 13

    },
    InputHeader: {
        color: "#908E8E",
        fontSize: 14,
        marginTop: 10,
        marginLeft: 13
    },
    textContent: {
        fontSize: 12,
        color: "#000000",
        fontWeight: 'bold'
    },
    marginTopCardView: {
        marginTop: 20
        , paddingVertical: 14
    },
    container: {
        flex: 1,
    },
    inputDate: {
        margin: 0,
        padding: 0
    },
    margin: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    fontWhite: {
        color: '#ffffff',
    },
    button: {
        alignItems: "center",
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 19,
        paddingEnd: 19,
        width: 93,
        backgroundColor: "#F03E7B",
        borderRadius: 8,
        marginTop: 25,
        marginRight: 3
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
});
