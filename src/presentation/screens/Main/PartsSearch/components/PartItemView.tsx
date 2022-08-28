import React from "react";
import { Image, StyleSheet, Text, TextStyle, View } from "react-native";
import { TouchableFeedback } from "../../../../shared/components/TouchableFeedback";
import { PartItem, PartMaterialItem } from "../bloc/PartsSearchState";
import uuid from 'react-native-uuid';
import BouncyCheckbox from "react-native-bouncy-checkbox";
export interface Props {
    item: PartItem;
    materialsSelected: PartMaterialItem[];
    onPress?: (item: PartItem) => void;
    onItemSelected?: (item: PartMaterialItem, isSelected: boolean) => void;
}

export const PartSearchItemView = ({
    item,
    materialsSelected,
    onPress,
    onItemSelected }: Props) => {

    const getStylesStock = (): TextStyle => {
        if (item.stock > 3) {
            return styles.fontBlacKSecondary
        } else if (item.stock > 0) {
            return {
                ...styles.fontBlacKSecondary,
                color: 'red'
            }
        } else {
            return {
                ...styles.fontBlacKSecondary,
                color: 'red',
                fontWeight: 'bold'
            }
        }
    }

    const getTextStock = (): string => {
        if (item.stock > 0) {
            return `${item.stock} partes disponibles`
        } else {
            return `Agotado`
        }
    }


    return (

        <View style={{
            backgroundColor: '#FFFFFF',
        }}>
            <TouchableFeedback
                contentStyle={[{ paddingVertical: 4, }]}
                onPress={() => {
                    if (onPress) {
                        onPress(item)
                    }
                }}>
                <View style={styles.rowView}>
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
                        <View style={{
                            justifyContent: 'center',
                            flex: 1
                        }}>
                            <Text style={styles.fontName} numberOfLines={1} >{item.name}</Text>
                        </View>
                        {/*  END: Header */}
                        <View style={[styles.rowView, { flex: 1, marginTop: 1 }]}>
                            <Text style={styles.fontBlacKSecondary}>No. Parte: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.numPart}</Text>
                            <Text>{'  '}</Text>
                            <Text style={styles.fontBlacKSecondary}>Marca: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.brand}</Text>
                            <Text>{'  '}</Text>
                            <Text style={styles.fontBlacKSecondary}>Clase: </Text><Text style={styles.fontGraySecondary} numberOfLines={1}>{item.classPart}</Text>
                        </View>
                        <View style={[styles.rowView, { flex: 1, marginTop: 1 }]}>
                            <Text style={getStylesStock()}> {getTextStock()} </Text>
                        </View>

                    </View>
                </View>
            </TouchableFeedback>
            {item.isSelected &&
                <View style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
                    <View style={{
                        ...styles.rowView,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderBottomColor: 'black',
                        borderBottomWidth: 1
                    }}>
                        <View style={{ flex: 1 }} />
                        <Text style={{ flex: 3 }}>No. de Serie</Text>
                        <Text style={{ flex: 3 }}>Caducidad</Text>
                    </View>
                    {item.material.map((element) => (
                        <View key={`${uuid.v4()}`} style={{
                            ...styles.rowView,
                            paddingVertical: 8,
                            paddingHorizontal: 16
                        }}>
                            <BouncyCheckbox
                                key={`${uuid.v4()}`}
                                size={18}
                                fillColor='#fc41a0'
                                isChecked={materialsSelected.filter((it) => it.id === element.id).length > 0}
                                style={{
                                    flex: 1,
                                    justifyContent: 'center'
                                }}
                                iconStyle={{
                                    borderWidth: 2,
                                    borderColor: '#fc41a0',
                                    borderRadius: 0,
                                }}
                                onPress={(isChecked: boolean) => {
                                    if (onItemSelected) {
                                        onItemSelected(element, isChecked)
                                    }
                                }}
                            />
                            <Text style={{ flex: 3 }}>
                                {element.serial}
                            </Text>
                            {element.dueDate &&
                                <Text style={{ flex: 3 }}>
                                    {element.dueDate}
                                </Text>
                            }
                            {!element.dueDate &&
                                <Text style={{ flex: 3 }}>
                                    N/A
                                </Text>
                            }
                        </View>
                    ))}
                </View>
            }
        </View>
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
        fontWeight: 'bold'
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