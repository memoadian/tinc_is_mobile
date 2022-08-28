import { Text } from "@rneui/themed";
import React, { useContext, useEffect, useState} from 'react';
import { StyleSheet, View } from "react-native";
import { TouchableFeedback } from "../../../../shared/components/TouchableFeedback";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Part } from "../../../../../domain/ServiceItem/models/Service.model";
import { getCurrencySettings, stringToCurrency } from "../../../../shared/util/Currency";
import { AuthContext } from "../../../../core/Context/AuthContext";

export interface Props {
    part: Part,
    isLast: boolean,
    onOptionPress: (part: Part) => void,
    currency:string
}

export const PartItemComponent = ({ part, isLast, onOptionPress,currency }: Props) => {
    
    const [currencyName, setCurrencyName] = useState('');
    const { getCurrency } = useContext(AuthContext);

     useEffect(() => {
        setCurrencyName(currency);
    },[]);
    
    return (
        <View style={[styles.part, isLast ? null : styles.underLinePart]}>
            <View style={styles.leftPart}>
                <View style={styles.count}>
                    <Text style={styles.countNumber}>{part.quantity}</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.partName}>{part.is_ccount_part_name}</Text>
                    <Text style={styles.partSerial}>Serial: {part.part_material_serial_number}</Text>
                </View>
            </View>
            <View style={styles.rightPart}>
                <Text style={{fontSize:14}}> {getCurrencySettings(currencyName)}  {stringToCurrency(Number(part.average_cost))}</Text>
                <TouchableFeedback
                    onPress={() => { onOptionPress(part) }}
                >
                    <Icon
                        name='ellipsis-v'
                        size={12}
                        style={{ paddingHorizontal: 6 }}
                    />
                </TouchableFeedback>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    part: {
        padding: 8,
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    leftPart: {
        flexDirection: 'row'
    },
    rightPart: {
        alignItems: "flex-end"
    },
    underLinePart: {
        borderBottomColor: '#979797',
        borderBottomWidth: 1,
    },
    count: {
        backgroundColor: '#D8D8D8',
        padding: 8,
        borderRadius: 10
    },
    countNumber: {
        fontSize: 12
    },
    body: {
        marginHorizontal: 22
    },
    partName: {
        fontSize: 14,
        fontWeight: '400',
        color: '#000000'
    },
    partSerial: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8C8C8C'
    }
})