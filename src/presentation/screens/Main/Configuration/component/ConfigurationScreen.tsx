import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState, useContext } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, Switch, Text, View } from 'react-native'
import { notificationModule } from '../../../../../di/Notifications/NotificationProvider'
import { AuthContext } from '../../../../core/Context/AuthContext'
import BlocBuilder from '../../../../shared/bloc/BlocBuilder'
import { createContext } from '../../../../shared/bloc/ContextFactory'
import { HeaderCustomScreen } from '../../../../shared/components/HeaderCustomScreen'
import { LoadingComponent } from '../../../../shared/components/LoadingComponent'
import { ToastModule } from '../../../../shared/components/Toast'
import { RootStackParams } from '../../../../shared/navigation/MainNavigator'
import { NotificationBloc } from '../bloc/NotificationBloc'
import { NotificationDataState, NotificationState } from '../bloc/NotificationState';

export interface ConfigurationScreenProps
    extends StackScreenProps<RootStackParams, 'ConfigurationScreen'> { }

const [notificationBlocContext, useBloc] = createContext<NotificationBloc>();
export const notificationBloc = useBloc;

export const NotificationService = ({ navigation, route }: ConfigurationScreenProps) => {
    return (
        <notificationBlocContext.Provider value={notificationModule.providerNotificationBloc()}>
            <ConfigurationScreen navigation={navigation} route={route}/>
        </notificationBlocContext.Provider>
    )
}
export const ConfigurationScreen = ({ navigation, route }: ConfigurationScreenProps) => {
    const bloc = notificationBloc();
    const { getRol } = useContext(AuthContext)
    const [isSupervisor, setIsSupervisor] = useState(false);
    const [isEnabledServicios1, setIsEnabledServicios1] = useState(false);
    const toggleSwitchServicios1 = () => setIsEnabledServicios1(!isEnabledServicios1);
    const [isEnabledServicios2, setIsEnabledServicios2] = useState(false);
    const toggleSwitchServicios2 = () => setIsEnabledServicios2(!isEnabledServicios2);
    const [isEnabledServicios3, setIsEnabledServicios3] = useState(false);
    const toggleSwitchServicios3 = () => setIsEnabledServicios3(!isEnabledServicios3);
    const [isEnabledServicios4, setIsEnabledServicios4] = useState(false);
    const toggleSwitchServicios4 = () => setIsEnabledServicios4(!isEnabledServicios4);

    const [isEnabledTickets1, setIsEnabledTickets1] = useState(false);
    const toggleSwitchTicket1 = () => setIsEnabledTickets1(!isEnabledTickets1);
    const [isEnabledTickets2, setIsEnabledTickets2] = useState(false);
    const toggleSwitchTicket2 = () => setIsEnabledTickets2(!isEnabledTickets2);
    const [isEnabledTickets3, setIsEnabledTickets3] = useState(false);
    const toggleSwitchTicket3 = () => setIsEnabledTickets3(!isEnabledTickets3);
    const dashes = "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
    
    useEffect(() => {
      bloc.getNotification();
      (async () => {
        let idRole = await getRol();
        setIsSupervisor(idRole === '5')
    })();
      
    }, [])
    

    const updateView = (dataArray: NotificationDataState[]) => {
        //console.log(dataArray)
        dataArray.forEach(function (value) {
            switch(value.is_user_alert_cat_name) { 
                case 'Servicio asignado': { 
                    if (value.enabled == '1') {
          //              console.log('entro servicio1 TRUEEEE')
                        setIsEnabledServicios1(true)
                    } else {
            //            console.log('entro servicio1 FALSEEE')
                        setIsEnabledServicios1(false)
                    }
                   break; 
                } 
                case 'Vencimiento de servicio programado asignado': { 
                    if (value.enabled == '1') {
                        setIsEnabledServicios2(true)
                    } else {
                        setIsEnabledServicios2(false)
                    }
                   break; 
                } 
                case 'Vencimiento de cualquier servicio programado': { 
                    if (value.enabled == '1') {
                        setIsEnabledServicios3(true)
                    } else {
                        setIsEnabledServicios3(false)
                    }
                   break; 
                } 
                case 'Conclicion de servicio': { 
                    if (value.enabled == '1') {
                        setIsEnabledServicios4(true)
                    } else {
                        setIsEnabledServicios4(false)
                    }
                   break; 
                } 
                case 'Creacion de ticket': { 
                    if (value.enabled == '1') {
                        setIsEnabledTickets1(true)
                    } else {
                        setIsEnabledTickets1(false)
                    }
                   break; 
                } 
                case 'Asignacion de ticket': { 
                    if (value.enabled == '1') {
                        setIsEnabledTickets2(true)
                    } else {
                        setIsEnabledTickets2(false)
                    }
                   break; 
                } 
                case 'Cierre de ticket': { 
                    if (value.enabled == '1') {
                        setIsEnabledTickets3(true)
                    } else {
                        setIsEnabledTickets3(false)
                    }
                   break; 
                } 
                default: { 
                 //   console.log('No esta mapeada la opcion de las notificaciones.')
                   break; 
                } 
             }
          }); 
    }

    return (
    <SafeAreaView style={styles.AndroidSafeArea} >
        <StatusBar
            barStyle='dark-content'
        />
        <HeaderCustomScreen
            isBlueHeader={true}
            showContinue={false}
            onBack={() => { navigation.goBack() }}
            title={'Configuración'} />
            <BlocBuilder
                bloc={bloc}
                builder={(state: NotificationState) => {
                    switch (state.kind) {
                        case 'LoadingNotificationState':
                            return (
                                <View style={[styles.container]}>
                                    <LoadingComponent />
                                </View>)
                        case 'ErrorNotificationState':
                            return (
                                <>
                                    {ToastModule.show('error', state.error,'top')}
                                </>)
                        case 'PrintNotificationState':
                            return (
                                <>
                                    {updateView(state.data)}
                                </>)
                        default: return <></>
                    }
                }}
            />
            <View
                style = {{
                    backgroundColor: 'white',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 16,
                    marginVertical: 16,
                    marginHorizontal: 8, 
            }}>
                <Text style= {{fontWeight: '800', fontSize: 15}} >Deseo recibir notifiaciones para:</Text>
                <Text style= {{fontWeight: '800', paddingTop: 16, fontSize: 15}} >Servicios</Text>
                {
                    !isSupervisor &&
                    <View style= {{flexDirection: 'column',}}>
                    <View style= {styles.optionContainer}>
                        <Text style= {styles.optionText}>Cuando se me asigne un Servicio</Text>
                        <Switch 
                            style = {styles.switchPink}
                            trackColor={{ false: "#767577", true: "#ee9fbe" }}
                            thumbColor={isEnabledServicios1 ? "#ff5faf" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => {toggleSwitchServicios1(); bloc.updateNotification('3', !isEnabledServicios1)}}
                            value={isEnabledServicios1} />
                    </View>
                    <Text style={styles.dashTextLine} ellipsizeMode='clip' numberOfLines={1} >{dashes}</Text>
                </View>
                }
                {                    
                    <View style= {{flexDirection: 'column'}}>
                        <View style= {styles.optionContainer}>
                            <Text style= {styles.optionText} >Cuando venza la fecha programada de un Servicio asignado</Text>
                            <Switch 
                                style = {styles.switchPink}
                                trackColor={{ false: "#767577", true: "#ee9fbe" }}
                                thumbColor={isEnabledServicios2 ? "#ff5faf" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => {toggleSwitchServicios2(); bloc.updateNotification('4098', !isEnabledServicios2)}}
                                value={isEnabledServicios2} />
                        </View>
                        <Text style={styles.dashTextLine} ellipsizeMode='clip' numberOfLines={1} >{dashes}</Text>
                    </View>
                }
                {
                    !isSupervisor &&
                    <View style= {{flexDirection: 'column'}}>
                        <View style= {styles.optionContainer}>
                            <Text style= {styles.optionText} >Cuando venza la fecha programada de cualquier Servicio</Text>
                            <Switch 
                                style = {styles.switchPink}
                                trackColor={{ false: "#767577", true: "#ee9fbe" }}
                                thumbColor={isEnabledServicios3 ? "#ff5faf" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => {toggleSwitchServicios3(); bloc.updateNotification('655', !isEnabledServicios3)}}
                                value={isEnabledServicios3} />
                        </View>
                        <Text style={styles.dashTextLine} ellipsizeMode='clip' numberOfLines={1} >{dashes}</Text>
                    </View>
                }
                {
                    !isSupervisor &&
                    <View style= {{flexDirection: 'column'}}>
                        <View style= {styles.optionContainer}>
                            <Text style= {styles.optionText} >Cuando se concluya un Servicio</Text>
                            <Switch 
                                style = {styles.switchPink}
                                trackColor={{ false: "#767577", true: "#ee9fbe" }}
                                thumbColor={isEnabledServicios4 ? "#ff5faf" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => {toggleSwitchServicios4(); bloc.updateNotification('1307', !isEnabledServicios4)}}
                                value={isEnabledServicios4} />
                        </View>
                        <Text style={styles.dashTextLine} ellipsizeMode='clip' numberOfLines={1} >{dashes}</Text>
                    </View>
                }
                
                <View>
                    <Text style= {{fontWeight: '800', paddingVertical: 16, fontSize: 15,}} >Tickets</Text>
                </View>
                {
                     !isSupervisor &&
                     <View style= {{flexDirection: 'column'}}>
                        <View style= {styles.optionContainer}>
                            <Text style= {styles.optionText} >Cuando se cree un Ticket nuevo</Text>
                            <Switch 
                                style = {styles.switchPink}
                                trackColor={{ false: "#767577", true: "#ee9fbe" }}
                                thumbColor={isEnabledTickets1 ? "#ff5faf" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => {toggleSwitchTicket1(); bloc.updateNotification('1959', !isEnabledTickets1)}}
                                value={isEnabledTickets1} />
                        </View>
                        <Text style={styles.dashTextLine} ellipsizeMode='clip' numberOfLines={1} >{dashes}</Text>
                    </View>
                }
                {
                    !isSupervisor &&
                    <View style= {{flexDirection: 'column'}}>
                        <View style= {styles.optionContainer}>
                            <Text style= {styles.optionText} >Cuando se me asigne un Ticket</Text>
                            <Switch 
                                style = {styles.switchPink}
                                trackColor={{ false: "#767577", true: "#ee9fbe" }}
                                thumbColor={isEnabledTickets2 ? "#ff5faf" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => {toggleSwitchTicket2(); bloc.updateNotification('2611', !isEnabledTickets2)}}
                                value={isEnabledTickets2} />
                        </View>
                        <Text style={styles.dashTextLine} ellipsizeMode='clip' numberOfLines={1} >{dashes}</Text>
                    </View>
                }
                {                    
                    <View style= {{flexDirection: 'column'}}>
                        <View style= {styles.optionContainer}>
                            <Text style= {styles.optionText} >Cuando se cierre un Ticket</Text>
                            <Switch 
                                style = {styles.switchPink}
                                trackColor={{ false: "#767577", true: "#ee9fbe" }}
                                thumbColor={isEnabledTickets3 ? "#ff5faf" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => {toggleSwitchTicket3(); bloc.updateNotification('3263', !isEnabledTickets3)}}
                                value={isEnabledTickets3} />
                        </View>
                        <Text style={styles.dashTextLine} ellipsizeMode='clip' numberOfLines={1} >{dashes}</Text>
                    </View>
                }
                
            </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: 'f9f9f9',
    },
    switchPink: {
        alignSelf: 'center', 
        alignItems: 'flex-end', 
        flex: .2
    },
    optionContainer: {
        flexDirection: 'row',
        marginBottom: -13,

    },
    optionText: {
        fontSize: 15,
        alignSelf: 'flex-end',
        flex: .8,
        flexWrap: 'wrap',
        fontWeight: '400'
    },
    dashTextLine: {
        fontSize: 20,
        fontWeight: '300',
        height: 20
    },
    container: {
        height: '100%',
        width: '100%',
        justifyContent: "center",
    },
});