import React, {useContext, useEffect, useState} from "react"
import {Dimensions, ScrollView, StyleSheet, Text, View} from "react-native"
import {TextField} from "../../../../shared/components/TextField";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ServiceData} from "../../../../../domain/ListService/models/Service.model";
import {BlocBuilder} from "../../../../shared/bloc";
import {ServiceItemState} from "../ServiceItemState";
import {servicesBloc} from "./ServiceItemPage";
import {getCurrencySettings, stringToCurrency} from "../../../../shared/util/Currency";
import {TButton} from "../../../../shared/components/TButton";
import * as DependenciesServiceProvider from '../di/ServiceItemProvider';
import {createContext} from "../../../../shared/bloc/ContextFactory";
import {ServiceItemBloc, TabService} from "../ServiceItemBloc";
import {LoadingComponent} from "../../../../shared/components/LoadingComponent";
import {UpdatedWhenChangeContext} from "../../../../context/updateWhenChange/UpdatedWhenChangeContext";

const {width} = Dimensions.get('window');

const [internalServicesBlock, internalUseServicesBloc] = createContext<ServiceItemBloc>();
export const internalServicebloc = internalUseServicesBloc;

export const TabExpensesComponent = () => {
    return (
        <internalServicesBlock.Provider value={DependenciesServiceProvider.provideServiceItemBloc()}>
            <TabExpensesView/>
        </internalServicesBlock.Provider>
    )
}

