import { Text } from '@rneui/themed';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BlocBuilder } from "../../../../shared/bloc";
import { ServiceData } from "../../../../../domain/ListService/models/Service.model";
import { ServiceAssetKinds, ServiceItemState } from "../ServiceItemState";
import { servicesBloc } from "./ServiceItemPage";
import { AppCatalogs } from '../../../../config/catalogs';
import { Divider } from '../../../../shared/components/Divider';
import { AuthContext } from '../../../../core/Context/AuthContext';
import { TextField, TextFieldRefProps } from '../../../../shared/components/TextField';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableFeedback } from '../../../../shared/components/TouchableFeedback';
import { ProviderItem } from '../../ProviderSearch/ProviderSearchState';
import { ActiveItem } from '../../ActiveSearch/bloc/ActiveSearchState';
import { DetailServiceRequest } from '../../../../../domain/ServiceItem/models/Service.model';
import { ItemUnicSelection, PresentantionModal } from '../../../../shared/components/Selections';
import { geDate, simpleDateFormat, simpleDateFormatddmmyyyy } from '../../../../shared/util/Date';
import { TButton } from '../../../../shared/components/TButton';
import { ToastModule } from '../../../../shared/components/Toast';
import { loadOptions } from '@babel/core';

const { width } = Dimensions.get('window');
type activeProps = StackNavigationProp<any, any>;

export interface Props {
  onChangedPage: (isNextPage: boolean) => void;
  hasPermissions: boolean
}

