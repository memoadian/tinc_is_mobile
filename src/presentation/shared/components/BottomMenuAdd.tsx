import * as React from 'react';
import {StyleSheet, View, Text, Dimensions, TouchableWithoutFeedback,} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {FontelloIcon} from './Icon';
import {TouchableFeedback} from './TouchableFeedback';
import {ToastModule} from './Toast';
import {useContext} from "react";
import {UpdatedWhenChangeContext} from "../../context/updateWhenChange/UpdatedWhenChangeContext";

const {width} = Dimensions.get('window');


const BottomMenuAdd = () => {
    const nav = useNavigation();
    const refRBSheet = React.useRef<RBSheet>(null);
    const {value, updateTickets, updatePrincipal, updateService} = useContext(UpdatedWhenChangeContext)
    const menuOptions = [
        {
            uuid: 'ecd5a9a04706',
            id: 1,
            title: 'Orden de servicio',
            icon: '004-wrench'
        },
        {
            uuid: '446681d65c4f',
            id: 2,
            title: 'Ticket de servicio',
            icon: '005-invoice'
        }
    ];

    return (
        <>
            <TouchableFeedback
                contentStyle={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress={() => refRBSheet.current?.open()}>
                <View style={{
                    backgroundColor: '#0097FA',
                    justifyContent: 'center', // Centered horizontally
                    alignItems: 'center', // Centered vertically
                    borderRadius: 50,
                    height: 35,
                    width: 35,
                    marginTop: -10
                }}>
                    <View>
                        <FontelloIcon
                            name='017-add'
                            size={20}
                            color='#ffffff'
                        />

                    </View>
                </View>
            </TouchableFeedback>
            <RBSheet
                ref={refRBSheet}
                animationType='slide'
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        height: '25%'
                    },
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,.6)"
                    },
                    draggableIcon: {
                        backgroundColor: "#c0bebf",
                        width: 150
                    }
                }}
            >
                <View style={styles.contentContainer}>
                    <View style={{borderBottomWidth: 1, borderBottomColor: '#c0bebf'}}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            color: 'black',
                            marginBottom: 10,
                            marginLeft: 15
                        }}>Crear nuevo</Text>
                    </View>
                    {
                        menuOptions.map((item, i) => (
                            <TouchableWithoutFeedback key={item.uuid} onPress={() => {
                                switch (item.id) {
                                    case 1:
                                        refRBSheet.current?.close()
                                        nav.navigate('FormOrderServiceScreen', {
                                            onSuccess: (idCreated) => {
                                                updateService(value.updateService + 1);
                                                updatePrincipal(value.updatePrincipal + 1);
                                                ToastModule
                                                    .show(
                                                        'success',
                                                        'Orden de servicio creada',
                                                        'bottom',
                                                        () => {
                                                            nav.navigate('ServiceItemScreen', {
                                                                onReturn: () => {
                                                                    return idCreated.toString();
                                                                }
                                                            });
                                                        })
                                            }
                                        });
                                        break;
                                    case 2:
                                        refRBSheet.current?.close()
                                        nav.navigate('FormTicketScreen', {
                                            onSuccess: (idCreated) => {
                                                updatePrincipal(value.updatePrincipal + 1);
                                                updateTickets(value.updateTickets + 1);
                                                ToastModule
                                                    .show(
                                                        'success',
                                                        'Ticket de servicio creado',
                                                        'bottom',
                                                        () => {
                                                            nav.navigate('TicketItemScreen', {
                                                                onReturn: () => {
                                                                    return idCreated.toString();
                                                                }
                                                            });
                                                        })
                                            }
                                        });
                                        break;
                                }
                            }}>
                                <View style={{
                                    marginVertical: 10,
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#c0bebf'
                                }}>
                                    <View style={{width: '20%', alignItems: 'center'}}>
                                        <FontelloIcon name={item.icon} size={30}
                                                      style={{paddingBottom: 5, color: 'black'}}/>
                                    </View>
                                    <View style={{width: "80%"}}>
                                        <Text style={{color: 'black', fontSize: 18}}>{item.title}</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        ))
                    }
                </View>
            </RBSheet>
        </>
    )
}

export default BottomMenuAdd;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1
    },
    button: {
        marginHorizontal: width * .075,
        marginTop: 5,
    },
    text: {
        fontSize: 10,
        marginBottom: 0
    }
});