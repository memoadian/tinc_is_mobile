import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TButton } from '../../../../shared/components/TButton'
import { ResumeCellEntity } from '../bloc/HomeState'

interface Props {
    item: ResumeCellEntity;
    onConsult: () => void;
}

export const ItemResumeList = ({ item, onConsult }: Props) => {
    return (
        <View style={{ backgroundColor: '#FFF', padding: 4 }} >
            <Text style={{ marginHorizontal: 8, marginVertical: 4 }}>{item.subtitle}</Text>
            <View style={styles.item}>
                <Text style={{ fontWeight: 'bold', marginTop: 10, marginLeft: 50, fontSize: 14 }}>{item.resume}</Text>
                <TButton
                    title='Consultar'
                    type='primary_rounded'
                    disable={!item.enable}
                    onPress={onConsult}
                    contentStyle={{ paddingVertical: 3 }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginRight: 100
    },
    titleList: {
        fontSize: 15,
        fontWeight: 'bold',
        marginVertical: 5,
        marginHorizontal: 30,
        flexDirection: 'row',
        alignContent: 'space-between'
    },
})