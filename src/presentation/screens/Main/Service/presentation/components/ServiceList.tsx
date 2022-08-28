import { useNavigation } from '@react-navigation/native';
import { Image, Text } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { AuthContext } from '../../../../../core/Context/AuthContext';
import { BlocBuilder } from '../../../../../shared/bloc';
import { LoadingComponent } from '../../../../../shared/components/LoadingComponent';
import { TouchableFeedback } from '../../../../../shared/components/TouchableFeedback';
import { ServiceData } from '../../../../../../domain/ListService/models/Service.model';
import { ServiceState } from '../ServiceState';
import ServiceItemView from './ServiceItemView';
import { useServicesBloc } from './ServicePage';

export interface Props {
    onOptionMenu: (service: ServiceData) => void;
}
export const ServiceList = ({
    onOptionMenu = (service) => { }
}: Props) => {
    const nav = useNavigation();
    const bloc = useServicesBloc();
    const { getRol } = useContext(AuthContext)
    const [orderBy, setOrderBy] = useState(false)
    const [userCouldDelete, setUserCouldDelete] = useState(false)

    useEffect(() => {
        (async () => {
            let idRole = await getRol();
            setUserCouldDelete(idRole === '2' || idRole === '3')
        })();
    })

    const loadMoreServices = () => {
        bloc.loadServices(null, true)
    }

    return (
        <BlocBuilder
            bloc={bloc}
            builder={(state: ServiceState) => {
                return (<View>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#FFF',
                        paddingHorizontal: 8,
                        paddingVertical: 8
                    }}>
                        <View style={{ flex: 1, marginLeft: 10, marginTop: -3 }}>
                            <TouchableFeedback
                                onPress={() => {
                                    setOrderBy(!orderBy)
                                    bloc.loadServices({
                                        ...state.info.query,
                                        ordertype: (!orderBy) ? 'ASC' : 'DESC'
                                    }, false)
                                }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Image source={require('../../../../../assets/img/up-and-down-arrow.png')}
                                        style={styles.image}
                                    />
                                    <Text style={{ fontSize: 12, marginTop: 5, fontWeight: 'bold' }} >Fecha programada</Text>
                                </View>
                            </TouchableFeedback>
                        </View>
                        {/* Número de services */}
                        <View style={{ justifyContent: 'center', marginRight: 10, marginTop: -3 }} >
                            <Text style={styles.textResults}>{state.info.totalRows} Resultados</Text>
                        </View>
                    </View>
                    <FlatList
                        data={state.info.services}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }): any => (
                            <ServiceItemView
                                isFromTicket={false}
                                service={item}
                                onOptionPress={(service) => {
                                    onOptionMenu(service)
                                }}
                                onPress={(service) => {
                                    nav.navigate('ServiceItemScreen', {
                                        onReturn: () => {
                                            return service.id
                                        }
                                    });
                                }} userCouldDelete={userCouldDelete} />
                        )}
                        onEndReached={loadMoreServices}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() => {
                            switch (state.kind) {
                                case 'LoadingServicesState':
                                    return (
                                        <View style={{
                                            height: 600,
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <LoadingComponent />
                                        </View>)
                                case 'LoadedServicesState':
                                case 'ErrorServiceState':
                                    return (<View style={{
                                        height: 200
                                    }} />)
                                default: return <></>
                            }
                        }}
                    />
                </View>)
            }}
        />
    );
};

const styles = StyleSheet.create({
    textResults: {
        fontSize: 12,
        textAlign: 'right',
        color: '#7D7D7D',
    },
    image: {
        width: 22,
        height: 22,
        marginTop: 2
    }
})
