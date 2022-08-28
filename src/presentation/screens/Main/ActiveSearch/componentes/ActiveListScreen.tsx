import { StackScreenProps } from '@react-navigation/stack'
import { Input, Text } from '@rneui/themed'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native'
import { AuthContext } from '../../../../core/Context/AuthContext'
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
import { ActiveSearchBloc } from '../bloc/ActiveSearchBloc'
import { ActiveItem, ActiveSearchState } from '../bloc/ActiveSearchState'
import { activeSearchModule } from '../di/ActiveSearchProvider'
import { ActiveItemView } from './ActiveItemView'

// LLamar al componente con navigation y pasar el delegado

const [activeSearchBlock, useBloc] = createContext<ActiveSearchBloc>();
export const activeSearchBloc = useBloc;

export interface ActiveListProps extends StackScreenProps<RootStackParams, 'ActiveSearchListScreenComponent'> { }

export const ActiveSearchListScreenComponent = ({ navigation, route }: ActiveListProps) => {
    return (
        <activeSearchBlock.Provider value={activeSearchModule.provideActiveSearchBloc()}>
            <ActiveListScreen navigation={navigation} route={route} />
        </activeSearchBlock.Provider>
    )
}

export const ActiveListScreen = ({ navigation, route }: ActiveListProps) => {

    const [itemSelected, setItemSelected] = useState<ActiveItem>()
    const bloc = activeSearchBloc()
    const { account } = useContext(AuthContext)
    const { search, onChange } = useForm({ search: '' });
    const [orderAsc, setOrderAsc] = useState(true);

    useEffect(() => {
        bloc.loadActivesSearch({
            perPage: 50,
            sortDirection: 'ASC',
            page: 1,
            accountMain: Number(account),
            textQuery: ''
        }, false)
    }, [account])

    const loadMoreData = () => {
        bloc.loadActivesSearch(undefined, true)
    }

    return (
        <View style={{ flex: 1 }} >
            {/* Header */}
            <HeaderCustomScreen
                titleButtonRight=""
                title='Seleccionar Activo'
                onBack={() => { navigation.goBack() }}
                onContinue={() => {
                    if (itemSelected) {
                        route.params.onReturn(itemSelected)
                        navigation.goBack()
                    } else {
                        ToastModule.show('error', 'Selecciona un activo para continuar')
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
                        bloc.loadActivesSearch({
                            perPage: 50,
                            page: 1,
                            sortDirection: orderAsc ? 'ASC' : 'DESC',
                            accountMain: Number(account),
                            textQuery: ''
                        }, false)
                    }}
                    containerStyle={{
                        height: 36,
                    }}
                    inputContainerStyle={styles.searchInput}
                    placeholder='Buscar Activo'
                    shake={() => { }}
                    value={search}
                    onChangeText={(value) => {
                        onChange(value, 'search')
                        if (value === '') {
                            bloc.loadActivesSearch({
                                perPage: 50,
                                page: 1,
                                sortDirection: orderAsc ? 'ASC' : 'DESC',
                                accountMain: Number(account),
                                textQuery: ''
                            }, false)
                        }
                    }}
                    onSubmitEditing={() => {
                        bloc.loadActivesSearch({
                            perPage: 50,
                            page: 1,
                            sortDirection: orderAsc ? 'ASC' : 'DESC',
                            accountMain: Number(account),
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
                    marginHorizontal: 16,
                    marginTop: 8,
                    alignSelf: 'flex-start'
                }}>
                    <TouchableFeedback
                        onPress={() => {
                            setOrderAsc(!orderAsc);
                            bloc.loadActivesSearch({
                                perPage: 50,
                                page: 1,
                                sortDirection: !orderAsc ? 'ASC' : 'DESC',
                                accountMain: Number(account),
                                textQuery: search
                            }, false)
                        }}>
                        <View style={{
                            flexDirection: 'row',
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
            </View>
            {/* END: INPUT BUSCADOR */}
            <BlocBuilder
                bloc={bloc}
                builder={(state: ActiveSearchState) => {
                    return <FlatList
                        data={state.data.items}
                        renderItem={({ item }): any => (
                            <ActiveItemView
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
                                case 'LoadingActiveSearchState':
                                    return (
                                        <View style={{ flex: 1 }}>
                                            <LoadingComponent />
                                        </View>
                                    );
                                case 'LoadedActiveSearchState':
                                    return (<View style={{
                                        height: 200
                                    }} />)
                                case 'ErrorActiveSearchState':
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
    )
}

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
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