import { Text, Button } from '@rneui/themed';
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const {width: windowsWidth} = Dimensions.get('window');

let state = {
    activeIndex:0,
    carouselItems: [
    {
        title:"Item 1",
        text: "Text 1",
    },
    {
        title:"Item 2",
        text: "Text 2",
    },
    {
        title:"Item 3",
        text: "Text 3",
    },
    {
        title:"Item 4",
        text: "Text 4",
    },
    {
        title:"Item 5",
        text: "Text 5",
    },
  ]
}
const _renderItem = (item:any) => {
    return (
        <View style={style.carrousel}>
          <Text style={style.userTitle}>{item.title}</Text>
          <Text style={style.imagen}>Imagen</Text>
          <Text style={style.title}>{item.text}</Text>
          <Button
              title="Ir a "
              titleStyle={{ fontWeight: '700' }}
              buttonStyle={{
                backgroundColor: 'rgba(90, 154, 230, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30,
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 170,
                marginVertical: 10,
              }}
            />
      </View>
    );
}

export const CarouselComponent = () => {
    
  return (
    <Carousel
              layout={"default"}
              data={state.carouselItems}
              renderItem={({item}:any)=>_renderItem(item)}
              sliderWidth={windowsWidth}
              itemWidth={windowsWidth}
              itemHeight={350}
              style={{backgroundColor:'black'}}
            />
  )
}
const style = StyleSheet.create({
    container:{
      flex:1
    },
    carrousel:{
      height:350,
      backgroundColor:'green'
    },
    userTitle:{
      marginTop:20,
      fontSize:25,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    title:{
      textAlign: 'center',
      marginTop:20,
      marginBottom:10,
      fontSize:20,
    },
    imagen:{
      textAlign: 'center',
      marginTop:10,
      height: 160,
      width: 160,
      backgroundColor:'red',
      marginHorizontal: 185
    }
  })