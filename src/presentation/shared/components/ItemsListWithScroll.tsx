import { Avatar, ListItem, Text, Button } from '@rneui/themed'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native';

const list = [
    {
      programados: ' programados en el mes',
      concluidos: ' concluidos en el mes',
      vencidos: ' vencidos'
    },
  ];
const servicio =' de Servicio'
export const ItemsListWithScroll = ({title}:any) => {
  return (
    <View>
          <Text style={styles.titleList}>{title}{servicio}</Text>
          {
          list.map((l:any, i:any) => (
              <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Subtitle style={{marginHorizontal:15}}>{title ==='Ordenes'?'Servicios':'Tickets'}{l.programados}</ListItem.Subtitle>
                <View style={styles.item}>
                  <Text style={{fontWeight:'bold',  marginTop:5}}>15 {title ==='Ordenes'?'Servicios':'Tickets'}</Text>
                  <Button title="Consultar" buttonStyle={styles.buttonItemStyle} titleStyle={styles.buttonTitleStyle}/>
                </View>
                <ListItem.Subtitle style={{marginHorizontal:15}}>{title ==='Ordenes'?'Servicios':'Tickets'}{l.concluidos}</ListItem.Subtitle>
                <View style={styles.item}>
                  <Text style={{fontWeight:'bold', marginTop:5}}>15 {title ==='Ordenes'?'Servicios':'Tickets'}</Text>
                  <Button title="Consultar" buttonStyle={styles.buttonItemStyle} titleStyle={styles.buttonTitleStyle}/>
                </View>
                <ListItem.Subtitle style={{marginHorizontal:15}}>{title ==='Ordenes'?'Servicios':'Tickets'}{l.vencidos}</ListItem.Subtitle>
                <View style={styles.item}>
                  <Text style={{fontWeight:'bold', marginTop:5}}>15 {title ==='Ordenes'?'Servicios':'Tickets'}</Text>
                  <Button title="Consultar" buttonStyle={styles.buttonItemStyle} titleStyle={styles.buttonTitleStyle}/>
                </View>
              </ListItem.Content>
            </ListItem>
          ))
        }
    </View>
  )
}
const styles = StyleSheet.create({
  item:{
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  
    
  },
  titleList: {
      fontSize: 15,
      fontWeight:'bold',
      marginVertical:10,
      marginHorizontal: 30,
      flexDirection: 'row',
      alignContent: 'space-between'
  },
  buttonItemStyle:{
    backgroundColor: '#20BFC8',
    height:5,
    borderRadius: 25,
    marginHorizontal:30,
    },
    
    buttonTitleStyle:{
      fontWeight: 'bold', 
      fontSize:14,
      marginHorizontal:30 
    }
  })