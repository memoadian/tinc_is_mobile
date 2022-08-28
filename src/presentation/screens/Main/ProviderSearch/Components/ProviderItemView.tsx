import { Chip, Text } from '@rneui/themed';
import React from 'react'
import { Image, StyleSheet, View } from 'react-native';
import { TouchableFeedback } from '../../../../shared/components/TouchableFeedback';
import { ProviderItem } from '../ProviderSearchState';

export interface Props {
    item: ProviderItem;
    onPress?: (item: ProviderItem) => void;
}

export const ProviderItemView = ({ item, onPress }: Props) => {
    return (
        <TouchableFeedback onPress={() => {
            if (onPress) {
                onPress(item)
            }
        }}>
            <View style={[styles.rowView, { paddingVertical: 4, backgroundColor: (item.isSelected) ? '#C3D6FF' : '#FFFFFF' }]}>
                {item.image === '' &&
                    <Image
                        source={require('../../../../assets/img/TincIsotipo_mgmjnt.png')}
                        style={{ ...styles.image, }} />}
                {item.image !== '' && <Image
                    source={{ uri: `${item.image}` }}
                    style={{ ...styles.image }} />
                }
                <View style={[styles.textContainer]}>
                    {/*  START: Header */}
                    <View style={[styles.rowView]} >
                        {/* NOMBRE */}
                        <View style={{
                            justifyContent: 'center',
                            flex: 1
                        }}>
                            <Text style={styles.fontName} numberOfLines={1} >{item.name}</Text>
                        </View>
                        {/* NUMERO */}
                        <View style={{
                            flex: 1,
                            marginEnd: 4,
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }}>
                            <Chip
                                title={`${item.id_tinc}`}
                                buttonStyle={{ backgroundColor: '#d8d8d8', height:20,paddingVertical: 0}}
                                titleStyle={{ fontSize: 14, color: '#000000', }} />
                        </View>
                    </View>
                    {/*  END: Header */}
                    <View style={[styles.rowView, { flex: 1, marginTop: 1 }]}>
                        <Text style={styles.fontBlacKSecondary}>Razón Social: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.bussinessName}</Text>
                    </View>
                    <View style={[styles.rowView, { flex: 1, marginTop: 1 }]}>
                        <Text style={styles.fontBlacKSecondary}>País: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.country_name}</Text>
                        <Text>{'  '}</Text>
                        <Text style={styles.fontBlacKSecondary}>Estado: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.state}</Text>
                        <Text>{'  '}</Text>
                        <Text style={styles.fontBlacKSecondary}>Ciudad: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.city}</Text>
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
        color: '#000000',
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
        color: '#000000',
        fontSize: 14,
    }
})