import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableFeedback } from "../../../../shared/components/TouchableFeedback";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AnnexesData } from "../bloc/AnnexesServiceState";

export interface Props {
    item: AnnexesData,
    onDownloadPress: (url: string) => void;
    onOptionPress: (item: any) => void;
}

export const ItemAnnexView = ({
    item,
    onDownloadPress,
    onOptionPress }: Props) => {
    return (
        <View style={[styles.container]}>
            <TouchableFeedback
                onPress={() => {
                    onDownloadPress(item.url)
                }}>
                <Image
                    style={{
                        height: 30,
                        width: 30
                    }}
                    source={require('../../../../assets/img/ic_download.png')}
                />
            </TouchableFeedback>
            <View style={styles.body}>
                <Text style={styles.partName}>{item.name}</Text>
            </View>
            <TouchableFeedback
                onPress={() => { onOptionPress(item) }}
            >
                <Icon
                    name='ellipsis-v'
                    size={12}
                    style={{ paddingHorizontal: 6 }}
                />
            </TouchableFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftPart: {
        flexDirection: 'row'
    },
    rightPart: {
    },
    underLinePart: {
        borderBottomColor: '#979797',
        borderBottomWidth: 12
    },
    body: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 16,
        flexWrap: 'wrap',
    },
    partName: {
        flex: 1,
        fontSize: 12,
        fontWeight: '400',
        color: '#000000'
    },
    partSerial: {
        fontSize: 10,
        fontWeight: '600',
        color: '#8C8C8C'
    }
})