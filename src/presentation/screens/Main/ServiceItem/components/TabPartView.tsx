import {Text} from '@rneui/themed';
import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {BlocBuilder} from '../../../../shared/bloc';
import {ToastModule} from '../../../../shared/components/Toast';
import {getCurrencySettings, stringToCurrency} from '../../../../shared/util/Currency';
import {Part} from '../../../../../domain/ServiceItem/models/Service.model';
import {PartmaterialToService, PartToService, ServiceItemKindParts, ServiceItemState} from '../ServiceItemState';
import {PartItemComponent} from './PartItemComponent';
import {servicesBloc} from './ServiceItemPage';
import {TButton} from '../../../../shared/components/TButton';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PartItem, PartMaterialItem} from '../../PartsSearch/bloc/PartsSearchState';
import {AuthContext} from '../../../../core/Context/AuthContext';
import {Divider} from '../../../../shared/components/Divider';
import {UpdatedWhenChangeContext} from "../../../../context/updateWhenChange/UpdatedWhenChangeContext";
import { LoadingComponent } from '../../../../shared/components/LoadingComponent';

const {width} = Dimensions.get('window');
type activeProps = StackNavigationProp<any, any>;

export interface Props {
    onInitComponent: () => void;
    onChangedPage: (isNextPage: boolean) => void;
    onPartPress: (part: Part) => void;
    hasPermissions: boolean,
    idService: string
}

export const TabPartView = ({onInitComponent, onChangedPage, onPartPress, hasPermissions, idService}: Props) => {

    const {getCurrency} = useContext(AuthContext);
    const [currencyName, setCurrencyName] = useState('');
    const {value, updateServiceTabExpenses} = useContext(UpdatedWhenChangeContext);
    const bloc = servicesBloc();
    const nav = useNavigation<activeProps>();
    useEffect(() => {
        onInitComponent()
        setCurrencyName(bloc.state.data[0].gc_currency_cat_name)
    }, []);

    const getTotalCost = (parts: Part[]): number => {
        const sum = parts.reduce((previous, current) => previous + Number(current.average_cost), 0);
        return sum;
    }

    return (
        <BlocBuilder
            bloc={bloc}
            builder={(state: ServiceItemState) => {
                switch (state.kindParts) {
                    case ServiceItemKindParts.SavePartOfServiceState:
                    case ServiceItemKindParts.DeletePartOfServiceState:
                    case ServiceItemKindParts.LoadingPartsOfServiceState:
                        return (
                            <View style={{width:'100%', height:'100%'}}>
                                <LoadingComponent/> 
                            </View>
                        );
                    case ServiceItemKindParts.LoadedPartsOfServiceState: 
                        return (
                            <View
                                style={{
                                    flex: 0.8,
                                    width: width
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1
                                    }}
                                >
                                    {
                                        state.parts.total_rows === 0 &&
                                        <View style={styles.emptyBox}>
                                            <Text style={styles.emptyTitle}>Sin Partes utilizadas</Text>
                                            <Text style={styles.emptyParagraph}>Aún no se han utilizado partes en el
                                                registro de esta Orden de Servicio.</Text>
                                        </View>
                                    }
                                    {
                                        state.parts.total_rows > 0 &&
                                        <View>
                                            <View style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                                margin: 10
                                            }}>
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                    marginRight: 3
                                                }}> Total: {getCurrencySettings(currencyName)}

                                                </Text>
                                                <Text style={{fontSize: 14}}>
                                                    {
                                                        stringToCurrency(getTotalCost(state.parts.data))
                                                    }
                                                </Text>
                                            </View>

                                            <ScrollView
                                                style={styles.withElementsBox}
                                            >
                                                <FlatList
                                                    data={state.parts.data}
                                                    ItemSeparatorComponent={() => <Divider/>}
                                                    renderItem={({item, index}) => (
                                                        <PartItemComponent
                                                            key={item.id}
                                                            part={item}
                                                            isLast={state.parts.data.length - 1 === index}
                                                            currency={currencyName}
                                                            onOptionPress={(part: Part) => {
                                                                onPartPress(part);
                                                            }}
                                                        />
                                                    )}/>
                                            </ScrollView>
                                        </View>
                                    }
                                </View>
                                {
                                    hasPermissions &&
                                    <TButton
                                        title='Agregar Parte +'
                                        type='secondary'
                                        onPress={() => {
                                            nav.navigate('PartsSearchComponent', {
                                                onReturn: (result: { part: PartItem, material: PartMaterialItem[] }) => {

                                                    var parts: PartToService[] = []
                                                    var partsMaterial: PartmaterialToService[] = []
                                                    result.material.forEach( material => {
                                                        const part: PartToService = {
                                                            is_account_part_id: result.part.id,
                                                            is_account_main_id: bloc.state.data[0].is_account_main_id.toString(),
                                                            gc_currency_cat_id: material.currency,
                                                            unit_price: result.part.unitPrice,
                                                            quantity: 1,
                                                            serial_number: material.serial,
                                                            lot: material.lot,
                                                            arrival_date: new Date().toISOString(),
                                                            expiration_date: material.dueDate,
                                                            is_part_movement_type_cat: 2,
                                                            es_service_main_id: idService,
                                                            related_with_movement_id: material.id,
                                                            es_supplier_main_id: material.supplierId
                                                        };
                                                        
                                                        const partMaterial: PartmaterialToService = {
                                                            es_service_main_id: idService,
                                                            is_account_part_id: result.part.id,
                                                            is_part_material_id: material.id,
                                                            quantity: 1,
                                                            unit_price: result.part.unitPrice,
                                                        }

                                                        parts.push(part)
                                                        partsMaterial.push(partMaterial)
                                                    })

                                                    bloc.setPartOfService(parts, partsMaterial, idService).then(res =>{
                                                        ToastModule.show("success", "Los datos se han guardado correctamente")
                                                        updateServiceTabExpenses(value.updateServiceTabExpenses + 1)
                                                    })
                                                    
                                                }
                                            })
                                        }}
                                        contentStyle={{
                                            alignSelf: 'flex-end',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginEnd: 8,
                                            marginBottom: 56
                                        }}
                                    />
                                }
                            </View>
                        );
                    case 'ErrorPartsOfServiceState':
                        ToastModule.show('error', state.error)
                        return (
                            <View
                                style={styles.container}
                            ></View>
                        )
                    default:
                        return (
                            <View
                                style={styles.container}
                            ></View>
                        );
                }

            }}
        />
    );

    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.8,
        width,
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    emptyBox: {
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 48,
        paddingVertical: 20
    },
    emptyTitle: {
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20
    },
    emptyParagraph: {
        textAlign: 'center'
    },
    withElementsBox: {
        borderColor: '#979797',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 19,
        paddingEnd: 19,
        width: 160,
        backgroundColor: "#F03E7B",
        borderRadius: 8,
        marginTop: 25,
        marginRight: 3
    }
})