export const TabGeneralView = ({ onChangedPage, hasPermissions }: Props) => {
 
  const bloc = servicesBloc();
  const nav = useNavigation<activeProps>();
  const [serviceData, setServiceData] = useState<ServiceData | undefined>();
  
  const [scheduleDate, setSheduleDate] = useState<string | undefined>('');
  const [visibilityStartDatePicker, setVisibilityStartDatePicker] = useState(false);

  let bouncyCheckboxRef: BouncyCheckbox | null = null;

  // Form
  const [folio, setFolio] = useState('');
  const { accountName } = useContext(AuthContext);
  const { account } = useContext(AuthContext);
  const [serviceSelected, setServiceSelected] = useState<any>(null); // editable
  const [statusSelected, setStatusSelected] = useState<any>(null); // editable
  const [provider, setProvider] = useState<ProviderItem>(); // editable
  const [active, setActive] = useState<ActiveItem>(); // editable
  const [activeAux, setActiveAux] = useState<ActiveItem>(); // editable
  const [origin, setOrigin] = useState<string | undefined>('');
  const [reference, setReference] = useState<string | undefined>('');
  const [linkedRequests, setLinkedRequests] = useState<string | undefined>('');
  const [updatedAt, setUpdatedAt] = useState<string | undefined>('');
  const [updatedBy, setUpdatedBy] = useState<string | undefined>('');
  const [isValidSave, setIsValidSave] = useState<boolean | undefined>(false);
   const [isVisibleStatusModal, setIsVisibleStatusModal] = useState(false);
  const [isVisibleServiceModal, setIsVisibleServiceModal] = useState(false);
  const [isNotRelated, setIsNotRelated]  = useState<boolean>(false);
  const activeInput = useRef<TextFieldRefProps>(null);
  const [originalAsset, setOriginalasset] = useState<ActiveItem>();

  const structureDate = (date: Date) => {
    return (date) ? simpleDateFormatddmmyyyy(date) : "";
  };

  let fileData: { name: string, value: string | undefined }[] = [];
  const setFileData = (service: ServiceData) => {
    fileData = [
      {
        name: 'ID:',
        value: service.asset_id_tinc
      },
      {
        name: 'Tipo de Activo:',
        value: service.asset_type_name
      },
      {
        name: 'Marca:',
        value: service.asset_brand_name
      },
      {
        name: 'Modelo:',
        value: service.asset_model
      },
      {
        name: 'Serie:',
        value: service.asset_serial_number
      },
      {
        name: 'Ubicación:',
        value: service.asset_location_name
      },
      {
        name: 'Sub Ubicación:',
        value: service.asset_sublocation_name
      },
      {
        name: 'Estatus:',
        value: service.asset_status_name
      }
    ]
  }

  useEffect(() => {
    if (serviceData) {
      setData(serviceData);
    }
  }, [serviceData]) 

  useEffect(() => {    
    let flag  =
      (serviceData?.service_type_name !== serviceSelected?.description) ||
      (serviceData?.service_status_name !== statusSelected?.name) ||
      (serviceData?.supplier_name !== provider?.name) ||
      ((serviceData?.asset_type_name ?? "") !== active?.asset_type_name && (serviceSelected?.asset_type_name != null || active?.asset_type_name != undefined)) ||
      (serviceData?.scheduled_date !== scheduleDate)       
      setIsValidSave(flag)
  }, [serviceSelected, statusSelected, provider,scheduleDate,active])

  useEffect(() => {    
    if(activeAux?.id == "0")
      return
    if (activeAux  && activeAux.is_account_main_id.toString() !== account) {
      {
        ToastModule.show('error', 'El activo no pertenece a la cuenta de la Orden de Servicio')    
      }        
    } else if (activeAux  && activeAux.is_asset_status_cat_id != undefined && activeAux.is_asset_status_cat_id && activeAux.is_asset_status_cat_id.toString() === '8') {

        ToastModule.show('error','El activo esta dado de baja no se puede relacionar')            
    } 
    else
      setActive(activeAux)
  },  [activeAux])

  const StatusModal = () => (
    <PresentantionModal
      isVisible={isVisibleStatusModal}
      onOutsidePressed={() => {
        setIsVisibleStatusModal(false)
      }}
    >
      <View style={styles.modal}>
        <FlatList
          data={AppCatalogs.es_service_status_cat}
          renderItem={({ item }: any) => (
            <ItemUnicSelection
              title={item.description}
              value={item}
              checked={statusSelected?.id === item.id}
              onPressed={(value, checked) => {
                setIsVisibleStatusModal(false)
                setStatusSelected(value)
              }} />
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <Divider />}
        />
      </View>
    </PresentantionModal>
  );
  const ServiceModal = () => (
    <PresentantionModal
      isVisible={isVisibleServiceModal}
      onOutsidePressed={() => {
        setIsVisibleServiceModal(false)
      }}
    >
      <View style={styles.modal}>
        <FlatList
          data={AppCatalogs.es_service_type_cat}
          renderItem={({ item }: any) => (
            <ItemUnicSelection
              title={item.description}
              value={item}
              checked={serviceSelected?.id === item.id}
              onPressed={(value, checked) => {
                setIsVisibleServiceModal(false)
                setServiceSelected(value)
              }} />
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <Divider />}
        />
      </View>
    </PresentantionModal>
  );
  const setData = (data: ServiceData) => {
    setFolio(data.id_tinc);
    const service = AppCatalogs.es_service_type_cat.find(cat => cat.description === data.service_type_name);
    setServiceSelected(service);
    const status = AppCatalogs.es_service_status_cat.find(cat => cat.description === data.service_status_name);
    setStatusSelected(status);
    setOrigin(data.service_origin_name);
    setReference(data.reference ?? 'N/A');            
    setLinkedRequests(data.total_request ?? '0');    
    setUpdatedAt(data.update_at);
    setUpdatedBy(data.last_update_user_name);
    setProvider({
      bussinessName: '',
      city: '',
      country_name: '',
      id: data.es_supplier_main_id?.toString(), 
      id_tinc: '',
      image: null,
      isSelected: false,
      state: '',
      name: data.supplier_name ? data.supplier_name : ''
    });

    const activeSaved: ActiveItem = {
      id: data.is_asset_main_id  != null ? data.is_asset_main_id.toString() : '0',
      idTinc: data.id_tinc,
      asset_brand_name:data.asset_brand_name,
      model: data.asset_model,
      serialNumber: data.asset_serial_number,
      assetCategoryName: data.is_asset_category_cat_name,
      sublocationName: data.asset_sublocation_name ?? '',
      isSelected: false,
      image: '',
      asset_type_name: data.asset_type_name,
      is_account_location_id: data.asset_location_name,
      is_account_main_id: data.is_account_main_id,
      is_asset_status_cat_id: 0,
      locationName: data.asset_location_name
    }
    setOriginalasset(activeSaved)
    setActive(activeSaved)    
    const isNotRelat = data.is_asset_main_id === null    
    if (isNotRelat && !bouncyCheckboxRef?.state.checked) {
      bouncyCheckboxRef?.onPress();
    }
    setSheduleDate(data?.scheduled_date)  
  }  

  const updateService = () => {
    const value: DetailServiceRequest = {
      es_service_status_cat_id: statusSelected.id.toString(),
      es_service_type_cat_id: serviceSelected.id.toString(),
      es_supplier_main_id: provider?.id,
      is_asset_main_id: active?.id,
      scheduled_date: scheduleDate
    };        
    if (serviceData != undefined)    
    {
      bloc.updateService(serviceData.id.toString(), value)    
    //  bloc.getService(serviceData.id.toString())
    }
      
  }

  return (
    <BlocBuilder
      bloc={bloc}
      builder={(state: ServiceItemState) => {
        if(state.kindAsset ==  ServiceAssetKinds.LoadedProviderServiceAssetState)
        {          
           setActiveAux(state.assetData)         
        }
        if (state.kind === 'LoadedProviderServiceItemState') {
          setServiceData(state.data[0])
          setFileData(state.data[0])
          return (
            <View
              style={{
                flex: 1,
                width,
                paddingVertical: 15,
                paddingHorizontal: 10
              }}>
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
                    value={folio}
                    editable={false}
                  />
                  <Text style={styles.InputHeader}>Cuenta</Text>
                  <TextField
                    placeholder='Cuenta'
                    multiline={false}
                    autoCapitalize='none'
                    value={accountName}
                    editable={false}
                  />
                  <Text style={styles.InputHeader}>Tipo de servicio</Text>
                  <View onTouchEnd={() => {
                        if (hasPermissions) {
                          setIsVisibleServiceModal(true)
                        }
                      }}>
                    <TextField
                      placeholder='Tipo de servicio'
                      value={serviceSelected?.description}
                      multiline={false}
                      autoCapitalize='none'
                      editable={false}
                      rightIcon={<Icon name="caret-down" size={20} color="black" />}
                    />
                  </View>
                  
                  <Text style={styles.InputHeader}>Estatus</Text>
                  <View onTouchEnd={() => {
                        if (hasPermissions) {
                          setIsVisibleStatusModal(true)
                        }
                      }}>
                    <TextField
                      placeholder='Estatus'
                      multiline={false}
                      autoCapitalize='none'
                      value={statusSelected?.description}
                      editable={false}                    
                      rightIcon={<Icon name="caret-down" size={20} color="black" />}
                    />

                  </View>
                  
                  <Text style={styles.InputHeader}>Proveedor</Text>
                  <View onTouchEnd={() => {
                        if (hasPermissions) {
                          nav.navigate('ProviderListScreen', {
                            onReturn: (item: ProviderItem) => {
                              setProvider(item)
                            }
                          });
                        }
                      }}>
                    <TextField
                      placeholder='Proveedor'
                      multiline={false}
                      autoCapitalize='none'
                      value={provider?.name}
                      editable={false}
                      rightIcon={ <Icon name="search" size={20} color="black"/> }                      
                    />
                  </View>
                  
                  <Text style={styles.InputHeader}>Activo</Text>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginEnd: 16,
                  }} >
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
                  <View style={{ margin: 10, marginLeft:15 }}>
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
                            setActive({
                              id: '0',
                              idTinc: '',
                              model: '',
                              asset_brand_name: '',
                              serialNumber: '',
                              assetCategoryName: '',
                              locationName: '',
                              sublocationName: '',
                              image: '',
                              isSelected: false,
                              asset_type_name: '',
                              is_account_location_id: '',
                              is_account_main_id: serviceData?.is_account_main_id ?? 0,
                              is_asset_status_cat_id: 0,
                            });
                          } else {
                            setActive(originalAsset)
                            activeInput?.current?.enable()
                          }
                        }
                      }}
                      /* onPress={(isChecked: boolean) => {
                        setIsNotRelated(!isChecked); 
                        if (isChecked) {
                          setActive(undefined);
                          setActive({
                            id: '0',
                            idTinc: '',
                            model: '',
                            asset_brand_name: '',
                            serialNumber: '',
                            assetCategoryName: '',
                            locationName: '',
                            sublocationName: '',
                            image: '',
                            isSelected: false,
                            asset_type_name: '',
                            is_account_location_id: '',
                            is_account_main_id: serviceData?.is_account_main_id ?? 0,
                            is_asset_status_cat_id: 0,
                          }) 
                        }
                        }} */
                      text="El servicio no se relaciona con un activo"
                      isChecked={isNotRelated}
                    />
                  </View>
                  <Text style={styles.InputHeader}>Fecha programada</Text>
                   <DatePicker
                        modal
                        mode="date"
                        locale={'es'}
                        title={'Selecciona la fecha'}
                        open={visibilityStartDatePicker}
                        cancelText = "Cancelar"
                        confirmText= "Confirmar"
                        date={geDate(scheduleDate)}
                        onConfirm={date => {
                          setVisibilityStartDatePicker(false);
                          setSheduleDate(simpleDateFormat(date));
                        }}
                        onCancel={() => {
                          setVisibilityStartDatePicker(false)
                        }}
                      />
                      <View onTouchEnd={() => {
                      if (hasPermissions) {
                        setVisibilityStartDatePicker(true)
                      }
                    }}>
                      <TextField
                    placeholder='Fecha programada'
                    rightIcon={<Icon name="calendar-alt" size={20} color="black" />}
                    multiline={false}
                    autoCapitalize='none'
                   /*  onPressIn={() => {
                      if (hasPermissions) {
                        setVisibilityStartDatePicker(true)
                      }
                    }} */
                    value={scheduleDate}                  
                  />

                      </View>
                  
                  <Text style={styles.InputHeader}>Origen</Text>
                  <TextField
                    placeholder='Proveedor'
                    multiline={false}
                    autoCapitalize='none'
                    value={origin}
                    editable={false}
                  />
                  <Text style={styles.InputHeader}>Referencia</Text>
                  <TextField
                    placeholder='Referencia'
                    multiline={false}
                    autoCapitalize='none'
                    value={reference}
                    editable={false}
                  />
                  <Text style={styles.InputHeader}>Solicitudes Vinculadas</Text>
                  <TextField
                    placeholder='Solicitudes Vinculadas'
                    multiline={false}
                    autoCapitalize='none'
                    value={linkedRequests}
                    editable={false}
                  />
                  <Text style={styles.InputHeader}>Ultima Actualización</Text>
                  <TextField
                    placeholder='Ultima Actualización'
                    multiline={false}
                    autoCapitalize='none'
                    value={updatedAt}
                    editable={false}
                  />
                  <Text style={styles.InputHeader}>Ultimo Editor</Text>
                  <TextField
                    placeholder='Ultimo Editor'
                    multiline={false}
                    autoCapitalize='none'
                    value={updatedBy}
                    editable={false}
                  />
                </View>

                  {
                    hasPermissions &&

                    <TButton
                        title='Guardar'
                        type='secondary'
                        disable={!isValidSave}
                        onPress={() => {
                          updateService()
                        }}
                        contentStyle={{
                            flex: 0.2,
                            alignSelf: 'flex-end',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginEnd: 8
                        }}
                    />
                  }
                  
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 0,
                    marginBottom: 10

                  }}
                >       
                </View>
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
                          key={index}
                          style={[styles.infoContainer, index % 2 === 1 ? styles.infoContainerBackground : null]}
                        >
                          <Text style={[styles.infoText, styles.infoTitle]}>{data.name}</Text>
                          <Text style={styles.infoText}>{data.value}</Text>
                        </View>
                      )
                    })
                  }
                </View>
                
                <StatusModal />
                <ServiceModal />
           {/*      <DatePicker
                  modal
                  mode="date"
                  locale={'es'}
                  title={'Selecciona la fecha'}
                  open={open}
                  date={date}
                  onConfirm={date => {
                    setOpen(false);
                    setDate(date);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                /> */}
              </ScrollView>
            </View>
          )
        } else {
          return <></>
        }
      }}></BlocBuilder>
  )
}

const styles = StyleSheet.create({
  InputHeader: {
    color: "#908E8E",
    fontSize: 14,
    marginTop: 10,
    marginLeft: 13
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    fontWeight: '700'
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

  disabledButton: {
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 19,
    paddingEnd: 19,
    width: 93,
    backgroundColor: "#898C95",
    borderRadius: 8,
    marginTop: 25,
    marginRight: 3
  }
})
