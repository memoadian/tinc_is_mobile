import { Chip, Text } from '@rneui/themed';
import React from 'react'
import { BackHandler, Dimensions, StyleSheet, View } from 'react-native';
import { ServiceData } from '../../../../../../domain/ListService/models/Service.model';
import { ScrollView } from 'react-native-gesture-handler';
import { shortNameMonths } from '../../../../../shared/util/Date';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableFeedback } from '../../../../../shared/components/TouchableFeedback';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../../../../../../config.json';
const FlatIcon = createIconSetFromFontello(fontelloConfig);

interface ServiceItemProps {
    service: ServiceData,
    userCouldDelete: boolean;
    onOptionPress: (service: ServiceData) => void;
    onPress: (service: ServiceData) => void;
    isFromTicket: boolean
}
const {width: windowsWidth} = Dimensions.get('window');
const statusColor = (status: any): string => {
    switch (status) {
        case '1':
            return '#F7A25E';
        case '3':
            return '#FFE849';
        case '5':
            return '#5FE374';
        case '6':
            return '#F76B4A';
        case '4':        
        case '8':
        case '9':
            return '#F7A25E';
            
        default:
            return '#82E1E9';
    }
}

const getLocation =( item: any): string=>{

    if(item.asset_location_name == null)
        return "Sin Ubicación"
    else if(item.asset_sublocation_name != null)
        return item.asset_location_name +" - "+ item.asset_sublocation_name ;
    else
        return item.asset_location_name;
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

const ServiceItemView = ({ service, userCouldDelete, onOptionPress, onPress, isFromTicket }: ServiceItemProps) => {
    return (
        
        <TouchableFeedback onPress={() => onPress(service)}>
            <View style={[
              { width: '100%', padding: 0 },
                {
                    borderTopWidth: isFromTicket ? 1 : 0,
                    borderBottomWidth: isFromTicket ? 1 : 0,
                    marginVertical: isFromTicket ? 10 : 0,
                }
            ]}>
                {
                    !isFromTicket &&
                  <View style={{ height: 10 }} />
                }
                {/* <View> Header del service </View> */}
                <View style={[isFromTicket ? styles.cardViewFromTicket : styles.cardView]}>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <ScrollView
                            horizontal={true}>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}>
                                {service.service_status_name === 'Abierto' && <View style={{
                                    width: 16,
                                    height: 16,
                                    alignSelf: 'center',
                                }}>

                                </View>}
                                <Chip
                                    buttonStyle={{ backgroundColor: statusColor(service.es_service_status_cat_id), paddingTop: 0, paddingBottom: 0 }}
                                    title={service.service_status_name}
                                    containerStyle={{ marginHorizontal: 2 }}
                                    titleStyle={{ fontSize: 14, color: '#000' }}
                                />
                                <Chip
                                    buttonStyle={{ backgroundColor: '#D8D8D8', paddingTop: 0, paddingBottom: 0 }}
                                    containerStyle={{ marginHorizontal: 2 }}
                                    title={service.scheduled_date}
                                    titleStyle={{ fontSize: 14, color: '#000' }}
                                />
                            </View>
                        </ScrollView>
                        {userCouldDelete && <TouchableFeedback onPress={() => { onOptionPress(service) }} >
                            <View
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: 30,
                                    alignItems: 'center',
                                    alignContent: 'center'
                                }}>

                                <Icon
                                    name='ellipsis-v'
                                    size={14}
                                />

                            </View>
                        </TouchableFeedback>
                    }
                    </View>
                    {/* <Text numberOfLines={1} >{service.service_type_name}</Text> */}
                    <Text
                        style={{
                            fontSize: 18,
                            color: '#000000'
                        }}
                        numberOfLines={1}>{service.service_type_name}</Text>
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
                                <FlatIcon name='016-cardiogram' size={14} style={{marginTop:3}}/>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        marginStart: 5,
                                        color: '#7D7D7D',
                                    }}
                                    numberOfLines={1}>{service.asset_type_name ?? "Sin Activo"}</Text>
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
                                  //  width:windowsWidth-170
                                }}>
                                    {
                                        !isFromTicket &&
                                      <>
                                      <FlatIcon name="015-location" size={14} color="#888888" style={{marginTop: 3}}/>
                                      <Text
                                        style={{
                                            fontSize: 14,
                                            marginStart: 5,
                                            color: '#7D7D7D',
                                            minWidth:windowsWidth-200
                                        }}
                                        numberOfLines={1}>{getLocation(service)}
                                        </Text></>
                                      }
                                </View>

                               


                            </View>
                             {/* Número de service */}
                             <View style={{
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    paddingRight: 0
                                }} >
                                    <Chip
                                        title={`#${service.id_tinc}`}
                                        buttonStyle={{ backgroundColor: '#d8d8d8', paddingTop: 0, paddingBottom: 0 }}
                                        titleStyle={{ fontSize: 14, color: '#000000' }} />
                                </View>

                        </View>

                    </View>
                </View>
            </View>
        </TouchableFeedback>
    );
}

export default ServiceItemView

const styles = StyleSheet.create({
    cardView: {
        backgroundColor: '#FFFFFF',
        padding: 15,
    },
    cardViewFromTicket: {
        backgroundColor: '#F5F5F5',
        padding: 15
    }
})
