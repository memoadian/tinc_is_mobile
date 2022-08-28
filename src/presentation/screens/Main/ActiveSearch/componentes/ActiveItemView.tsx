import { Chip } from "@rneui/themed";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableFeedback } from "../../../../shared/components/TouchableFeedback";
import { ActiveItem } from "../bloc/ActiveSearchState";

export interface Props {
    item: ActiveItem;
    onPress?: (item: ActiveItem) => void;
}

export const ActiveItemView = ({ item, onPress }: Props) => {
    return (
        <TouchableFeedback onPress={() => {
            if (onPress) {
                onPress(item)
            }
        }}>
            <View style={[styles.rowView, { paddingVertical: 4, backgroundColor: (item.isSelected) ? '#C3D6FF' : '#FFF' }]}>
                {item.image === '' &&
                    <Image
                        source={require('../../../../assets/img/TincIsotipo_mgmjnt.png')}
                        style={{ ...styles.image, }} />}
                {item.image !== '' &&
                    <Image
                        source={{ uri: `${item.image}` }}
                        style={{ ...styles.image }} />}
                <View style={[styles.textContainer]}>
                    {/*  START: Header */}
                    <View style={[styles.rowView]} >
                        {/* NOMBRE */}
                        <View style={{
                            justifyContent: 'center',
                            flex: 1
                        }}>
                            <Text style={styles.fontName} numberOfLines={1} >{item.asset_type_name}</Text>
                        </View>
                        {/* NUMERO */}
                        <View style={{
                            flex: 1,
                            marginEnd: 4,
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }}>
                            <Chip
                                title={`${item.idTinc}`}
                                buttonStyle={{ backgroundColor: '#d8d8d8', height:20,paddingVertical: 0}}
                                titleStyle={{ fontSize: 14, color: '#000000', }} />
                        </View>
                    </View>
                    {/*  END: Header */}
                    <View style={[styles.rowView, { flex: 1, marginTop: 1 }]}>
                        <Text style={styles.fontBlacKSecondary}>Marca: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.asset_brand_name}</Text>
                        <Text>{'  '}</Text>
                        <Text style={styles.fontBlacKSecondary}>Modelo: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.model}</Text>
                        <Text>{'  '}</Text>
                        <Text style={styles.fontBlacKSecondary}>Serie: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.serialNumber}</Text>
                    </View>
                    <View style={[styles.rowView, { flex: 1, marginTop: 1 }]}>
                        <Text style={styles.fontBlacKSecondary}>Ubicación: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.locationName}</Text>
                        <Text>{'  '}</Text>
                        <Text style={styles.fontBlacKSecondary}>Sub Ubicación: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.sublocationName}</Text>
                    </View>
                </View>
            </View>
        </TouchableFeedback >
    );
}

const styles = StyleSheet.create({
    image: {
        margin: 8,
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#D8D8D8'
    },
    textContainer: {
        justifyContent: 'center',
        marginEnd: 4,
        marginStart: 4,
        flex: 1,
    },
    rowView: {
        flexDirection: 'row'
    },
    fontBlacKSecondary: {
        flexWrap: 'wrap',
        color: '#000',
        fontSize: 10,
        fontWeight: '500'
    },
    fontGraySecondary: {
        flex: 1,
        flexWrap: 'wrap',
        color: '#717071',
        fontSize: 10,
        fontWeight: '500'
    },
    fontName: {
        flexWrap: 'nowrap',
        color: '#000',
        fontSize: 14,
    }
})