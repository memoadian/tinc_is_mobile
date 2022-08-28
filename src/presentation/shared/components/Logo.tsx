import { Image } from '@rneui/themed'
import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { AppConstants } from '../../config/constants';

const welcomeText = 'Bienvenido a TINC CMMS';

export const Logo = () => {
  return (
    <View style={[styles.title_general, styles.item]}>
      <Image
        source={{ uri: AppConstants.DEFAULT_IMAGE }}
        containerStyle={styles.image}
      />
      <View style={[styles.title_general, styles.text_Center]}>
        <Text style={[styles.textTitle, styles.fontWhite]}>{welcomeText}</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  title_general: {
    marginBottom: 0,
    fontSize: 50

  },
  text_Center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 25
  },
  item: {
    width: '100%',    
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',

  },

  textTitle: {
    fontSize: 20,
    marginTop: 15,
    fontWeight: 'bold'
  },
  fontWhite: {
    color: '#ffffff'
  }
})
