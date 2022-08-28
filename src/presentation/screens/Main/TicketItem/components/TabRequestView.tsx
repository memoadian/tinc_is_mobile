import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActionSheetIOS, Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextField, TextFieldRefProps } from '../../../../shared/components/TextField';
import { TicketData } from '../../../../../domain/ListTickets/models/Ticket.model';
import { AuthContext } from '../../../../core/Context/AuthContext';
import { AppCatalogs } from '../../../../config/catalogs';
import { LocationEntity } from '../../../../../domain/Locations/models/Location.model';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ActiveItem } from '../../ActiveSearch/bloc/ActiveSearchState';
import { createContext } from '../../../../shared/bloc/ContextFactory';
import { TicketItemBloc } from '../bloc/TicketItemBloc';
import { ticketItemModule } from '../../../../../di/TicketItem/ProviderTicketItem';
import { BlocBuilder } from '../../../../shared/bloc';
import { TicketAssetKinds, TicketItemKinds, TicketItemState } from '../bloc/TicketItemState';
import { LoadingComponent } from '../../../../shared/components/LoadingComponent';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableFeedback } from '../../../../shared/components/TouchableFeedback';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { LocationModalComponent } from '../../LocationModal/presentation/components/LocationModal';
import { ToastModule } from '../../../../shared/components/Toast';
import uuid from 'react-native-uuid';
import { TicketModel } from '../../../../../domain/TicketItem/models/Ticket.model';
import { Divider } from '../../../../shared/components/Divider';
import { ItemUnicSelection, PresentantionModal } from '../../../../shared/components/Selections';
import { TButton } from '../../../../shared/components/TButton';

const { width } = Dimensions.get('window');
type activeProps = StackNavigationProp<any, any>;

const [ticketBlock, useTicketBloc] = createContext<TicketItemBloc>()
export const ticketBloc = useTicketBloc;

export interface Props {
  idTicket: string;
  hasPermissions: boolean;
}

export const TabRequestView = (props: Props) => {
  return (
    <ticketBlock.Provider value={ticketItemModule.providerTicketItemBloc()}>
      <TabRequestComponent
        idTicket={props.idTicket}
        hasPermissions={props.hasPermissions}
      />
    </ticketBlock.Provider>
  );
}

