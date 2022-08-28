import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

export const LoadingComponent = () => {
  return (
    <LinearGradient colors={['#0D419A', '#4596E7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
        <ActivityIndicator
          size={50}
          color='white'
        />
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  gradient: {
      width: '100%',
      height: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  }
})
