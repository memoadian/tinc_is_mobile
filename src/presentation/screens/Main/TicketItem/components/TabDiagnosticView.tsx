import React, {useEffect, useRef, useState} from 'react';
import {Alert, Dimensions, FlatList, Image, Platform, StyleSheet, View} from 'react-native';
import { ticketItemModule } from '../../../../../di/TicketItem/ProviderTicketItem';
import { createContext } from '../../../../shared/bloc/ContextFactory';
import { TicketItemBloc } from '../bloc/TicketItemBloc';
import { BlocBuilder } from '../../../../shared/bloc';
import { TicketItemKinds, TicketItemState } from '../bloc/TicketItemState';
import { LoadingComponent } from '../../../../shared/components/LoadingComponent';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Text } from '@rneui/themed';
import { TextField } from '../../../../shared/components/TextField';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TButton } from '../../../../shared/components/TButton';
import { TicketData } from '../../../../../domain/ListTickets/models/Ticket.model';
import { ToastModule } from '../../../../shared/components/Toast';
import { AppCatalogs } from '../../../../config/catalogs';
import { Divider } from '@rneui/base';
import DatePicker from 'react-native-date-picker';
import { simpleDateFormatddmmyyyy } from '../../../../shared/util/Date';
import { TicketToUpdate } from '../../../../../domain/TicketItem/models/TicketItem.model';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ItemUnicSelection, PresentantionModal } from '../../../../shared/components/Selections';
import {useNavigation} from '@react-navigation/native';
import {ActiveItem} from '../../ActiveSearch/bloc/ActiveSearchState';
import {ServiceData} from '../../../../../domain/ListService/models/Service.model';
import ServiceItemView from '../../Service/presentation/components/ServiceItemView';
import {UserItem} from '../../UserSearch/UserSearchState';
import {ProviderItem} from '../../ProviderSearch/ProviderSearchState';
import {MenuAlert} from "../../../../shared/components/MenuAlert";
import {ServiceBloc} from "../../Service/presentation/ServiceBloc";
import * as DependenciesServiceProvider from "../../Service/presentation/di/ServiceProvider";
import {ServiceState} from "../../Service/presentation/ServiceState";

const { width } = Dimensions.get('window');

const [ticketBlock, useTicketBloc] = createContext<TicketItemBloc>()
const [servicesBloc, useservicesBloc] = createContext<ServiceBloc>();
export const ticketBloc = useTicketBloc;
export const useServicesBloc = useservicesBloc;

export interface Props {
  idTicket: string;
  hasPermissions: boolean;
}

export const TabDiagnosticView = (props: Props) => {
  return (
    <servicesBloc.Provider value={DependenciesServiceProvider.provideServiceBloc()}>
      <ticketBlock.Provider value={ticketItemModule.providerTicketItemBloc()}>
        <TabDiagnosticComponent
          idTicket={props.idTicket}
          hasPermissions={props.hasPermissions}
        />
      </ticketBlock.Provider>
    </servicesBloc.Provider>
  );
}

