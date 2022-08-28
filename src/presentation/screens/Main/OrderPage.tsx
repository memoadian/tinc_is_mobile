import { Avatar, Button, CheckBox, Input, ListItem, Text } from '@rneui/themed'
import React, { useContext, useEffect, useState } from 'react'
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ApiContext } from '../../core/Context/ApiContext'
import { LoadingComponent } from '../../shared/components/LoadingComponent'
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../../../config.json';
import { AuthContext } from '../../core/Context/AuthContext'
import { HeaderScreen } from '../../shared/components/HeaderScreen';
import Icon from 'react-native-vector-icons/FontAwesome5';
const Icons = createIconSetFromFontello(fontelloConfig);
var beforeDataList: any;
let filter: any = {};

export const OrderPage = () => {
  const { getService, setLocationMethod, seTypeAsset, typeAsset } = useContext(ApiContext);
  const { account } = useContext(AuthContext)
  const [loading, setLoading] = useState(false);
  const [myWorkFilter, setMyWorkFilter] = useState({ title: 'Mi trabajo', name: 'Hoy', isActive: false, value: null })
  const [dateFilter, setDateFilter] = useState({ title: 'Fecha', name: 'Hoy', isActive: false, value: null })
  const [statusFilter, setStatusFilter] = useState({ title: 'Estatus', name: 'Estatus', isActive: false, value: [] })
  const [typeFilter, setTypeFilter] = useState({ title: 'Tipo', name: 'Hoy', isActive: false, value: [] })
  const [locationFilter, setLocationFilter] = useState({ title: 'Ubicacion', name: 'Hoy', isActive: false, value: null })
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMultiSelectVisible, setModalMultiSelectVisible] = useState(false);
  const [modalTypeVisible, setModalTypeVisible] = useState(false);
  const [modalLocationVisible, setModalLocationVisible] = useState(false)
  const [type, setType] = useState([{ label: 'Todo (Predeterminado)', value: 'Todo', check: true }])
  const [date, setDate] = useState([{ label: 'Todo (Predeterminado)', value: null, check: true }, { label: 'Hoy', value: 1, check: false }, { label: 'Mañana', value: 2, check: false }, { label: 'Proximos 7 dias', value: 3, check: false }, { label: 'Ultimos 7 dias', value: 4, check: false }, { label: 'Mes en curso', value: 5, check: false }, { label: 'Vencidos', value: 6, check: false }])
  const [status, setStatus] = useState([{ label: 'Todo (Predeterminado)', value: null, check: true }, { label: 'Planeado', value: 2, check: false }, { label: 'En espera', value: 3, check: false }, { label: 'Concluido', value: 4, check: false }, { label: 'Cancelado', value: 5, check: false }])
  const [locations, setLocations] = useState([{ "label": "Todo (predeterminado)", value: "0", check: true }]);
  const [search, setSearch] = useState('');
  const [ordenes, setOrdenes] = useState([]);
  const [orderby, setOrderBy] = useState(false);
  const [results, setResults] = useState(0);
  const [beforeModalData, setBeforeModalData] = useState([]);
  const [beforeModalFilters, setBeforeModalFilters] = useState({});

  let statusName: any
  var dataTest: any;

  useEffect(() => {
    initOrders();
  }, []);

  const initOrders = async () => {
    setLoading(true);
    let locationList: any = await setLocationMethod();
    let typeList: any = await seTypeAsset();
    let response = await getService({
      'orderby': 'asset_type_name',
      'ordertype': 'ASC',
      'like': 'pend',
      'match': 'Buscar',
      'perpage': 10,
      'is_account_main_id': account,
    });
    setOrdenes(response.data.data);
    setResults(response.data.total_rows);
    setType(typeList);
    setLocations(locationList);
    setLoading(false);
  }
  const searchOrders = async (value: any, from: string) => {

    setLoading(true);
    let options: any = {

      is_account_main_id: account,
      perpage: 1000,
      orderby: 'asset_type_name',
      ordertype: (orderby) ? 'DESC' : 'ASC',
      es_service_status_cat_id: myWorkFilter.value,
      scheduled_date_auto: dateFilter.value,
      service_status_multi: (statusFilter.value.toString() === '') ? null : statusFilter.value.toString(),
      asset_type_id: (typeFilter.value.toString() === '') ? null : typeFilter.value.toString(),
      asset_location_id: locationFilter.value,
      match: 'Buscar...',
      mobile_searcher: (search === '') ? null : search
    };
    switch (from) {
      case 'myWork':
        options.es_service_status_cat_id = value;
        break;
      case 'date':
        options.scheduled_date_auto = value;
        break
      case 'status':
        if (value === [] || value === '') {
          options.service_status_multi = null;
        } else {
          options.service_status_multi = value;
        }
        break
      case 'type':
        if (value === [] || value === '') {
          options.asset_type_id = null;
          setTypeFilter({ title: 'Tipo', name: 'Hoy', isActive: false, value: [] })
        } else {
          options.asset_type_id = value;
        }
        break;
      case 'location':
        options.asset_location_id = value;
        break;
      case 'search':
        options.mobile_searcher = (value === '') ? null : value;
        break;
      case 'orderby':
        options.ordertype = (value) ? 'DESC' : 'ASC';
        break;
      default:
        break;
    }
    let response = await getService(options);
    setOrdenes(response.data.data);
    setResults(response.data.total_rows);
    setLoading(false);

  }

  const dateSelectFilter = async (l: any, i: any) => {
    let check = true;
    let title = ''
    await date.forEach((c) => { c.check = false });
    date[i].check = !l.check;
    if (l.value === null) {
      check = false;
      title = 'Fecha'
    } else {
      title = l.label
    }

    await setDateFilter({ title: title, name: l.label, value: l.value, isActive: check })
    await setDate(date);
    searchOrders(l.value, 'date')
    setModalVisible(false);
  }

  const statusSelectFilter = (l: any, i: any) => {
    let statusList = status.map((st) => {
      if (st.label == l.label) {
        return { ...st, check: !l.check }
      }
      return st
    });
    if (l.value == null) {
      statusList.forEach((r) => {
        r.check = false;
      })
      statusList[0].check = true;
      statusFilter.value = [];
      statusFilter.isActive = false;
      statusName = 'Estatus';
    } else {
      statusList[0].check = false;
      statusFilter.value = [];
      statusList.forEach((r: any) => {
        if (r.check) {
          statusFilter.value.push(r.value);
        }
      })
      statusName = 'Estatus '.concat(('(' + statusFilter.value.length + ')').toString())
    }
    setStatus(statusList);
  }

  const newTypeSelect = (l: any, i: any) => {
    let typeList = type.map((st) => {
      if (st.label == l.label) {
        return { ...st, check: !l.check }
      }
      return st
    });
    if (l.value == null || l.value == '0') {
      typeList.forEach((r) => {
        r.check = false;
      })
      typeList[0].check = true;
      typeFilter.value = [];
      typeFilter.isActive = false;
    } else {
      typeList[0].check = false;
      typeFilter.value = [];
      typeList.forEach((r: any) => {
        if (r.check) {
          typeFilter.value.push(r.value);
        }
      })
    }
    setType(typeList);
  }

  const locationMethod = (data: any, index: any) => {
    if (data.value === '0') {
      locations.forEach((element) => {
        if (element.value != '0') { element.check = false } else { element.check = true }
      });
      setLocationFilter({ title: 'Ubicacion', name: 'Hoy', isActive: false, value: null })
      setLocations(locations);
      searchOrders(null, 'location');
    } else {
      locations.forEach((element) => {
        if (element.value === locations[index].value) {
          element.check = true
        } else {
          element.check = false
        }
      })
      setLocationFilter({ title: 'Ubicacion', name: 'Hoy', isActive: true, value: locations[index].value })
      setLocations(locations);
      searchOrders(locations[index].value, 'location');
    }
    setModalLocationVisible(!modalLocationVisible);
  }

  const renderModalType = (typeData: any) => {
    return (
      <View style={[styles.modalViewMultiple, { height: 350 }]}>
        <ScrollView>
          {typeData.map((l: any, i: any) => (
            <View style={[styles.item2]}>
              <View style={{ width: '20%' }}>
                <CheckBox
                  center
                  checked={l.check}
                  checkedColor="#ff5faf"
                  wrapperStyle={{ height: 25, width: 25 }}
                  onPress={async () => {
                    await newTypeSelect(l, i);
                  }}
                />
              </View>
              <View style={{ width: '80%', marginTop: 15 }}>
                <Text style={{ fontSize: 16 }}>{l.label}</Text>
              </View>
            </View>
          ))
          }
        </ScrollView>
        <View style={[styles.item, { justifyContent: "flex-end", marginVertical: 20 }]}>
          <TouchableOpacity style={{ marginHorizontal: 15 }}>
            <Text style={{ color: 'red' }} onPress={async () => {
              setType(beforeModalData);
              setModalTypeVisible(false);
            }} >Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 15 }} onPress={() => {
            //setTypeFilter(typeFilter);
            setTypeFilter({ title: (typeFilter.value.length > 0) ? 'Tipo (' + typeFilter.value.length + ')' : 'Tipo', name: 'Estatus', value: typeFilter.value, isActive: !type[0].check })
            searchOrders(typeFilter.value.toString(), 'type');
            setModalTypeVisible(false);
          }}>
            <Text style={{ color: 'blue' }}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderModalStatus = (statusData: any) => {
    return (
      <View style={styles.modalViewMultiple}>
        <ScrollView>
          {statusData.map((l: any, i: any) => (
            <View style={[styles.item2]}>
              <View style={{ width: '20%' }}>
                <CheckBox
                  center
                  checked={l.check}
                  checkedColor="#ff5faf"
                  wrapperStyle={{ height: 25, width: 25 }}
                  onPress={async () => {
                    await statusSelectFilter(l, i);
                  }}
                />
              </View>
              <View style={{ width: '80%', marginTop: 15 }}>
                <Text style={{ fontSize: 16 }}>{l.label}</Text>
              </View>
            </View>
          ))
          }
        </ScrollView>
        <View style={[styles.item, { justifyContent: "flex-end", marginVertical: 20 }]}>
          <TouchableOpacity style={{ marginHorizontal: 15 }}>
            <Text style={{ color: 'red' }} onPress={() => {
              setStatus(beforeModalData);
              setModalMultiSelectVisible(false);
            }} >Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 15, marginRight: 30 }} onPress={() => {
            //setStatusFilter({ title: statusName, name: 'Estatus', value: statusFilter.value, isActive: !status[0].check })
            setStatusFilter({ title: (statusFilter.value.length > 0) ? 'Estatus (' + statusFilter.value.length + ')' : 'Estatus', name: 'Estatus', value: statusFilter.value, isActive: !status[0].check })
            searchOrders(statusFilter.value.toString(), 'status');
            setModalMultiSelectVisible(false);
          }}>
            <Text style={{ color: 'blue' }}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const dateListPipe = (date: string) => {
    let day: any = date.slice(-2)
    let month: any = date.substring(5, 7)
    let year = date.substring(0, 4);
    switch (month) {
      case '01':
        month = 'Ene';
        break;
      case '02':
        month = 'Feb';
        break;
      case '03':
        month = 'Mar';
        break;
      case '04':
        month = 'Abr';
        break;
      case '05':
        month = 'May';
        break;
      case '06':
        month = 'Jun';
        break;
      case '07':
        month = 'Jul';
        break;
      case '08':
        month = 'Ago';
        break;
      case '09':
        month = 'Sep';
        break;
      case '10':
        month = 'Oct';
        break;
      case '11':
        month = 'Nov';
        break;
      case '12':
        month = 'Dic';
        break;
    }
    let response = day + '-' + month + '-' + year;
    return response;
  }

  return (
    <View style={{ backgroundColor: '#dbd9da', flex: 0 }}>
      <View style={{ backgroundColor: '#ffffff' }}>
        <HeaderScreen title='Servicios' />
        <View>
          <View style={styles.container}>
            <Input multiline={false}
              autoCapitalize='none'
              clearTextOnFocus
              inputContainerStyle={styles.searchInput}
              containerStyle={{ height: 46 }}
              placeholder='Buscar...'
              leftIcon={
                <Icons
                  name='012-search'
                  size={20}
                />

              }
              onChangeText={(value) => { setSearch(value) }}
              value={search}
              onSubmitEditing={(ev) => {
                searchOrders(search, 'search');
              }}
            />

          </View>
          <View style={{ marginHorizontal: 5 }}>

            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
              <View style={{ flexDirection: 'row' }}>
                <Button
                  buttonStyle={[styles.buttonItemStyle, { backgroundColor: myWorkFilter.isActive ? '#4b92ee' : '#d8d8d8' }]}
                  titleStyle={{ fontSize: 10, fontWeight: 'bold', color: myWorkFilter.isActive ? '#ffffff' : '#000000', marginHorizontal: 5 }}
                  title={myWorkFilter.title} onPress={() => {
                    if (myWorkFilter.value === null) {
                      setMyWorkFilter({ title: myWorkFilter.title, name: myWorkFilter.title, value: 3, isActive: !myWorkFilter.isActive })
                      searchOrders(3, 'myWork');
                    } else {
                      setMyWorkFilter({ title: myWorkFilter.title, name: myWorkFilter.title, value: null, isActive: !myWorkFilter.isActive })
                      searchOrders(null, 'myWork');
                    }

                  }}></Button>
                <Button
                  buttonStyle={[styles.buttonItemStyle, { backgroundColor: dateFilter.isActive ? '#4b92ee' : '#d8d8d8' }]}
                  icon={{
                    name: 'expand-more',
                    size: 15,
                    color: dateFilter.isActive ? '#ffffff' : '#000000'
                  }}
                  iconRight
                  titleStyle={{ fontSize: 10, fontWeight: 'bold', color: dateFilter.isActive ? '#ffffff' : '#000000', marginLeft: 10 }}
                  title={dateFilter.title}
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                </Button>
                <Button
                  buttonStyle={[styles.buttonItemStyle, { backgroundColor: statusFilter.isActive ? '#4b92ee' : '#d8d8d8' }]}
                  icon={{
                    name: 'expand-more',
                    size: 15,
                    color: statusFilter.isActive ? '#ffffff' : '#000000'
                  }}
                  iconRight
                  titleStyle={{ fontSize: 10, fontWeight: 'bold', color: statusFilter.isActive ? '#ffffff' : '#000000', marginLeft: 10 }}
                  title={statusFilter.title}
                  onPress={() => {
                    setModalMultiSelectVisible(true);
                  }}></Button>
                <Button
                  buttonStyle={[styles.buttonItemStyle, { backgroundColor: typeFilter.isActive ? '#4b92ee' : '#d8d8d8' }]}
                  titleStyle={{ fontSize: 10, fontWeight: 'bold', color: typeFilter.isActive ? '#ffffff' : '#000000', marginLeft: 10 }}
                  icon={{
                    name: 'expand-more',
                    size: 15,
                    color: typeFilter.isActive ? '#ffffff' : '#000000'
                  }}
                  iconRight
                  title={typeFilter.title}
                  onPress={() => {
                    //setTypeFilter({ title: typeFilter.title, name: typeFilter.title, value: typeFilter.title, isActive: !typeFilter.isActive })
                    setModalTypeVisible(true)
                  }}></Button>
                <Button
                  buttonStyle={[styles.buttonItemStyle, { backgroundColor: locationFilter.isActive ? '#4b92ee' : '#d8d8d8' }]}
                  titleStyle={{ fontSize: 10, fontWeight: 'bold', color: locationFilter.isActive ? '#ffffff' : '#000000', marginLeft: 10 }}
                  title={locationFilter.title}
                  icon={{
                    name: 'expand-more',
                    size: 15,
                    color: locationFilter.isActive ? '#ffffff' : '#000000'
                  }}
                  iconRight
                  onPress={() => {
                    setModalLocationVisible(true);
                    /*setLocationFilter(
                      {
                        title: locationFilter.title,
                        name: locationFilter.title, value: locationFilter.title, isActive: !locationFilter.isActive
                      })*/
                  }}>

                </Button>
                <View style={{ borderLeftColor: '#d8d8d8', borderLeftWidth: 1 }}>
                  <Button
                    buttonStyle={[styles.buttonItemStyle, { backgroundColor: 'transparent' }]}
                    type='clear'
                    titleStyle={{ fontSize: 14, color: '#b1cef6' }}
                    title='LIMPIAR' onPress={() => {
                      //setModalLocationVisible(true);
                      setMyWorkFilter({ title: 'Mi trabajo', name: 'Hoy', isActive: false, value: null })
                      setDateFilter({ title: 'Fecha', name: 'Hoy', isActive: false, value: null })
                      setStatusFilter({ title: 'Estatus', name: 'Estatus', isActive: false, value: [] })
                      setTypeFilter({ title: 'Tipo', name: 'Hoy', isActive: false, value: [] })
                      setLocationFilter({ title: 'Ubicacion', name: 'Hoy', isActive: false, value: null })
                      initOrders();
                    }}>

                  </Button>
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={[styles.item, { marginVertical: 5, marginHorizontal: 20 }]}>
            <TouchableOpacity style={{ width: '40%' }} onPress={() => {
              setOrderBy(!orderby);
              searchOrders(orderby, 'orderby')
            }}>
              <View style={styles.item}>
                <Icons
                  style={{ marginTop: 7, marginRight: 5, fontWeight: 'bold' }}
                  name='013-up-down'
                  size={15}
                  color='black'
                />
                <Text style={{ fontSize: 15, marginTop: 5, fontWeight: '600' }} >Fecha programada</Text>
              </View>
            </TouchableOpacity>
            <View style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              width: '60%'
            }}>

              <Text style={{ fontSize: 12, marginTop: 5, textAlign: 'right', color: 'gray' }}>{results} Resultados</Text>
            </View>
          </View>
        </View>
      </View>
      {
        (loading) ? (
          <LoadingComponent />
        ) :
          (
            <>
              <ScrollView>
                {ordenes.map((l, i) => (
                  <ListItem
                    key={i}
                    style={{ paddingVertical: 5 }}
                  >
                    <ListItem.Content>
                      <View style={styles.item2}>
                        <View style={{ marginEnd: 5, width: '20%', height: 25, borderRadius: 10, backgroundColor: l.service_status_name === 'Planeado' ? '#81e2e9' : l.service_status_name === 'Cancelado' ? '#F76B4A' : l.service_status_name === 'Concluido' ? '#5ee275' : l.service_status_name === 'En Proceso' ? '#fde94a' : '#f6a25c' }}>
                          <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 12, color: '#000000', fontWeight: '600' }}> {l.service_status_name} </Text>
                        </View>
                        <View style={{ width: '25%', height: 25, borderRadius: 10, backgroundColor: '#d8d8d8' }}>
                          <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 12, color: '#000000', fontWeight: '600' }}> {dateListPipe(l.scheduled_date)} </Text>
                        </View>
                        <View style={{ width: '55%' }}>
                          <View style={{ height: 25 }}>
                            <TouchableOpacity>
                              <Text style={{ textAlign: 'right' }}>
                                <Icon
                                  name='ellipsis-v'
                                  size={15}
                                  color="#8a8889"
                                />
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <ListItem.Title
                        style={{ color: 'black', fontWeight: '600', marginVertical: 5, fontSize: 18 }}
                      >
                        {l.service_type_name}
                      </ListItem.Title>
                      <View style={styles.item2}>
                        <Icons
                          name='016-cardiogram'
                          size={14}
                          color='#888888' />
                        <Text style={{ color: '#888888', fontSize: 12, marginLeft: 5 }}>{l.asset_type_name}</Text>
                      </View>
                      <View style={[styles.item2, { width: '100%' }]}>
                        <View style={[styles.item2, { width: '40%' }]}>
                          <Icons
                            name='015-location'
                            size={14}
                            color='#888888' />
                          <Text style={{ color: '#888888', fontSize: 12, marginLeft: 5 }}>{l.asset_location_name}</Text>
                        </View>
                        <View style={{
                          alignSelf: "flex-end",
                          width: '60%',
                          flexDirection: "row", justifyContent: "flex-end",
                        }}>
                          <View style={[{ width: 130, height: 25, backgroundColor: '#d8d8d8', borderRadius: 10 }]}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000', textAlign: 'center', marginTop: 2 }}>{'#' + l.id_tinc} </Text>
                          </View>
                        </View>
                      </View>
                    </ListItem.Content>
                  </ListItem>
                ))}
              </ScrollView>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onShow={() => {
                  setBeforeModalData(date);
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    height: '100%',
                    backgroundColor: '#000000',
                    opacity: 0.5
                  }}
                  onPress={() => {
                    setDate(beforeModalData)
                    setModalVisible(false);
                  }}
                />
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <ScrollView>
                      {date.map((l, i) => (
                        <View style={{ height: 50, margin: 0, borderBottomWidth: (i + 1 != date.length) ? 1 : 0, borderBottomColor: '#D8D8D8' }}>
                          <TouchableOpacity onPress={() => { dateSelectFilter(l, i) }}>
                            <View style={[styles.item, { width: '100%' }]}>
                              <View style={{ marginTop: 10 }}>
                                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 14 }} >
                                  {l.label}
                                </Text>
                              </View>
                              <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                <CheckBox
                                  containerStyle={{ width: 25, height: 45, margin: 0, backgroundColor: 'transparent' }}
                                  checkedColor="#ff5faf"
                                  iconRight
                                  center
                                  checkedIcon="dot-circle-o"
                                  uncheckedIcon="circle-o"
                                  checked={l.check}
                                  onPress={() => { dateSelectFilter(l, i) }}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))
                      }
                    </ScrollView>
                  </View>
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalMultiSelectVisible}
                onShow={() => {
                  setBeforeModalData(status);
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    height: '100%',
                    backgroundColor: '#000000',
                    opacity: 0.5
                  }}
                  onPress={() => {
                    setStatus(beforeModalData);
                    setModalMultiSelectVisible(false);
                  }}
                />
                <View style={styles.centeredView}>
                  {renderModalStatus(status)}
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalTypeVisible}
                onShow={async () => {
                  await setBeforeModalData(type);
                  setBeforeModalFilters(typeFilter);
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    height: '100%',
                    backgroundColor: '#000000',
                    opacity: 0.5
                  }}
                  onPress={() => {
                    seTypeAsset(beforeModalData);
                    setModalTypeVisible(!modalTypeVisible);
                  }}
                />
                <View style={[styles.centeredView]}>
                  {renderModalType(type)}
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalLocationVisible}
                onShow={() => {
                  setBeforeModalData(locations);
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    height: '100%',
                    backgroundColor: '#000000',
                    opacity: 0.5
                  }}
                  onPress={() => {
                    setLocations(beforeModalData)
                    setModalLocationVisible(!modalLocationVisible);
                  }}
                />
                <View style={[styles.centeredView]}>
                  <View style={[styles.modalView, { height: 350 }]}>
                    <ScrollView>
                      {locations.map((l: any, i) => (
                        <View style={[styles.item2, { borderBottomWidth: (i + 1 != locations.length) ? 1 : 0, borderBottomColor: '#D8D8D8' }]}>
                          <View style={{ width: '80%' }}>
                            <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 14 }}>
                              {l.label}
                            </Text>
                          </View>
                          <View style={{ width: '20%' }}>
                            <CheckBox
                              center
                              containerStyle={{ width: 25, height: 45, margin: 0, backgroundColor: 'transparent' }}
                              checkedColor="#ff5faf"
                              checkedIcon="dot-circle-o"
                              uncheckedIcon="circle-o"
                              checked={l.check}
                              onPress={() => {
                                //setModalLocationVisible(!modalLocationVisible);
                                locationMethod(l, i);
                              }}
                            />
                          </View>
                        </View>
                      ))
                      }
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            </>
          )
      }
    </View>
  )
}
const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    height: 40
  },
  container: {
    display: 'flex',
    padding: 4,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  },
  header: {
    height: 50,

  },

  fontWhite: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 15
  },
  buttonItemStyle: {
    backgroundColor: '#d8d8d8',
    borderRadius: 25,
    marginHorizontal: 5,
  },
  buttonItemStyle2: {
    backgroundColor: '#4A92EE',
    borderRadius: 25,
    marginHorizontal: 5,
    width: 90,
  },
  input: {
    height: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: '#f1f1f1'
  },
  searchInput: {
    height: 36,
    alignSelf: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10
  },
  item: {
    display: 'flex',
    flexDirection: 'row'
  },
  item2: {
    display: 'flex',
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: '55%',
    marginHorizontal: '10%',
    position: 'absolute',
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
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
  modalViewMultiple: {
    width: 300,
    backgroundColor: "white",
    paddingLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 12,
    fontWeight: 'bold'
  }
})
