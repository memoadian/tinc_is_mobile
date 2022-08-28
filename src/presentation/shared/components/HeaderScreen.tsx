import { Text } from '@rneui/themed'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

interface Props {
    title: string;
}

export const HeaderScreen = ({ title}: Props) => {
    return (
        <View style={styles.viewShadow}>
            <LinearGradient
                style={{
                    paddingVertical: 8,
                }}
                colors={['#0D419A', '#4596E7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} >
                <Text style={styles.title}>{title}</Text>
            </LinearGradient>
        </View >
    )
}

const styles = StyleSheet.create({
    viewShadow: {
        marginBottom: 5,
        shadowColor: '#303838',
        shadowOffset: {
            width: 10,
            height: 25,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        color: '#ffffff',
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 16,
    }
});