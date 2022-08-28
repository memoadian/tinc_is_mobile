import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { FontelloIcon } from '../../../../shared/components/Icon';
import TabLayout from 'react-native-simple-tablayout';
import { TouchableFeedback } from '../../../../shared/components/TouchableFeedback';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/base';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../../../shared/navigation/MainNavigator';
import { TabRequestView } from './TabRequestView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabDiagnosticView } from './TabDiagnosticView';
import { TabAnnexesTicketState } from './TabAnnexesTicketView';
import { TabSignatureTicketView } from './TabSignatureTicketView';


const { width } = Dimensions.get('window');
export const Screen1 = (props) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', width, backgroundColor: props.color, justifyContent: 'center' }}>
      <Text>{props.text}</Text>
    </View>
  )
}

export interface TicketItemProps extends StackScreenProps<RootStackParams, 'TicketItemScreen'> { }

export const TicketItemPage = ({ navigation, route }: TicketItemProps) => {
  const nav = useNavigation();
  const [hasPermission, setHasPermission] = useState(true);
  const tabName: string[] = ['Solicitud', 'Diagnóstico', 'Firmas', 'Anexos'];
  const data = [
    <TabRequestView
      idTicket={route.params.onReturn()}
      hasPermissions={hasPermission}
    />,
    <TabDiagnosticView
      idTicket={route.params.onReturn()}
      hasPermissions={hasPermission}
    />,
    <TabSignatureTicketView
      idTicket={route.params.onReturn()}
      hasPermissions={hasPermission}
    />,
    <TabAnnexesTicketState
      idTicket={route.params.onReturn()}
      hasPermissions={hasPermission} />,
  ];

  useEffect(() => {
    AsyncStorage.getItem('data').then((token: any) => {
      const list = JSON.parse(token);
      const role = list.data.id_role;
      setHasPermission(['2', '3'].includes(role));
    })
  });

  return (
    <SafeAreaView
      style={styles.AndroidSafeArea}
    >
      <TouchableFeedback onPress={() => { nav.goBack() }}>
        <LinearGradient
          style={{
            paddingVertical: 8,
            marginBottom: 0
          }}
          colors={['#3571c9', '#3571c9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontelloIcon
            style={{
              marginLeft: 10
            }}
            color='white'
            name='001-arrow'
            size={20}
          />
        </LinearGradient>
      </TouchableFeedback>
      <View style={{ height: '96%' }}>
        <TabLayout
          screens={data}
          tabName={tabName}
          indicatorHeight={3}
          indicatorRadius={5}
          titleFontSize={14}
          titleColor="white"
          tabHeight={46}
          tabColor="#3571c9"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '100%',
    paddingHorizontal: 8,
    height: 50
  },
  title: {
    fontWeight: '600',
    color: 'black'
  },
  button: {
    fontWeight: '400',
    color: 'black'
  },
  titleInput: {
    marginHorizontal: 10,
    marginBottom: 4,
    marginTop: 8
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  buttonItemStyle: {
    backgroundColor: '#e92267',
    height: 35,
    width: 120,
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 10,
  },
  buttonTitleStyle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginHorizontal: 4
  }
})
