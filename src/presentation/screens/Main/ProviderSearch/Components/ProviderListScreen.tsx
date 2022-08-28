import { StackScreenProps } from '@react-navigation/stack'
import { CheckBox, Input, Text } from '@rneui/themed'
import React, { useEffect, useState } from 'react'
import { withSSR } from 'react-i18next'
import { FlatList, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native'
import { BlocBuilder } from '../../../../shared/bloc'
import { createContext } from '../../../../shared/bloc/ContextFactory'
import { Divider } from '../../../../shared/components/Divider'
import { HeaderCustomScreen } from '../../../../shared/components/HeaderCustomScreen'
import { FontelloIcon } from '../../../../shared/components/Icon'
import { LoadingComponent } from '../../../../shared/components/LoadingComponent'
import { ToastModule } from '../../../../shared/components/Toast'
import { TouchableFeedback } from '../../../../shared/components/TouchableFeedback'
import { useForm } from '../../../../shared/hooks/useForm'
import { RootStackParams } from '../../../../shared/navigation/MainNavigator'
import { providerSearchModule } from '../di/ProviderSearchProvider'
import { ProviderSearchBloc } from '../ProviderSearchBloc'
import { ProviderItem, ProviderSearchState } from '../ProviderSearchState'
import { ProviderItemView } from './ProviderItemView'

// LLamar al componente con navigation y pasar el delegado

const [providerSearchBlock, useBloc] = createContext<ProviderSearchBloc>();
export const providerSearchBloc = useBloc;

export interface ProviderListProps extends StackScreenProps<RootStackParams, 'ProviderListScreen'> { }

export const ProviderSearchListScreenComponent = ({ navigation, route }: ProviderListProps) => {
    return (
        <providerSearchBlock.Provider value={providerSearchModule.provideProviderSearchBloc()}>
            <ProviderListScreen navigation={navigation} route={route} />
        </providerSearchBlock.Provider>
    )
}

export const ProviderListScreen = ({ navigation, route }: ProviderListProps) => {

    const [itemSelected, setItemSelected] = useState<ProviderItem>()
    const bloc = providerSearchBloc()
    const { search, onChange } = useForm({ search: '' });
    const [isSelected, setIsSelected] = useState(false)
    const [orderAsc, setOrderAsc] = useState(true);

    useEffect(() => {
        bloc.loadProviderSearch()
    }, [])

    const loadMoreData = () => {
        bloc.loadProviderSearch(undefined, true)
    }

    return (
        <SafeAreaView style={styles.AndroidSafeArea}>
            <View style={{ flex: 1 }} >
                {/* Header */}
                <HeaderCustomScreen
                    title='Seleccionar Proveedor'
                    titleButtonRight=""
                    onBack={() => { navigation.goBack() }}
                    onContinue={() => {
                        if (itemSelected) {
                            route.params.onReturn(itemSelected)
                            navigation.goBack()
                        } else {
                            ToastModule.show('error', 'Selecciona un proveedor para continuar')
                        }
                    }}
                />
                {/* INPUT BUSCADOR */}
                <View style={styles.containerSearch}>
                    <Input
                        multiline={false}
                        autoCapitalize='none'
                        clearTextOnFocus
                        onFocus={() => {
                            onChange('', 'search')
                            bloc.loadProviderSearch({
                                perPage: 1000,
                                page: 1,
                                sortDirection: orderAsc ? 'ASC' : 'ASC',
                                textQuery: ''
                            }, false)
                        }}
                        containerStyle={{
                            height: 35,
                        }}
                        inputContainerStyle={styles.searchInput}
                        placeholder='Buscar Proveedor'
                        shake={() => { }}
                        onChangeText={(value) => {
                            onChange(value, 'search')
                            if (value === '') {
                                bloc.loadProviderSearch({
                                    perPage: 1000,
                                    page: 1,
                                    sortDirection: orderAsc ? 'ASC' : 'ASC',
                                    textQuery: ''
                                }, false)
                            }
                        }}
                        value={search}
                        onSubmitEditing={() => {
                            bloc.loadProviderSearch({
                                perPage: 1000,
                                page: 1,
                                sortDirection: orderAsc ? 'ASC' : 'ASC',
                                textQuery: search
                            }, false)
                        }}
                        returnKeyType='search'
                        leftIcon={
                            <FontelloIcon
                                name='012-search'
                                size={20} />
                        }
                    />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent:'space-around',
                        width:'100%'
                    }}>
                        <View style={{
                            alignItems: 'center',
                            marginLeft:-15
                        }}>
                            <TouchableFeedback
                                contentStyle={{
                                    flex: 1,
                                }}
                                onPress={() => {
                                    setOrderAsc(!orderAsc);
                                    bloc.loadProviderSearch({
                                        perPage: 1000,
                                        page: 1,
                                        sortDirection: !orderAsc ? 'ASC' : 'DESC',
                                        textQuery: search
                                    }, false)
                                }}>
                                <View style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <FontelloIcon
                                        style={{ marginRight: 5 }}
                                        name='013-up-down'
                                        size={14}
                                        color='black'
                                    />
                                    <Text
                                        style={{
                                            fontSize: 14,
                                        }}>
                                        Nombre ({orderAsc ? 'A-Z' : 'Z-A'})
                                    </Text>
                                </View>
                            </TouchableFeedback>
                        </View>
                        <View style={{ marginRight:-40}} >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent:'flex-end'
                            }}>
                                <Text style={styles.fontCheck}> Depto. de Ing. Biómedica </Text>
                                <CheckBox
                                    containerStyle={{
                                        display: 'flex'
                                    }}
                                    onPress={() => {
                                        setIsSelected(!isSelected)
                                        bloc.loadProviderSearch({
                                            perPage: 1000,
                                            page: 1,
                                            sortDirection: orderAsc ? 'ASC' : 'ASC',
                                            textQuery: !isSelected ? 'Depto. Ing. Biomédica'.toLocaleLowerCase() : ''
                                        }, false)

                                    }}
                                    checked={isSelected} />
                            </View>

                        </View>
                        
                    </View>
                </View>
                {/* END: INPUT BUSCADOR */}
                <BlocBuilder
                    bloc={bloc}
                    builder={(state: ProviderSearchState) => {
                        return <FlatList
                            data={state.data.items}
                            renderItem={({ item }): any => (
                                <ProviderItemView
                                    item={item}
                                    onPress={(item) => {
                                        bloc.setSeelected(item)
                                        setItemSelected(item)
                                        route.params.onReturn(item)
                                    navigation.goBack()
                                    }}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={() => <Divider />}
                            onEndReached={loadMoreData}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={() => {
                                switch (state.kind) {
                                    case 'LoadingProviderSearchState':
                                        return (
                                            <View style={{ flex: 1 }}>
                                                <LoadingComponent />
                                            </View>
                                        );
                                    case 'LoadedProviderSearchState':
                                        return (<View style={{
                                            height: 200
                                        }} />)
                                    case 'ErrorProviderSearchState':
                                        return (<>
                                            {ToastModule.show('error', state.error)}
                                            <View style={{
                                                height: 200
                                            }} />
                                        </>)
                                    default: return <></>
                                }
                            }}
                        />
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
    },
    containerSearch: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        borderRadius: 10,
        height:100

    },
    searchInput: {
        height: 36,
        alignSelf: 'center',
        backgroundColor: '#EEEEEE',
        borderWidth: 1,
        borderColor: '#D8D8D8',
        paddingHorizontal: 10,
        borderRadius: 32 / 2
    },
    fontCheck: {
        fontSize: 12,
        marginEnd: -11,
        fontWeight: '400',
        color: '#000'
    }
});