export const TabDiagnosticComponent = ({ idTicket, hasPermissions }: Props) => {
  const bloc = ticketBloc();
  const blocService = useServicesBloc();
  const nav = useNavigation();
  
  const [ticketData, setTicketData] = useState<TicketData | undefined>()
  const [ticketServices, setServicesTicket] = useState<ServiceData[]>([])

  // form
  const [provider, setProvider] = useState<ProviderItem>();
  const [ingAssigned, setIngAssigned] = useState<UserItem>();
  const [status, setStatus] = useState<any>()
  const [priority, setPriority] = useState<any>(null);
  const [solution, setSolution] = useState<any>();
  const [comments, setComments] = useState<string>();
  const [dateAttention, setDateAttention] = useState<Date | null>(null);
  const [timeAttention, setTimeAttention] = useState<string>();
  const [hours, setHours] = useState<string>();
  const [minutes, setMinutes] = useState<string>();
  const [isValidToSave, setIsValidToSave] = useState(false);

  //modals
  const [isVisibleStatusModal, setIsVisibleStatusModal] = useState(false);
  const [isVisiblePriorityModal, setVisiblePriorityModal] = useState(false);
  const [isVisibleSolutionModal, setVisibleSolutionModal] = useState(false);
  const [datePickerState, setVisibilityDatePicker] = useState(false);
  const [timePickerState, setVisibilityTimePicker] = useState(false);
  const [isVisibleOptionMenu, setIsVisibleOptionMenu] = useState(false);

  const serviceRemove = useRef<ServiceData>()

  useEffect(() => {
    bloc.getTicket(idTicket);
  }, [idTicket]);

  useEffect(() => {
    if (ticketData) {
      const providerData: ProviderItem = {
        id: ticketData?.es_supplier_main_id ? ticketData?.es_supplier_main_id.toString() : '',
        bussinessName: '',
        city: '',
        country_name: '',
        id_tinc: ticketData.id_tinc,
        image: '',
        isSelected: false,
        name: ticketData?.es_supplier_main_name ? ticketData?.es_supplier_main_name : '',
        state: ''
  
      }
      setProvider(providerData);
      const ingAssignedData: UserItem = {
        fullname: ticketData?.is_user_profile_full_name ? ticketData?.is_user_profile_full_name : '',
        id: ticketData?.is_user_profile_id ? ticketData?.is_user_profile_id.toString() : '',
        image: '',
        isSelected: false,
        profile_picture: '',
        rolName: ''
  
      }
      setIngAssigned(ingAssignedData);
      const statusSaved = AppCatalogs.es_ticket_status_cat.find(data => data.id === Number(ticketData?.es_ticket_status_cat_id));
      setStatus(statusSaved);
      const prioritySaved = AppCatalogs.es_ticket_priority_cat.find(data => data.id === Number(ticketData?.es_ticket_priority_cat_id));
      setPriority(prioritySaved);
      const solutionSaved = AppCatalogs.es_ticket_solution_cat.find(data => data.id === Number(ticketData.es_ticket_solution_cat_id));
      setSolution(solutionSaved);
      setComments(ticketData?.comments_diagnostic);
      if (ticketData.attention_date && ticketData.attention_date !== '0000-00-00') {
        setDateAttention(new Date(ticketData.attention_date));
      }
      setTimeAttention(ticketData.attention_hour);
      setHours(ticketData.duration_hours);
      setMinutes(ticketData.duration_minutes);
      bloc.getTicketServices(ticketData.id_tinc);
    }
  }, [ticketData]);

  const [countChanges, setCountChanges] = useState(1);

  useEffect(() => {
    if (countChanges > 2) {
      let flag =
        (ticketData?.es_supplier_main_name !== provider?.name) ||
        (ticketData?.is_user_profile_full_name !== ingAssigned?.fullname) ||
        (ticketData?.es_ticket_status_cat_id !== status?.id) ||
        (ticketData?.es_ticket_priority_cat_id !== priority?.id) ||
        (ticketData?.es_ticket_solution_cat_id !== solution?.id) ||
        (ticketData?.comments_diagnostic !== comments) ||
        (ticketData?.attention_date && dateAttention && ticketData?.attention_date !== structureDate(dateAttention)) ||
        (ticketData?.attention_hour !== timeAttention) ||
        (ticketData?.duration_hours !== hours) ||
        (ticketData?.duration_minutes !== minutes);
      setIsValidToSave(flag);
    }
    setCountChanges(countChanges + 1);
  }, [provider, ingAssigned, status, priority, solution, comments, dateAttention, timeAttention, hours, minutes]);

  const StatusModal = () => (
    <PresentantionModal
      isVisible={isVisibleStatusModal}
      onOutsidePressed={() => {
        setIsVisibleStatusModal(false)
      }}
    >
      <View style={styles.modal}>
        <FlatList
          data={AppCatalogs.es_ticket_status_cat}
          renderItem={({ item }: any) => (
            <ItemUnicSelection
              title={item.description}
              value={item}
              checked={status?.id === item.id}
              onPressed={(value, checked) => {
                setIsVisibleStatusModal(false)
                setStatus(value)
              }} />
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <Divider />}
        />
      </View>
    </PresentantionModal>
  );

  const PriorityModal = () => (
    <PresentantionModal
      isVisible={isVisiblePriorityModal}
      onOutsidePressed={() => {
        setVisiblePriorityModal(false)
      }}
    >
      <View style={styles.modal}>
        <FlatList
          data={AppCatalogs.es_ticket_priority_cat}
          renderItem={({ item }: any) => (
            <ItemUnicSelection
              title={item.description}
              value={item}
              checked={priority?.id === item.id}
              onPressed={(value, checked) => {
                setVisiblePriorityModal(false)
                setPriority(value)
              }} />
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <Divider />}
        />
      </View>
    </PresentantionModal>
  );

  const SolutionModal = () => (
    <PresentantionModal
      isVisible={isVisibleSolutionModal}
      onOutsidePressed={() => {
        setVisibleSolutionModal(false)
      }}
    >
      <View style={styles.modal}>
        <FlatList
          data={AppCatalogs.es_ticket_solution_cat}
          renderItem={({ item }: any) => (
            <ItemUnicSelection
              title={item.description}
              value={item}
              checked={solution?.id === item.id}
              onPressed={(value, checked) => {
                setVisibleSolutionModal(false)
                setSolution(value)
              }} />
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <Divider />}
        />
      </View>
    </PresentantionModal>
  );

  const structureDate = (date: Date) => {
    return (date) ? simpleDateFormatddmmyyyy(date) : "";
  };

  const updateTicket = () => {
    const ticketDiagnosticToUpdate: TicketToUpdate = {
      attention_date: dateAttention?.toISOString(),
      attention_hour: timeAttention,
      comments_diagnostic: comments,
      duration_hours: hours,
      duration_minutes: minutes,
      es_ticket_priority_cat_id: priority.id,
      es_ticket_solution_cat_id: solution?.id,
      es_ticket_status_cat_id: status.id,
      subject: ticketData?.subject ? ticketData?.subject : '',
      is_user_profile_id: ingAssigned?.id,
      es_supplier_main_id: provider?.id
    };
    bloc.updateTicket(idTicket, ticketDiagnosticToUpdate).finally(() => {
      setCountChanges(1);
      setIsValidToSave(false);
    });
  }

  const showAlertDelete = () => {
    Alert.alert(
      "Eliminar Servicio",
      "¿Estás seguro de querer eliminar la siguiente Orden de Servicio?",
      [
        {
          text: "Cancelar",
          style: 'destructive'
        },
        {
          text: "Eliminar",
          onPress: () => {
            if (serviceRemove.current && ticketData) {
              blocService.deleteService(`${serviceRemove.current?.id}`).finally(() => {
                bloc.getTicketServices(ticketData.id_tinc);
              })

            }
          }
        }
      ],
      {
        cancelable: true,
        onDismiss: () => {
        }
      }
    );
  }

  return (
    <>
      <BlocBuilder
        bloc={bloc}
        builder={(state: TicketItemState) => {
          switch (state.kind) {
            case TicketItemKinds.LoadingTicketItemState:
              return (
                <View style={{ flex: 1, width }}>
                  <LoadingComponent />
                </View>
              )
            case TicketItemKinds.LoadedTicketItemState:
              setTicketData(state.data[0]);
              setServicesTicket(state.services);
              return (
                <View
                  style={{
                    flex: 1,
                    width,
                    paddingVertical: 15,
                    paddingHorizontal: 10
                  }}
                >
                  <ScrollView>
                    <View
                      style={{
                        flex: 1,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingVertical: 14
                      }}
                    >
                      <Text style={styles.InputHeader}>Proveedor</Text>
                      <View
                        onTouchEnd={() => {
                          if (hasPermissions) {
                            nav.navigate('ProviderListScreen', {
                              onReturn: (item: ProviderItem) => {
                                setProvider(item)
                              }
                            })
                          }
                        }}
                      >
                        <TextField
                          placeholder='Proveedor'
                          multiline={false}
                          autoCapitalize='none'
                          editable={false}
                          value={provider?.name}
                          rightIcon={
                            <Icon name="search" size={20} color="black"/>
                          }
                        />
                      </View>
                      <Text style={styles.InputHeader}>Ing. Asignado</Text>
                      <View onTouchEnd={() => {
                        if (hasPermissions) {
                            nav.navigate('UserSearchComponent', {
                              onReturn: (item: UserItem) => {
                              setIngAssigned(item)
                              }
                            })
                        }                        
                      }}>
                        <TextField
                          placeholder='Ing. Asignado'
                          multiline={false}
                          autoCapitalize='none'
                          editable={false}
                          value={ingAssigned?.fullname}
                          rightIcon={
                            <Icon name="search" size={20} color="black"/>
                          }
                        />
                      </View>
                      <View onTouchEnd={() => {
                        if (hasPermissions) {
                          setIsVisibleStatusModal(true)
                        }
                      }}>
                        <Text style={styles.InputHeader}>Estatus</Text>
                        <TextField
                          placeholder='Estatus'
                          multiline={false}
                          autoCapitalize='none'
                          editable={false}
                          value={status?.description}
                          rightIcon={<Icon name="caret-down" size={20} color="black" />}
                        />
                      </View>
                      <View onTouchEnd={() => {
                        if (hasPermissions) {
                          setVisiblePriorityModal(true)
                        }
                      }}>
                        <Text style={styles.InputHeader}>Prioridad Real</Text>
                        <TextField
                          placeholder='Prioridad Real'
                          multiline={false}
                          autoCapitalize='none'
                          editable={false}
                          value={priority?.description}
                          rightIcon={<Icon name="caret-down" size={20} color="black" />}
                        />
                      </View>
                      <View onTouchEnd={() => {
                        if (hasPermissions) {
                          setVisibleSolutionModal(true)
                        }
                      }}>
                        <Text style={styles.InputHeader}>Solución</Text>
                        <TextField
                          placeholder='Solución'
                          multiline={false}
                          autoCapitalize='none'
                          editable={false}
                          value={solution?.description}
                          rightIcon={<Icon name="caret-down" size={20} color="black" />}
                        />
                      </View>
                      <Text style={styles.InputHeader}>Comentarios</Text>
                      <TextInput
                        placeholder='Comentarios'
                        multiline={true}
                        autoCapitalize='none'
                        value={comments}
                        editable={hasPermissions}
                        style={styles.TextInputStyle}
                        onChangeText={newComment => {
                          setComments(newComment);
                        }}
                      />
                      <View
                        style={{ flexDirection: 'row' }}
                      >
                        <View
                          style={{ flex: 1 }}
                        >
                          <Text style={[styles.InputHeader]}>Fecha de Atención</Text>
                          <DatePicker
                            modal
                            mode="date"
                            locale={'es'}
                            title={'Selecciona la fecha'}
                            cancelText={'Cancelar'}
                            confirmText={'Aceptar'}
                            open={datePickerState}
                            date={dateAttention ? dateAttention : new Date()}
                            onConfirm={date => {
                              setVisibilityDatePicker(false);
                              setDateAttention(date);
                            }}
                            onCancel={() => {
                              setVisibilityDatePicker(false);
                            }}
                          />
                          <View onTouchEnd={() => {
                              if (hasPermissions) {
                                setVisibilityDatePicker(true)
                              }
                            }}>

                          <TextField
                            value={dateAttention ? structureDate(dateAttention) : ''}
                            placeholder='Fecha de Atención'                           
                            rightIcon={<Icon name="calendar-alt" size={20} color="black" />}
                          />
                          </View>                          
                        </View>
                        <View
                          style={{ flex: 1 }}
                        >
                          <Text style={styles.InputHeader}>Hora de Atención</Text>
                          {
                            timePickerState &&
                              <DateTimePicker
                                  value={new Date()}
                                  mode={'time'}
                                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                  is24Hour={true}
                                  locale={'es-ES'}
                                  onChange={(event) => {
                                    if (event.type === 'dismissed') {
                                      setVisibilityTimePicker(false)
                                    }
                                    if (event.type === 'set' && event.nativeEvent.timestamp) {
                                      setVisibilityTimePicker(false)
                                      const newDate = new Date(event?.nativeEvent?.timestamp)
                                      setTimeAttention(newDate.toTimeString().split(' ')[0]);
                                    }
                                  }}
                              />
                          }

                          <View onTouchEnd={() => {
                              if (hasPermissions) {
                                setVisibilityTimePicker(true);
                              }
                            }}>

                          <TextField
                            placeholder='Hora de Atención'
                            multiline={false}
                            autoCapitalize='none'
                            editable={hasPermissions}
                            value={timeAttention}
                            rightIcon={<Icon name="clock" size={20} color="black" />}
                          />

                          </View>
                          
                        </View>
                      </View>
                      <View
                        style={{ flexDirection: 'row' }}
                      >
                        <View
                          style={{ flex: 1 }}
                        >
                          <Text style={[styles.InputHeader]}>Duración (Hrs)</Text>
                          <TextField
                            value={hours}
                            editable={hasPermissions}
                            onChangeText={newHours => {
                              if (Number(newHours) < 1000) {
                                setHours(newHours)
                              }
                            }}
                            keyboardType='numeric'
                          />
                        </View>
                        <View
                          style={{ flex: 1 }}
                        >
                          <Text style={styles.InputHeader}>Duración (Mins)</Text>
                          <TextField
                            multiline={false}
                            autoCapitalize='none'
                            value={minutes}
                            editable={hasPermissions}
                            onChangeText={newMinutes => {
                              if (Number(newMinutes) < 60) {
                                setMinutes(newMinutes)
                              }
                            }}
                            keyboardType='numeric'
                          />
                        </View>
                      </View>
                    </View>
                    {
                      hasPermissions &&
                        <View style={{ alignItems: 'flex-end' }}>
                            <TButton
                                title='Guardar'
                                disable={!isValidToSave}
                                type='secondary'
                                onPress={() => {
                                  updateTicket()
                                }}
                                contentStyle={{
                                  alignSelf: 'flex-end',
                                  marginTop: 0,
                                }}
                            />
                        </View>
                    }

                    {
                      hasPermissions &&
                        <View style={{ alignItems: 'flex-end' }}>
                          {
                            (ticketServices.length < 3 &&
                              ticketServices.filter(ticket => ticket.service_status_name === 'Concluido')?.length === ticketServices.length) &&
                              <TButton
                                  title='Crear servicio +'
                                  type='secondary'
                                  onPress={() => {
                                    // @ts-ignore
                                    nav.navigate('FormOrderServiceScreen', {
                                      onReturn: () => {
                                        if (ticketData) {
                                          const active: ActiveItem = {
                                            assetCategoryName: '',
                                            asset_type_name: ticketData.asset_type_name ? ticketData.asset_type_name : '',
                                            asset_brand_name: ticketData.asset_brand_name,
                                            id: ticketData.is_asset_main_id ? ticketData.is_asset_main_id.toString() : '',
                                            idTinc: ticketData.id_tinc,
                                            image: '',
                                            isSelected: false,
                                            locationName: '',
                                            model: ticketData.asset_model,
                                            serialNumber: '',
                                            sublocationName: '',
                                            is_account_location_id: ticketData.is_account_location_id.toString(),
                                            is_account_main_id: ticketData.is_account_main_id,
                                            is_asset_status_cat_id: 0

                                          }
                                          return { active, idTicket }
                                        }
                                      },
                                      onSuccess: (idCreated: number) => {
                                        if (idCreated && ticketData) {
                                          bloc.getTicketServices(ticketData.id_tinc)
                                        }
                                      }
                                    })
                                  }}
                                  contentStyle={{
                                    alignSelf: 'flex-end',
                                    marginTop: 10,
                                  }}
                              />
                          }
                        </View>
                    }
                    <View
                      style={{
                        flex: 1,
                        marginBottom: 10,
                        marginTop: 10,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingVertical: 14
                      }}
                    >
                      <Text style={styles.orderTitle}>Ordenes de Servicio</Text>
                      {
                        ticketServices.length === 0 &&
                          <Text style={styles.orderParagraph}>No se han creado Ordenes de Servicio derivadas de este Ticket.</Text>
                      }
                      {
                        ticketServices.length > 0 &&
                          <FlatList
                              data={ticketServices}
                              renderItem={({item}): any => (
                                <ServiceItemView
                                  isFromTicket={true}
                                  service={item}
                                  onOptionPress={(service) => {
                                    serviceRemove.current = service;
                                    setIsVisibleOptionMenu(true)
                                  }}
                                  onPress={(service) => {
                                    nav.navigate('ServiceItemScreen', {
                                      onReturn: (): number => {
                                        return service.id
                                      }
                                    });
                                  }}
                                  userCouldDelete={true}
                                />
                              )}
                          />
                      }
                    </View>
                  </ScrollView>
                  <StatusModal />
                  <PriorityModal />
                  <SolutionModal />
                  <MenuAlert
                    isVisible={isVisibleOptionMenu}
                    options={[{
                      text: 'Eliminar',
                      textSytle: {
                        color: '#000'
                      },
                      onPressed: () => {
                        setIsVisibleOptionMenu(false);
                        showAlertDelete();
                      }
                    }]}
                    onCancelPressed={() => {
                      setIsVisibleOptionMenu(false);
                    }} onOutsidePressed={() => {
                    setIsVisibleOptionMenu(false)
                  }}/>
                </View>
              )
            case TicketItemKinds.ErrorTicketItemState:
              return (<>{ToastModule.show('error', state.error)}</>);
            default:
              return <></>
          }
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  InputHeader: {
    color: "#908E8E",
    fontSize: 14,
    marginTop: 10,
    marginLeft: 13
  },
  orderTitle: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 10
  },
  orderParagraph: {
    textAlign: 'center',
    paddingHorizontal: 48
  },
  modal: {
    backgroundColor: '#FFFFFF',
    width: 350,
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.25,
    elevation: 4,
    borderRadius: 8
  },
  TextInputStyle: {
    marginHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#827f87',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom:0,
    paddingTop:0    
},
})
