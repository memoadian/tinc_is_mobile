import { StackScreenProps } from '@react-navigation/stack';
import { Input } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { AuthContext } from '../../../../core/Context/AuthContext';
import { BlocBuilder } from '../../../../shared/bloc';
import { createContext } from '../../../../shared/bloc/ContextFactory';
import { Divider } from '../../../../shared/components/Divider';
import { HeaderCustomScreen } from '../../../../shared/components/HeaderCustomScreen';
import { FontelloIcon } from '../../../../shared/components/Icon';
import { LoadingComponent } from '../../../../shared/components/LoadingComponent';
import { ToastModule } from '../../../../shared/components/Toast';
import { TouchableFeedback } from '../../../../shared/components/TouchableFeedback';
import { useForm } from '../../../../shared/hooks/useForm';
import { RootStackParams } from '../../../../shared/navigation/MainNavigator';
import { userSearchModule } from '../di/UserSearchProvider';
import { UserSearchBloc } from '../UserSearchBloc';
import { UserItem, UserSearchState } from '../UserSearchState';
import { UserSearchItemView } from './UserSearchItemView';

const [userSearchBlock, useBloc] = createContext<UserSearchBloc>();
export const useUserSearchBloc = useBloc;

export interface UserSearchProps
    extends StackScreenProps<RootStackParams, 'UserSearchComponent'> { }

export const UserSearchComponent = ({ navigation, route }: UserSearchProps) => {
    return (
        <userSearchBlock.Provider value={userSearchModule.provideUserSearchBloc()}>
            <UserSearchList navigation={navigation} route={route} />
        </userSearchBlock.Provider>
    );
};

export const UserSearchList = ({ navigation, route }: UserSearchProps) => {
    const bloc = useUserSearchBloc();
    const { account } = useContext(AuthContext);
    const [userSelected, setUserSelected] = useState<UserItem>();
    const { search, onChange } = useForm({ search: '' });
    const [orderAsc, setOrderAsc] = useState(true);

    useEffect(() => {
        bloc.loadUserSearch(1000, Number(account));
    }, [account]);

    return (
        <SafeAreaView style={styles.AndroidSafeArea}>
            <View style={{ flex: 1 }}>
                {/* Header */}
                <HeaderCustomScreen
                    titleButtonRight=""
                    title="Seleccionar Usuario"
                    onBack={() => {
                        navigation.goBack();
                    }}
                    onContinue={() => {
                        if (userSelected) {
                            route.params.onReturn(userSelected);
                            navigation.goBack();
                        } else {
                            ToastModule.show('error', 'Selecciona un usuario para continuar');
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
                        }}
                        containerStyle={{
                            height: 36,
                        }}
                        inputContainerStyle={styles.searchInput}
                        placeholder="Buscar Usuario"
                        shake={() => { }}
                        value={search}
                        onChangeText={value => {
                            onChange(value, 'search');
                            bloc.filterData(search);
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
                    builder={(state: UserSearchState) => {
                        switch (state.kind) {
                            case 'LoadingUserSearchState':
                                return (
                                    <View style={{ flex: 1 }}>
                                        <LoadingComponent />
                                    </View>
                                );
                            case 'LoadedUserSeachState':
                                return (
                                    <>
                                        <FlatList
                                            data={state.filter}
                                            renderItem={({ item }): any => (
                                                <UserSearchItemView
                                                    item={item}
                                                    onPress={item => {
                                                        bloc.setSelected(item);
                                                        setUserSelected(item);
                                                        route.params.onReturn(item);
                                                        navigation.goBack();
                                                    }}
                                                />
                                            )}
                                            keyExtractor={(item, index) => index.toString()}
                                            ItemSeparatorComponent={() => <Divider />}
                                        />
                                    </>
                                );
                            case 'ErrorUserSeachState':
                                return <>{ToastModule.show('error', state.error)}</>;
                            default:
                                return <></>;
                        }
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: 'white',
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
        borderRadius: 32 / 2,
    },
});
