import React, {useContext, useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, SectionList, Modal, TouchableOpacity, ScrollView} from 'react-native';
import {Button, CheckBox, Image} from '@rneui/themed';
import {Text} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import {BlocBuilder} from '../../../../shared/bloc';
import {HomeState} from '../bloc/HomeState';
import {AuthContext} from '../../../../core/Context/AuthContext';
import {createContext} from '../../../../shared/bloc/ContextFactory';
import {HomeBloc} from '../bloc/HomeBloc';
import {provideHomeBloc} from '../../../../../di/Home/HomeProvider';
import {
    addDays,
    getFirstDayOfMonth,
    getLastDayOfMonth,
    shortNameMonths,
} from '../../../../shared/util/Date';
import {LoadingComponent} from '../../../../shared/components/LoadingComponent';
import {ItemResumeList} from './ItemResumeList';
import {HeaderSectionList} from './HeaderSectionList';
import {ToastModule} from '../../../../shared/components/Toast';
import {AppConstants} from '../../../../config/constants';
import {TouchableFeedback} from '../../../../shared/components/TouchableFeedback';
import uuid from 'react-native-uuid';
import DatePicker from 'react-native-modern-datepicker';
import {useNavigation} from '@react-navigation/native';
import {ServiceFilterContext} from '../../Service/presentation/context/ServiceFilterContext';
import {TicketFilterContext} from '../../Ticket/context/TicketFilterContext';
import {TButton} from '../../../../shared/components/TButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UpdatedWhenChangeContext} from "../../../../context/updateWhenChange/UpdatedWhenChangeContext";


const [usehomeBloc, useBloc] = createContext<HomeBloc>()
export const useHomeBloc = useBloc;

export const HomePageComponent = () => {
    return <usehomeBloc.Provider value={provideHomeBloc()}>
        <HomePage/>
    </usehomeBloc.Provider>
}

