import { Text } from '@rneui/themed'
import React from 'react'
import { StyleSheet, View } from 'react-native'

interface Props {
    title: string
}

export const HeaderSectionList = ({ title }: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titleList}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#d8d8d8'
    },
    titleList: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginVertical: 4,
        marginHorizontal: 15,
        flexDirection: 'row',
        alignContent: 'space-between'
    },
})