export const TabExpensesView = () => {
    /**
     * Data.
     */
    const [modality, setModality] = useState('');
    const [totalExpense, setTotalExpense] = useState('');
    const [partExpense, setPartExpense] = useState('');
    const [workExpense, setWorkExpense] = useState('');
    const [time, setTime] = useState('');
    const [currencyName, setCurrencyName] = useState('');
    const [currencyValue, setCurrencyValue] = useState('');
    const [currentServiceData, setCurrentServiceData] = useState<ServiceData | undefined>()
    const [isValidSave, setIsValidSave] = useState<boolean | undefined>(false);
    const [isFirstTime, setIsFirstTime] = useState(true)
    const serviceItemBloc = servicesBloc();
    const internalServiceBloc = internalServicebloc()
    const {value} = useContext(UpdatedWhenChangeContext);

    useEffect(() => {
        let workLabor = Number(workExpense.replace(currencyName, "").replace(",", ""))
        let part = Number(partExpense.replace(currencyName, "").replace(",", ""))
        setTotalExpense(currencyName + stringToCurrency(Number(part ?? 0) + Number(workLabor ?? 0)))
        let flag = (Number(currentServiceData?.service_labor_cost ?? 0) != workLabor)
        setIsValidSave(flag);
    }, [workExpense])

    const initForm = (serviceData: ServiceData | undefined) => {
        let currency = getCurrencySettings(serviceData?.gc_currency_cat_name ?? "")
        setCurrencyName(serviceData?.gc_currency_cat_name ?? "")
        if (serviceData?.gc_currency_cat_name) {
            setCurrencyValue(currency)
        }
        if (serviceData?.es_supplier_main_id == 1) {
            setModality('Interno')
            if (serviceData?.workforce_expense)
                setWorkExpense(currency + stringToCurrency(Number(serviceData?.workforce_expense)))
        } else {
            setModality('Subrogado')
            if (serviceData?.service_labor_cost)
                setWorkExpense(currency + stringToCurrency(Number(serviceData?.service_labor_cost)))
        }
        if (serviceData?.total_expense) {
            setTotalExpense(currency + stringToCurrency(Number(serviceData?.total_expense)))
        }
        if (serviceData?.parts_expense) {
            setPartExpense(currency + stringToCurrency(Number(serviceData?.parts_expense)))

        }

        if (serviceData?.es_supplier_main_id != 1)
            setTotalExpense(currency + stringToCurrency(Number(serviceData?.parts_expense) + Number(serviceData?.service_labor_cost)))

        setTime(serviceData?.hours + " horas " + serviceData?.minutes + " minutos ")
    }

    const updateService = () => {
        internalServiceBloc.updateServiceR(`${currentServiceData?.id}`, {
            service_cost: workExpense.replace(currencyValue, '').replace(/ /g, '').replace(",", ""),
            service_labor_cost: workExpense.replace(currencyValue, '').replace(/ /g, '').replace(",", "")
        }, TabService.Expenses)
    }

    return (
        <View>
            <BlocBuilder
                bloc={internalServiceBloc}
                builder={(state: ServiceItemState) => {
                    if (state.kindServiceTabs === 'LoadingUpdateExpensesViewState') {
                        return <View style={{height: '100%', width}}>
                            <LoadingComponent/>
                        </View>
                    } else {
                        return <></>
                    }
                }}
            />
            <View
                style={{
                    flex: 1,
                    width,
                    paddingVertical: 15,
                    paddingHorizontal: 10
                }}>
                <BlocBuilder
                    bloc={serviceItemBloc}
                    builder={(state: ServiceItemState) => {
                        if (state.kind === 'LoadedProviderServiceItemState') {
                            if (isFirstTime) {
                                setCurrentServiceData(state.data[0])
                                initForm(state.data[0])
                                setIsFirstTime(false)
                            }
                        }
                        return <></>
                    }}
                />
                <ScrollView>
                    <View
                        style={{
                            flex: 1,
                            marginBottom: 10,
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingVertical: 14
                        }}>
                        <Text style={styles.InputHeader}>Modalidad de Servicio</Text>
                        <TextField
                            multiline={false}
                            autoCapitalize='none'
                            value={modality}
                            editable={false}
                        />
                        <Text style={styles.InputHeader}>Duración</Text>
                        <TextField
                            multiline={false}
                            value={time}
                            editable={false}
                        />
                        <Text style={styles.InputHeader}>Moneda</Text>
                        <TextField
                            multiline={false}
                            editable={false}
                            value={currencyName}
                        />

                    </View>
                    {
                        modality == 'Interno' &&
                        <View
                            style={{
                                flex: 1,
                                marginBottom: 10,
                                borderWidth: 1,
                                borderRadius: 10,
                                paddingVertical: 14
                            }}>
                            <Text style={styles.InputHeaderExt}>Gasto Interno</Text>
                            <Text style={styles.InputHeader}>Mano de Obra</Text>
                            <TextField
                                multiline={false}
                                editable={false}
                                value={workExpense}
                            />
                            <Text style={styles.InputHeader}>Gasto en Partes</Text>
                            <TextField
                                multiline={false}
                                editable={false}
                                value={partExpense}
                            />
                            <Text style={styles.InputHeader}>Total</Text>
                            <TextField
                                multiline={false}
                                editable={false}
                                value={totalExpense}
                            />
                        </View>
                    }
                    {
                        modality == 'Subrogado' &&
                        <View
                            style={{
                                flex: 1,
                                marginBottom: 10,
                                borderWidth: 1,
                                borderRadius: 10,
                                paddingVertical: 14
                            }}>
                            <Text style={styles.InputHeaderExt}>Gasto Externo</Text>
                            <Text style={styles.InputHeader}>Costo de Servicio</Text>

                            <TextField
                                multiline={false}
                                editable={true}
                                value={workExpense}
                                onChangeText={newText => {
                                    if (newText.length >= currencyName.length) {
                                        setWorkExpense(newText)
                                    }
                                }}
                            />
                            <Text style={styles.InputHeader}>Gasto en Partes</Text>
                            <TextField
                                multiline={false}
                                editable={false}
                                value={partExpense}
                            />
                            <Text style={styles.InputHeader}>Total</Text>
                            <TextField
                                multiline={false}
                                editable={false}
                                value={totalExpense}
                            />

                        </View>
                    }
                    {
                        modality == 'Subrogado' &&
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
        </View>

    )
}

const styles = StyleSheet.create({
    InputHeader: {
        color: "#908E8E",
        fontSize: 14,
        marginTop: 10,
        marginLeft: 13
    },
    InputHeaderExt: {
        color: "#908E8E",
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 13
    }
})