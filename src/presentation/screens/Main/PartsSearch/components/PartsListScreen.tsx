import { StackScreenProps } from "@react-navigation/stack";
import { Input } from "@rneui/base";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { partsSearchModule } from "../../../../../di/PartsSearch/ProviderPartsSearch";
import { AuthContext } from "../../../../core/Context/AuthContext";
import { BlocBuilder } from "../../../../shared/bloc";
import { createContext } from "../../../../shared/bloc/ContextFactory";
import { Divider } from "../../../../shared/components/Divider";
import { HeaderCustomScreen } from "../../../../shared/components/HeaderCustomScreen";
import { FontelloIcon } from "../../../../shared/components/Icon";
import { LoadingComponent } from "../../../../shared/components/LoadingComponent";
import { ToastModule } from "../../../../shared/components/Toast";
import { TouchableFeedback } from "../../../../shared/components/TouchableFeedback";
import { useForm } from "../../../../shared/hooks/useForm";
import { RootStackParams } from "../../../../shared/navigation/MainNavigator";
import { PartsSearchBloc } from "../bloc/PartsSearchBloc";
import { PartItem, PartMaterialItem, PartsSearchKinds, PartsSearchState } from "../bloc/PartsSearchState";
import { PartSearchItemView } from "./PartItemView";
import uuid from 'react-native-uuid';

const [partsSearchBlocContext, useBloc] = createContext<PartsSearchBloc>();
export const partSearchBloc = useBloc;


export interface PartsSearchProps
    extends StackScreenProps<RootStackParams, 'PartsSearchComponent'> { }

export const PartsSearchComponent = ({ navigation, route }: PartsSearchProps) => {
    return (
        <partsSearchBlocContext.Provider value={partsSearchModule.providePartsSearchBloc()}>
            <UserSearchList navigation={navigation} route={route} />
        </partsSearchBlocContext.Provider>
    );
};


export const UserSearchList = ({ navigation, route }: PartsSearchProps) => {
    const { account } = useContext(AuthContext);
    const bloc = partSearchBloc();
    const [itemSelected, setItemSelected] = useState<PartItem>();
    const { search, onChange } = useForm({ search: '' });
    const [orderAsc, setOrderAsc] = useState(true);
    const [itemsMaterialSelected, setitemsMaterialSelected] = useState<PartMaterialItem[]>([])

    useEffect(() => {
        bloc.loadParts(1000, account)
    }, [account]);

    return (
        <SafeAreaView style={styles.AndroidSafeArea}>
            <View style={{ flex: 1 }}>
                {/* Header */}
                <HeaderCustomScreen
                    title="Seleccionar Partes"
                    titleButtonRight="Agregar"
                    onBack={() => {
                        navigation.goBack();
                    }}
                    onContinue={() => {
                        if (itemSelected) {
                            route.params.onReturn({ part: itemSelected, material: itemsMaterialSelected });
                            navigation.goBack();
                        } else {
                            ToastModule.show('error', 'Selecciona un material para continuar');
                        }
                    }}
                />
                <View style={styles.containerSearch}>
                    <Input
                        multiline={false}
                        autoCapitalize="none"
                        clearTextOnFocus
                        onFocus={() => {
                            onChange('', 'search')
                            bloc.filterData('');
                        }}
                        containerStyle={{
                            height: 36,
                        }}
                        inputContainerStyle={styles.searchInput}
                        placeholder="Buscar parte"
                        shake={() => { }}
                        value={search}
                        onChangeText={value => {
                            onChange(value, 'search');
                            bloc.filterData(value);
                        }}
                        onSubmitEditing={() => {
                            bloc.filterData(search);
                        }}
                        returnKeyType="search"
                        leftIcon={<FontelloIcon name="012-search" size={20} />}
                    />
                    <View
                        style={{
                            marginHorizontal: 16,
                            marginTop: 8,
                            alignSelf: 'flex-start',
                        }}>
                        <TouchableFeedback
                            onPress={() => {
                                setOrderAsc(!orderAsc);
                                bloc.orderData(!orderAsc);
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <FontelloIcon
                                    style={{ marginTop: 7, marginRight: 5 }}
                                    name="013-up-down"
                                    size={14}
                                    color="black"
                                />
                                <Text
                                    style={{
                                        fontSize: 14,
                                        marginTop: 7,
                                    }}>
                                    Nombre ({orderAsc ? 'A-Z' : 'Z-A'})
                                </Text>
                            </View>
                        </TouchableFeedback>
                    </View>
                </View>
                <BlocBuilder
                    bloc={bloc}
                    builder={(state: PartsSearchState) => {
                        if (state.kind === PartsSearchKinds.ErrorPartsSearchState) {
                            ToastModule.show('error', state.error)
                        }
                        return (
                            <View style={{ flex: 1 }}>
                                <>
                                    {
                                        state.kind === PartsSearchKinds.LoadingPartsSearchState &&
                                        <View style={{
                                            width: '100%',
                                            height: '100%'
                                        }}>
                                            <LoadingComponent />
                                        </View>
                                    }
                                </>
                                <FlatList
                                    data={state.filterData}
                                    renderItem={({ item }): any => (
                                        <PartSearchItemView
                                            item={item}
                                            materialsSelected={itemsMaterialSelected}
                                            onPress={item => {
                                                setItemSelected(item);
                                                bloc.loadMaterials(item.id, account);
                                            }}
                                            onItemSelected={(item, isChecked) => {
                                                if (isChecked) {
                                                    const exist = itemsMaterialSelected.filter((element) => element.id === item.id).length > 0;
                                                    if (!exist) {
                                                        setitemsMaterialSelected([...itemsMaterialSelected, item]);
                                                    }
                                                } else {
                                                    const withoutItem = itemsMaterialSelected.filter((element) => element.id !== item.id);
                                                    setitemsMaterialSelected(withoutItem);
                                                }
                                            }} />
                                    )}
                                    keyExtractor={(item, index) => `${uuid.v4()}`}
                                    ItemSeparatorComponent={() => <Divider />}
                                />

                            </View>
                        )
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    containerSearch: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        marginHorizontal: 4,
        borderWidth: 1,
        backgroundColor: '#FFF',
        borderColor: '#D8D8D8',
        borderRadius: 10,
    },
    searchInput: {
        height: 36,
        alignSelf: 'center',
        backgroundColor: '#EEEEEE',
        borderWidth: 1,
        borderColor: '#D8D8D8',
        paddingHorizontal: 10,
        borderRadius: 32 / 2,
    },
});
