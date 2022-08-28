import { Image, Text } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { AuthContext } from '../../../../core/Context/AuthContext';
import { BlocBuilder } from '../../../../shared/bloc';
import { LoadingComponent } from '../../../../shared/components/LoadingComponent';
import { TouchableFeedback } from '../../../../shared/components/TouchableFeedback';
import { TicketData } from '../../../../../domain/ListTickets/models/Ticket.model';
import TicketItemView from './TicketItemView';
import { useTicketsBloc } from './TicketPage';
import { TicketState } from '../TicketState';
import { useNavigation } from '@react-navigation/native';

export interface Props {
    onOptionMenu: (ticket: TicketData) => void;
}
export const TicketList = ({
    onOptionMenu = (ticket) => { }
}: Props) => {
    const nav = useNavigation();
    const bloc = useTicketsBloc();
    const { getRol } = useContext(AuthContext)
    const [orderBy, setOrderBy] = useState(false)
    const [userCouldDelete, setUserCouldDelete] = useState(false)

    useEffect(() => {
        (async () => {
            let idRole = await getRol();
            setUserCouldDelete(idRole === '2' || idRole === '3')

        })();
    })

    const loadMoreTickets = () => {
        bloc.loadTickets(null, true)
    }

    return (
        <BlocBuilder
            bloc={bloc}
            builder={(state: TicketState) => {
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
                                    bloc.loadTickets({
                                        ...state.info.query,
                                        ordertype: (orderBy) ? 'DESC' : 'ASC'
                                    }, false)
                                }}>
                                <View style={{ flexDirection: 'row', }}> 
                                    <Image
                                        source={require('../../../../assets/img/up-and-down-arrow.png')}
                                        style={styles.image}
                                    />
                                    <Text style={{ fontSize: 12, marginTop: 5, fontWeight: 'bold' }} >{ (!orderBy) ? 'Más recientes' : 'Más antiguos'}</Text>
                                </View>
                            </TouchableFeedback>
                        </View>
                        {/* Número de tickets */}
                        <View style={{ justifyContent: 'center', marginRight: 10, marginTop: -3 }} >
                            <Text style={styles.textResults}>{state.info.totalRows} Resultados</Text>
                        </View>
                    </View>
                    <FlatList
                        data={state.info.tickets}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }): any => (
                            <TicketItemView
                                ticket={item}
                                onOptionPress={(ticket) => {
                                    onOptionMenu(ticket);
                                }}
                                onPress={(ticket) => {
                                    nav.navigate('TicketItemScreen', {
                                        onReturn: () => {
                                            return ticket.id.toString();
                                        }
                                    });
                                }} userCouldDelete={userCouldDelete} />
                        )}
                        onEndReached={loadMoreTickets}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() => {
                            switch (state.kind) {
                                case 'LoadingTicketsState':
                                    return (
                                        <View style={{
                                            height: 600,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <LoadingComponent />
                                        </View>)
                                case 'LoadedTicketsState':
                                case 'ErrorTicketState':
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