export const TabRequestComponent = ({ idTicket, hasPermissions }: Props) => {
  const nav = useNavigation<activeProps>();
  const bloc = ticketBloc();
  const [ticketData, setTicketData] = useState<TicketData | undefined>();

  const activeInput = useRef<TextFieldRefProps>(null);
  let bouncyCheckboxRef: BouncyCheckbox | null = null;

  const [countChanges, setCountChanges] = useState(1);


  //form
  const [folio, setFolio] = useState('');
  const { accountName } = useContext(AuthContext);
  const { account } = useContext(AuthContext);
  const [requestSelected, setRequestSelected] = useState<any>(null); // editable
  const [request, setRequest] = useState('');
  const [active, setActive] = useState<ActiveItem>() // editable
  const [isNotRelatActive, setIsNotRelated] = useState<boolean>(false); // editable
  const [priority, setPriority] = useState<any>(null); // editable
  const [applicant, setApplicant] = useState(''); // editable
  const [phone, setPhone] = useState<string | undefined>(''); // editable
  const [dateRequest, setDateRequest] = useState('');
  const [timeRequest, setTimeRequest] = useState('');
  const [location, setLocation] = useState<LocationEntity | null>(null); // editable
  const [comments, setComments] = useState(''); // editable
  const [linkedRequest, setLinkedRequest] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | undefined>('');
  const [updatedBy, setUpdatedBy] = useState<string | undefined>('');
  const [isValidSave, setIsValidSave] = useState<boolean | undefined>(false);
  const [activeAux, setActiveAux] = useState<ActiveItem>(); // editable
  const [originalAsset, setOriginalasset] = useState<ActiveItem>();

  //modals
  const [isVisibleRequestModal, setVisibleRequestModal] = useState(false);
  const [isVisiblePriorityModal, setVisiblePriorityModal] = useState(false);
  const [isVisibleLocationModal, setIsVisibleLocationModal] = useState(false);

  const [fileData, setFileData] = useState<{ name: string, value: string | undefined }[]>([]);

  useEffect(() => {
    bloc.getTicket(idTicket);
  }, [idTicket, hasPermissions]);

  useEffect(() => {
    if (ticketData) {
      setData(ticketData);
    }
  }, [ticketData]);

  useEffect(() => {
    let flag =
      (ticketData?.es_ticket_request_cat_name !== requestSelected?.description) ||
      (ticketData?.requestor !== applicant) ||
      (ticketData?.asset_type_name !== active?.asset_type_name && (ticketData?.asset_type_name != null || active?.asset_type_name != undefined)) ||
      (ticketData?.es_ticket_priority_cat_id.toString() !== priority?.id.toString()) ||
      (ticketData?.contact_phone !== phone) ||
      (ticketData?.is_account_location_name !== location?.name) ||
      (ticketData?.comments !== comments)
      setIsValidSave(flag);
  },
    [requestSelected, isNotRelatActive, priority, applicant, phone, location, comments,active])

    useEffect(() => {           
      if(activeAux?.id == "0")
        return
     if (activeAux  && activeAux.is_account_main_id.toString() !== account) {
        {
          ToastModule.show('error', 'El activo no pertenece a la cuenta del Ticket de Servicio')    
        }        
      } else if (activeAux  && activeAux.is_asset_status_cat_id != undefined && activeAux.is_asset_status_cat_id && activeAux.is_asset_status_cat_id.toString() === '8') {
  
          ToastModule.show('error','El activo esta dado de baja no se puede relacionar')            
      } 
      else
      {
        setActive(activeAux)
      }
        
    },  [activeAux])
  

  const setData = (ticket: TicketData) => {
    setFolio(ticket.id_tinc);
    const request = AppCatalogs.es_ticket_request_cat.find(data => data.id === Number(ticket.es_ticket_request_cat_id));
    setRequestSelected(request);
    setRequest(ticket.subject);
    const activeSaved: ActiveItem = {
      id: ticket.is_asset_main_id  != null ? ticket.is_asset_main_id.toString() : '0',
      idTinc: ticket.id_tinc,
      asset_brand_name:ticket.asset_brand_name,
      model: ticket.asset_model,
      serialNumber: ticket.asset_serial_number,
      assetCategoryName: ticket.is_asset_category_cat_name,
      sublocationName: ticket.asset_sublocation_name ?? '',
      isSelected: false,
      image: '',
      asset_type_name: ticket.asset_type_name,
      is_account_location_id: ticket.asset_location_name,
      is_account_main_id: ticket.is_account_main_id,
      is_asset_status_cat_id: 0,
      locationName: ticket.asset_location_name

    }
    setActive(activeSaved);
    setOriginalasset(activeSaved)
    const isNotRelat = ticket.is_asset_main_id === null;
    if (isNotRelat && !bouncyCheckboxRef?.state.checked) {
      bouncyCheckboxRef?.onPress();
    }
    if (!isNotRelat && bouncyCheckboxRef?.state.checked) {
      bouncyCheckboxRef?.onPress();
    }
    const prioritySaved = AppCatalogs.es_ticket_priority_cat.find(data => data.id === Number(ticket.es_ticket_priority_cat_id))
    setPriority(prioritySaved);
    setApplicant(ticket.requestor);
    setPhone(ticket.contact_phone);
    setDateRequest(ticket.timezone_create_at.split(' ')[0]);
    setTimeRequest(ticket.timezone_create_at.split(' ')[1]);
    const locationSaved: LocationEntity = {
      create_at: '',
      description: '',
      id: ticket.is_account_location_id.toString(),
      is_account_main_id: '',
      is_account_main_name: '',
      is_account_user_id: '',
      name: ticket.is_account_location_name,
      name_wo_account: '',
      update_at: ''

    }
    setLocation(locationSaved);
    setComments(ticket.comments);
    setLinkedRequest(ticket.total_request ?? '0');
    setUpdatedAt(ticket.update_at);
    setUpdatedBy(ticket.last_update_user_name);
    setActiveInfo(ticket);
  };

  const setActiveInfo = (ticket: TicketData) => {
    if (ticket.asset_id_tinc) {
      setFileData([
        {
          name: 'ID:',
          value: ticket.asset_id_tinc
        },
        {
          name: 'Tipo de Activo:',
          value: ticket.asset_type_name
        },
        {
          name: 'Marca:',
          value: ticket.asset_brand_name
        },
        {
          name: 'Modelo:',
          value: ticket.asset_model
        },
        {
          name: 'Serie:',
          value: ticket.asset_serial_number
        },
        {
          name: 'Ubicación:',
          value: ticket.asset_location_name
        },
        {
          name: 'Sub Ubicación:',
          value: ticket.asset_sublocation_name
        },
        {
          name: 'Estatus:',
          value: ticket.asset_status_name
        }
      ]);
    }
    else {
      setFileData([]);
    }
  }

  const RequestModal = () => (
    <PresentantionModal
      isVisible={isVisibleRequestModal}
      onOutsidePressed={() => {
        setVisibleRequestModal(false)
      }}
    >
      <View style={styles.modal}>
        <FlatList
          data={AppCatalogs.es_ticket_request_cat}
          renderItem={({ item }: any) => (
            <ItemUnicSelection
              title={item.description}
              value={item}
              checked={requestSelected?.id === item.id}
              onPressed={(value, checked) => {
                setVisibleRequestModal(false)
                setRequestSelected(value)
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

  const updateTicket = () => {
    const TicketModel: TicketModel = {
      comments: comments,
      contact_phone: phone ? phone : '',
      es_ticket_priority_cat_id: priority.id,
      es_ticket_request_cat_id: requestSelected.id,
      is_account_location_id: location?.id ? location?.id : '',
      is_asset_main_id: active?.id ? active?.id : '',
      requestor: applicant,
      subject: request
    };
    bloc.updateTicket(idTicket, TicketModel);
  }

  return (
    <BlocBuilder
      bloc={bloc}
      builder={(state: TicketItemState) => {
        if(state.kindAsset ==  TicketAssetKinds.LoadedProviderTicketAssetState)
        {          
           setActiveAux(state.assetData)         
        }
        switch (state.kind) {
          case TicketItemKinds.LoadingTicketItemState:
            return (
              <View style={{ flex: 1, width }}>
                <LoadingComponent />
              </View>
            );
          case TicketItemKinds.LoadedTicketItemState:
            setTicketData(state.data[0]);
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
                    <Text style={styles.InputHeader}>Folio</Text>
                    <TextField
                      placeholder='Folio'
                      multiline={false}
                      autoCapitalize='none'
                      editable={false}
                      value={folio}                    
                    />
                    <Text style={styles.InputHeader}>Cuenta</Text>
                    <TextField
                      placeholder='Cuenta'
                      multiline={false}
                      autoCapitalize='none'
                      editable={false}
                      value={accountName}
                    />
                    <Text style={styles.InputHeader}>Tipo de solicitud</Text>  
                    <View onTouchEnd={() => {
                          if (hasPermissions) {
                            setVisibleRequestModal(true)
                          }
                        }}>
                      <TextField
                        placeholder='Tipo de solicitud'
                        multiline={false}
                        autoCapitalize='none'
                        value={requestSelected?.description}
                        editable={false}
                       
                        rightIcon={<Icon name="caret-down" size={20} color="black" />}
                      />
                    </View>
                    
                    <Text style={styles.InputHeader}>Solicitud</Text>
                    <TextInput
                      placeholder='Solicitud'
                      multiline={true}
                      autoCapitalize='none'
                      editable={false}
                      value={request}
                      style={styles.TextInputStyle}
                    />
                    <Text style={styles.InputHeader}>Activo</Text>                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginEnd: 16,
                    }}>
                      <View style={{flex: 1}} onTouchEnd={() => {
                          (hasPermissions && !bouncyCheckboxRef?.state.checked) ?
                            nav.navigate('ActiveSearchListScreenComponent', {
                              onReturn: (item: ActiveItem) => {
                                setActive(item)
                              }
                            })
                            : null
                        }}>
                      <TextField
                        ref={activeInput}
                        value={active?.asset_type_name}
                        placeholder='Activo'
                        multiline={false}
                        autoCapitalize='none'
                        editable={false}
                        rightIcon={ <Icon name="search" size={20} color="black"/>}
                      />
                      </View>
                      
                      <TouchableFeedback onPress={() => {
                        if (hasPermissions && !bouncyCheckboxRef?.state.checked) {
                          nav.navigate('ScanQRScreen', {
                            onReturn: (data: any) => {
                              let url: string = data;
                              let valuesSplit = url.split('id=');
                              if (valuesSplit.length === 2) {
                                let idActive: string = valuesSplit[1];
                                bloc.getActiveDetail(idActive)
                              }
                            }
                          })
                        }
                      }} >
                        <Icon name="qrcode" size={20} color="black"/>                       
                      </TouchableFeedback>
                    </View>
                    <View style={{ margin: 10 }}>
                      <BouncyCheckbox
                        ref={(ref: any) => (bouncyCheckboxRef = ref)}
                        size={18}
                        disabled={!hasPermissions}
                        fillColor='#8e8a8e'
                        iconStyle={{
                          borderWidth: 2,
                          borderColor: '#8e8a8e',
                          borderRadius: 0,
                        }}
                        textStyle={{
                          color: '#8e8a8e',
                          textDecorationLine: "none",
                        }}
                        onPress={(isChecked: boolean) => {
                          if (hasPermissions) {
                            if (isChecked) {
                              activeInput?.current?.disable()
                              setActive(undefined);
                            } else {
                              setActive(originalAsset)
                              activeInput?.current?.enable()
                            }
                          }
                        }}
                        text="La solicitud no se relaciona con un activo"
                        isChecked={isNotRelatActive}
                      />
                    </View>
                    <Text style={styles.InputHeader}>Prioridad</Text>
                    <View onTouchEnd={() => {
                          if (hasPermissions) {
                            setVisiblePriorityModal(true)
                          }
                        }}>
                      <TextField
                        placeholder='Prioridad'
                        multiline={false}
                        autoCapitalize='none'
                        value={priority?.description}
                        editable={false}                       
                        rightIcon={<Icon name="caret-down" size={20} color="black" />}
                      />
                    </View>                    
                    <Text style={styles.InputHeader}>Solicitante</Text>
                    <TextInput
                      placeholder='Solicitante'
                      multiline={true}
                      autoCapitalize='none'
                      value={applicant}
                      editable={hasPermissions}
                      style={styles.TextInputStyle}
                      onChangeText={newText => {
                        setApplicant(newText); 
                      }}
                    />
                    <Text style={styles.InputHeader}>Teléfono de contacto</Text>
                    <TextField
                      placeholder='Teléfono de contacto'
                      multiline={false}
                      maxLength={15}
                      autoCapitalize='none'
                      keyboardType='phone-pad'
                      value={phone}
                      editable={hasPermissions}
                      onChangeText={newPhone => {
                        setPhone(newPhone)
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          flex: 1
                        }}
                      >
                        <Text
                          style={[styles.InputHeader]}
                        >Fecha de solicitud</Text>
                        <TextField
                          value={dateRequest}
                          editable={false}
                          rightIcon={<Icon name="calendar-alt" size={20} color="black" />}
                        />
                      </View>
                      <View
                        style={{
                          flex: 1
                        }}
                      >
                        <Text style={styles.InputHeader}>Hora de Solicitud</Text>
                        <TextField
                          placeholder='Teléfono de contacto'
                          multiline={false}
                          autoCapitalize='none'
                          value={timeRequest}
                          editable={false}
                          rightIcon={<Icon name="clock" size={20} color="black" />}
                        />
                      </View>
                    </View>
                    <Text style={styles.InputHeader}>Ubicación del Solicitante</Text>
                    <View onTouchEnd={() => {
                          if (hasPermissions) {
                            setIsVisibleLocationModal(true)
                          }
                        }}>
                      <TextField
                        placeholder='Ubicación del Solicitante'
                        multiline={false}
                        autoCapitalize='none'
                        value={location?.name}                        
                        rightIcon={<Icon name="caret-down" size={20} color="black" />}
                      />
                    </View>                    
                    <Text style={styles.InputHeader}>Comentarios del Solicitante</Text>
                    <TextInput 
                      placeholder='Comentarios del Solicitante'
                      multiline={true}
                      maxLength={255}
                      autoCapitalize='none'
                      editable={hasPermissions}
                      value={comments}
                      style={styles.TextInputStyle}
                      onChangeText={newComments => {
                        setComments(newComments)
                      }}
                    />
                    <Text style={styles.InputHeader}>Solicitudes Vinculadas</Text>
                    <TextField
                      placeholder='Solicitudes Vinculadas'
                      multiline={false}
                      autoCapitalize='none'
                      editable={false}
                      value={linkedRequest}
                    />
                    <Text style={styles.InputHeader}>Ultima Actualización</Text>
                    <TextField
                      placeholder='Ultima Actualización'
                      multiline={false}
                      autoCapitalize='none'
                      editable={false}
                      value={updatedAt}
                    />
                    <Text style={styles.InputHeader}>Último Editor</Text>
                    <TextField
                      placeholder='Último Editor'
                      multiline={false}
                      autoCapitalize='none'
                      editable={false}
                      value={updatedBy}
                    /> 
                  </View>

                  {
                     hasPermissions &&
                     <TButton
                        title='Guardar'
                        type='secondary'
                        disable={!isValidSave}
                        onPress={() => {
                          updateTicket()
                        }}
                        contentStyle={{
                            flex: 0.2,
                            alignSelf: 'flex-end',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginEnd: 8,
                            marginBottom: 10,
                        }}
                    />
                  }
                  {
                    fileData.length > 0 &&
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingVertical: 14
                      }}
                    >
                      <Text style={styles.titleSection}>
                        Informacion del Activo
                      </Text>
                      {
                        fileData.map((data, index) => {
                          return (
                            <View
                              key={uuid.v4().toString()}
                              style={[styles.infoContainer, index % 2 === 1 ? styles.infoContainerBackground : null]}
                            >
                              <Text style={[styles.infoText, styles.infoTitle]}>{data.name}</Text>
                              <Text style={styles.infoText}>{data.value}</Text>
                            </View>
                          )
                        })
                      }
                    </View>
                  }
                  
                </ScrollView>
                <RequestModal />
                <PriorityModal />
                <LocationModalComponent
                  isVisible={isVisibleLocationModal}
                  idSelected={location?.id ?? null}
                  showAllRow={false}
                  onSelected={(item) => {
                    setIsVisibleLocationModal(false);
                    if (item) {
                      setLocation(item);
                    } else {
                      setLocation(null);
                    }
                  }} onOutsidePressed={() => {
                    setIsVisibleLocationModal(false);
                  }}
                />
              </View>
            )
          case TicketItemKinds.ErrorTicketItemState:
            return (<>{ToastModule.show('error', state.error)}</>);
          default:
            return <></>
        }
      }}
    />
  )
}

const styles = StyleSheet.create({
  inputDate: {
    margin: 0,
    padding: 0
  },
  textContent: {
    fontSize: 12,
    color: "#000000",
    fontWeight: 'bold'
  },
  InputHeader: {
    color: "#908E8E",
    fontSize: 14,
    marginTop: 10,
    marginLeft: 13
  },
  titleSection: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700'
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  infoContainerBackground: {
    backgroundColor: '#f4f4f4'
  },
  infoText: {
    width: '50%',
    textAlign: 'left'
  },
  infoTitle: {
    fontWeight: '700',
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
  button: {
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 19,
    paddingEnd: 19,
    width: 93,
    backgroundColor: "#F03E7B",
    borderRadius: 8,
    marginTop: 25,
    marginRight: 3
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
});
