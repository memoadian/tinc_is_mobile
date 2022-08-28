import { Chip, Text } from '@rneui/themed';
import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native';
import { TicketData } from '../../../../../domain/ListTickets/models/Ticket.model';
import { ScrollView } from 'react-native-gesture-handler';
import { shortNameMonths } from '../../../../shared/util/Date';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableFeedback } from '../../../../shared/components/TouchableFeedback';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../../../../../config.json';
import { AuthContext } from '../../../../core/Context/AuthContext';
const FlatIcon = createIconSetFromFontello(fontelloConfig);

interface TicketItemProps {
    ticket: TicketData,
    userCouldDelete: boolean;
    onOptionPress: (ticket: TicketData) => void;
    onPress: (ticket: TicketData) => void;
}

const statusColor = (status: String): string => {
    switch (status) {
        case 'Abierto':
            return '#5FE374';
        case 'Cerrado':
            return '#82E1E9';
        default:
            return '#FFF';
    }

}

const priorityColor = (priority: number): string => {
    switch (priority) {
        case 2:
            return '#E0400A';
        case 3:
            return '#FFA504';
        case 4:
            return '#4269E1';
        case 5:
            return '#FFFFFF';
        default:
            return '';
    }
}

const priorityBorderColor = (priority: number): string => {
    switch (priority) {
        case 2:
            return '#E0400A';
        case 3:
            return '#FFA504';
        case 4:
            return '#4269E1';
        case 5:
            return '#000000';
        default:
            return '';
    }
}

const getLocation = (item: any): string => {
    if (item.is_account_location_name == null)
        return "Sin Ubicación"   
    else
        return item.is_account_location_name;
}

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr.replace(' ', 'T'));
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '-' + shortNameMonths[Number(month) - 1] + '-' + year;
}

const TicketItemView = ({ ticket, userCouldDelete, onOptionPress, onPress }: TicketItemProps) => {

    const { getRol } = useContext(AuthContext)   
    return (
        <TouchableFeedback onPress={() => onPress(ticket)}>
            <View style={{ width: '100%' }}>
                <View style={{ height: 10 }} />
                {/* <View> Header del ticket </View> */}
                <View style={styles.cardView}>
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <ScrollView
                            horizontal={true}>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}>
                                {ticket.ticket_status_name === 'Abierto' && <View style={{
                                    width: 16,
                                    height: 16,
                                    alignSelf: 'center',
                                }}>
                                    <Svg height="15" width="15">
                                        <Circle
                                            stroke={priorityBorderColor(Number(ticket.es_ticket_priority_cat_id))}
                                            strokeWidth="1"
                                            cx="7"
                                            cy="7"
                                            r="6"
                                            fill={priorityColor(Number(ticket.es_ticket_priority_cat_id))}
                                        />
                                    </Svg>
                                </View>}
                                <Chip
                                    buttonStyle={{ backgroundColor: statusColor(ticket.ticket_status_name), paddingVertical: 0 }}
                                    title={ticket.ticket_status_name}
                                    containerStyle={{ marginHorizontal: 2 }}
                                    onPress={() => { }}
                                    titleStyle={{ fontSize: 14, color: '#000' }}
                                />
                                {ticket.es_ticket_request_cat_name && <Chip
                                    buttonStyle={{ backgroundColor: '#D8D8D8', paddingVertical: 0 }}
                                    containerStyle={{ marginHorizontal: 2 }}
                                    title={ticket.es_ticket_request_cat_name}
                                    onPress={() => { }}
                                    titleStyle={{ fontSize: 14, color: '#000' }}
                                />}
                                <Chip
                                    buttonStyle={{ backgroundColor: '#D8D8D8', paddingVertical: 0 }}
                                    containerStyle={{ marginHorizontal: 2 }}
                                    title={ticket.timezone_create_at.substring(0,10)}
                                    onPress={() => { }}
                                    titleStyle={{ fontSize: 14, color: '#000' }}
                                />
                            </View>
                        </ScrollView>

                        {userCouldDelete && <TouchableFeedback
                            onPress={() => { onOptionPress(ticket) }}
                            contentStyle={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: 30,
                                alignItems: 'center',
                                alignContent: 'center'
                            }}
                        >
                            <Icon
                                name='ellipsis-v'
                                size={12}
                            />
                        </TouchableFeedback>
                        }
                    </View>
                    <Text
                        style={{
                            fontSize: 18,
                            color: '#000000'
                        }}
                        numberOfLines={1} >{ticket.subject}</Text>
                    {/* Información de la ubicacón */}
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <View style={{
                            flex: 1,
                            marginEnd: 8,
                            paddingBottom: 4,
                        }}>
                            <View style={{
                                marginTop: 0,
                                flexDirection: 'row'
                            }}>
                                <FlatIcon name='016-cardiogram' size={14} style={{ marginTop: 3 }} />
                                <Text
                                    style={{
                                        fontSize: 14,
                                        marginStart: 5,
                                        color: '#7D7D7D',
                                    }}
                                    
                                    numberOfLines={1}>{ticket.asset_type_name ?? "Sin Activo"}</Text>
                            </View>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: 0
                            }}>

                                <View style={{
                                    marginTop: 4,
                                    marginBottom: 4,
                                    flexDirection: 'row',
                                }}>
                                    <FlatIcon name='015-location' size={14} color='#888888' style={{ marginTop: 3 }} />
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            marginStart: 5,
                                            color: '#7D7D7D',
                                            maxWidth: 200,
                                            flexWrap: 'wrap'
                                        }}
                                        numberOfLines={1}>{getLocation(ticket)}</Text>
                                </View>
                                {/* Número de ticket */}
                               
                            </View>
                             <View style={{ justifyContent: 'center', alignItems: 'flex-end' }} >
                                    <Chip
                                        title={`#${ticket.id_tinc}`}
                                        buttonStyle={{ backgroundColor: '#d8d8d8', paddingVertical: 0 }}
                                        titleStyle={{ fontSize: 14, color: '#000000' }} />
                                </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableFeedback>
    );
}

export default TicketItemView

const styles = StyleSheet.create({
    cardView: {
        backgroundColor: '#FFFFFF',
        padding: 15,
    }
})