export const HomePage = () => {
    const serviceFilterContext = useContext(ServiceFilterContext);
    const ticketFilterContext = useContext(TicketFilterContext);
    const nav = useNavigation();
    const [date, setDate] = useState(new Date());
    const [date2, setDate2] = useState('');
    const [open, setOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const bloc = useHomeBloc()
    const [modalTypeVisible, setModalTypeVisible] = useState(false);
    const {account, getListAccounts, setAccountE, setAccountName, getName, getAccountUser} = useContext(AuthContext);
    const [listAcc, setListAcc] = useState([]);
    const [showSelectCompany, showSetCompany] = useState('flex');
    const [setIdUser] = useState('')
    const [selectedMonth, setSelectedMonth] = useState('')
    const {value} = useContext(UpdatedWhenChangeContext)

    //setSelectedMonth(simpleDateFormat(new Date()))

    useEffect(() => {
        setName();
        const initDate = getFirstDayOfMonth(date);
      //  const initSearchDate = addDays(initDate, 0)
        const endDate = getLastDayOfMonth(date);
       // const endSearchDate = addDays(endDate, 0)

        bloc.loadData(Number(account), initDate, endDate)
        listAccounts();
    }, [account, date, value.updatePrincipal]);

    useEffect(() => {
        AsyncStorage.getItem('data').then((sessionData: any) => {
            const value = JSON.parse(sessionData);
            setIdUser(String(value.data.id_user))
        })
    })

    function simpleDateFormatInit(date: Date): string {
        return date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-00'
    }

    function simpleDateFormatEnd(date: Date): string {
        return date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-32'
    }

    function simpleDateFormat(date: Date): string {
        return date.getFullYear() + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2)
    }

    const setName = async () => {
        let name: any = await getName();
        setFullName(name);
    }

    const structureDate = () => {
        let dateChange: string =
            shortNameMonths[(date.getMonth())] + '-' + date.getFullYear().toString();
        return dateChange;
    };

    const createDate = (dateToConvert: string) => {

        if (dateToConvert != "") {
            let year: any = dateToConvert.substring(0, 4);
            let month: any = dateToConvert.substring(5);
            year = year as number;
            month = month as number - 1;
            let currentDate = new Date(year, month, 1, 12);
            setDate(currentDate);
        }
    }

    const listAccounts = async () => {
        let accounts: any = await getListAccounts();
        accounts = accounts.map((acc: any) => {
            return {name: acc.is_account_main_name, value: acc.is_account_main_id, check: false}
        });
        accounts.forEach((element: any) => {
            if (element.value === account) {
                element.check = true
            }
        });
        if (accounts.length > 1)
            showSetCompany('flex');
        else
            showSetCompany('none');

        setListAcc(accounts);
    }
    const selectAccountToSet = async (l: any, i: any) => {
        let values: any = listAcc;
        values.forEach((element: any) => {
            element.check = false;
        });
        values[i].check = !l.check;
        setListAcc(values);
        await setAccountE(values[i].value);
        await setAccountName(values[i].name)
        setModalTypeVisible(false)
    }

    const renderModalListAccounts = (accountsList: any) => {
        return (
            <View style={styles.modalView}>
                <ScrollView>
                    <View style={{
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        borderBottomColor: 'gray', borderBottomWidth: 1
                    }}>
                        <Text style={{fontWeight: '700', marginVertical: 10, marginLeft: 16, fontSize: 12, height: 20}}>Selecciona
                            la Cuenta en la que deseas operar</Text>
                    </View>
                    {accountsList.map((l: any, i: any) => (
                        <View key={`${uuid.v4()}`} style={{
                            flexDirection: 'row',
                            borderBottomColor: 'gray',
                            borderBottomWidth: (i + 1 != accountsList.length) ? 1 : 0
                        }}>
                            <View style={{
                                width: '80%',
                                justifyContent: 'center',
                                paddingStart: 16
                            }}>
                                <Text style={{
                                    width: '100%',
                                    fontSize: 12,
                                }}
                                      onPress={async () => {
                                          selectAccountToSet(l, i)
                                      }}
                                > {l.name} </Text>
                            </View>
                            <View style={{
                                width: '20%',
                                justifyContent: 'center',
                            }}>
                                <CheckBox
                                    containerStyle={{width: 25, height: 45, margin: 0, backgroundColor: 'transparent'}}
                                    iconRight
                                    center
                                    checkedIcon="dot-circle-o"
                                    uncheckedIcon="circle-o"
                                    checked={l.check}
                                    onPress={async () => {
                                        selectAccountToSet(l, i)
                                    }}
                                />
                            </View>
                        </View>
                    ))
                    }
                </ScrollView>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                height: 50,
                backgroundColor: 'white',
                alignItems: 'center',
                marginBottom: 5,
                shadowColor: 'black',
                shadowOffset: {
                    width: 0,
                    height: 10,
                },
                shadowOpacity: 0.36,
                shadowRadius: 10.68,
                elevation: 5,
            }}>
                <Image style={[styles.icon]} source={{uri: AppConstants.LOGO_IMAGE}}/>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                }}>
                    <View style={{display: showSelectCompany}}>
                        <TouchableFeedback contentStyle={styles.button} onPress={() => {
                            setModalTypeVisible(true)
                        }}>
                            <Image style={[styles.iconImage]}
                                   source={{uri: 'https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-line/254000/119-512.png'}}/>
                        </TouchableFeedback>
                    </View>

                    <TouchableFeedback contentStyle={styles.button}>
                        <Icon style={[styles.iconImage]} name="bell" size={20} color="black"/>
                        {/* <Image style={[styles.iconImage]}  source={require('../../../../../assets/img/bell.png')} /> */}
                    </TouchableFeedback>
                </View>

            </View>
            <LinearGradient
                colors={['#0D419A', '#4596E7']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradient}>
                <View style={[styles.margin]}>
                    <Text style={[styles.fontWhite, {fontSize: 14}]}>Hola {fullName}</Text>
                    <Text style={[styles.fontWhite, {fontSize: 16}]}>Trabajo del día</Text>
                    <Image
                        style={[styles.image]}
                        source={{
                            uri: 'https://www.isnotdown.com/assets/pics/today-calendar.png',
                        }}
                    />
                    <TButton
                        title='Ir a mis servicios'
                        type='primary_rounded'
                        onPress={async () => {
                            let accounts: any = await getAccountUser();
                            serviceFilterContext.setQueryPath(`scheduled_date=${simpleDateFormat(date)}&is_user_profile_id=${accounts}`)
                            nav.navigate('Servicios');
                        }}
                    />
                </View>
            </LinearGradient>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignContent: 'flex-end',
                    backgroundColor: '#ffffff',
                    height: 49
                }}>

                <Modal visible={open}>
                    <DatePicker

                        mode="monthYear"
                        locale={'es'}
                        title={'Selecciona la fecha'}
                        selectorStartingYear={2010}
                        onMonthYearChange={selectedDate => {
                            setDate2(selectedDate);
                            setSelectedMonth(selectedDate.substring(0, 4) + "/" + selectedDate.substring(5, 8) + "/01")
                        }}
                        options={{mainColor: '#ff5a92'}}
                        current={selectedMonth}
                    />
                    <View style={{
                        display: 'flex',
                        alignContent: 'flex-end',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        flexDirection: 'row'
                    }}>

                        <Button
                            title="Cancelar"
                            onPress={() => {
                                setOpen(false);
                            }}
                            buttonStyle={{
                                backgroundColor: '#F44336',
                                borderRadius: 7,
                                marginHorizontal: 30,
                                height: 35,
                                width: 140
                            }}
                            titleStyle={styles.buttonTitleStyle}
                        />
                        <Button
                            title="Confirmar"
                            onPress={() => {
                                setOpen(false);
                                createDate(date2)
                            }}
                            buttonStyle={{
                                backgroundColor: '#2196F3',
                                borderRadius: 7,
                                marginHorizontal: 30,
                                height: 35,
                                width: 140
                            }}
                            titleStyle={styles.buttonTitleStyle}
                        />
                    </View>
                </Modal>
                <View style={{display: 'flex', flexDirection: 'row', marginRight: 20, marginTop: 10}}>
                    <Text style={{fontWeight: 'bold', fontSize: 16, textDecorationLine: 'underline', marginLeft: 10}}
                          onPress={() => setOpen(true)}>{structureDate()}</Text>
                    <Icon style={{marginLeft: 10, marginTop: -1}} name="calendar-alt" size={20} color="black"
                          onPress={() => setOpen(true)}/>
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    marginTop: -10,
                    shadowOffset: {
                        width: 15,
                        height: 5,
                    },
                    shadowOpacity: 0.36,
                    shadowRadius: 6.68,
                    elevation: 11,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>Actividades</Text>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalTypeVisible}
            >
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={{
                        height: '100%',
                        backgroundColor: '#000000',
                        opacity: 0.5
                    }}
                    onPress={() => {
                        setModalTypeVisible(!modalTypeVisible);
                    }}
                />
                <View style={[styles.centeredView]}>
                    {renderModalListAccounts(listAcc)}
                </View>
            </Modal>
            <BlocBuilder
                bloc={bloc}
                builder={(state: HomeState) => {
                    switch (state.kind) {
                        case 'LoadingHomeState':
                            return (
                                <View style={{flex: 1}}>
                                    <LoadingComponent/>
                                </View>
                            );
                        case 'LoadedHomeState':
                            return (<>
                                <SectionList
                                    sections={state.resume}
                                    keyExtractor={(item, index) => `${item}${index}`}
                                    renderItem={(section) => (
                                        <ItemResumeList
                                            item={section.item}
                                            onConsult={() => {
                                                if (section.item.section === 'service') {
                                                    serviceFilterContext.setQueryPath(
                                                        section.item.query
                                                    );
                                                    nav.navigate('Servicios');
                                                } else {
                                                    ticketFilterContext.setQueryPath(
                                                        section.item.query
                                                    );
                                                    nav.navigate('Tickets');
                                                }
                                            }}/>
                                    )}
                                    renderSectionHeader={({section: {title}}) => (
                                        <HeaderSectionList title={title}/>
                                    )}
                                />
                            </>)
                        case 'ErrorHomeState':
                            return (<>{ToastModule.show('error', state.error)}</>)
                        default:
                            return <></>
                    }
                }}/>
        </View>

    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'transparent',
        shadowColor: '#303838',
        shadowOffset: {width: 0, height: 5},
        shadowRadius: 10,
        shadowOpacity: 0.35
    },
    container: {
        flex: 1,
    },
    inputDate: {
        width: '30%',
        marginLeft: '65%',
        marginTop: -10

    },
    image: {
        width: 80,
        height: 80,
    },
    gradient: {
        width: '100%',
        backgroundColor: 'transparent',
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        backgroundColor: '#ffffff',
    },
    margin: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },

    fontWhite: {
        color: '#ffffff',
        fontWeight: 'bold'
    },
    icon: {
        width: 125,
        height: 35,
        marginLeft: 0,
        paddingLeft: 0,
        marginBottom: 0,
        marginTop: 10
    },
    iconImage: {
        width: 25,
        height: 25,
        marginTop: 12,
        marginHorizontal: 5
    },
    modalView: {
        width: 300,
        backgroundColor: "white",
        height: '110%',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: '55%',
        marginHorizontal: '10%',
        position: 'absolute',
    },
    buttonItemStyle: {
        backgroundColor: '#20BFC8',
        borderRadius: 25,
        marginHorizontal: 30,
        height: 30
    },

    buttonTitleStyle: {
        fontWeight: 'bold',
        fontSize: 12,
        marginHorizontal: 30
    }
});

function getFormatedDate(arg0: Date, arg1: string) {
    throw new Error('Function not implemented.');
}

