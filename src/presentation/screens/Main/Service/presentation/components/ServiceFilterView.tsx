import { Button, Input } from '@rneui/themed';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ServiceFilterContext } from '../context/ServiceFilterContext';
import { useForm } from '../../../../../shared/hooks/useForm';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FontelloIcon } from '../../../../../shared/components/Icon';

interface Props {
    onChangeSearchText: (text: string) => void;
    onSearchByText: (text: string) => void;
    onMyWorkPress: () => void;
    onDatePress: () => void;
    onStatusPress: () => void;
    onPriorityPress: () => void;
    onLocationPress: () => void;
    onRequestType: () => void;
    onCleanPress: () => void;
}

export const ServiceFilterView = ({
    onChangeSearchText,
    onSearchByText,
    onMyWorkPress,
    onDatePress,
    onStatusPress,
    onPriorityPress,
    onLocationPress,
    onRequestType,
    onCleanPress }: Props) => {

    const { filterState: { myWork, date, status, priority, location, requestType } } = useContext(ServiceFilterContext);

    const { search, onChange } = useForm({
        search: ''
    });

    const dateTitle = (value?: number[] | null): string => {
        if (value == null)
            return 'Fecha'
         switch (value[0]) {
            case 1:
                return 'Hoy'
            case 2:
                return 'Mañana'
            case 3:
                return 'Próximos 7 días'
            case 4:
                return 'Últimos 7 días'
            case 5:
                return 'Mes en curso'
            case 6:
                return 'Vencido'
            default:
                return 'Fecha'
        } 
    }

    const statusTitle = (status?: number[] | null): string => {       
        if (status && status.filter(value => value != 0).length > 0) {
            return `Estatus (${status.length})`
        }
        return 'Estatus'
    }

    const priorityTitle = (priority?: number[] | null): string => {
        if (priority && priority.filter(value => value != 0).length > 0) {
            return `Prioridad (${priority.length})`
        }
        return 'Prioridad'
    }

    const requestTypeTitle = (request?: number[] | null): string => {
        if (request && request.filter(value => value != 0).length > 0) {
            return `Tipo (${request.length})`
        }
        return 'Tipo'
    }

    return (
        <View style={styles.container}>
            <Input
                multiline={false}
                autoCapitalize='none'
                clearTextOnFocus
                containerStyle={{ height: 45 }}
                inputContainerStyle={styles.searchInput}
                placeholder='Buscar Servicios...'
                shake={() => { }}
                value={search}
                onChangeText={(value) => {
                    onChange(value, 'search')
                    onChangeSearchText(value)
                }}
                onSubmitEditing={() => {
                    onSearchByText(search);
                }}
                returnKeyType='search'
                leftIcon={
                    <FontelloIcon
                        name='012-search'
                        size={20} />
                }
            />
            <ScrollView style={{marginLeft:10, marginRight:10}}
                showsHorizontalScrollIndicator={false}
                horizontal >
                <View style={{ flexDirection: 'row' }}>
                    {/* Mi trabajo */}
                    <Button
                        buttonStyle={myWork ? { ...styles.activeButton } : { ...styles.deactiveButton }}
                        titleStyle={myWork ? { ...styles.activeText, marginHorizontal: 4, paddingRight:0 } : { ...styles.deactiveText, marginHorizontal: 4, paddingRight:0 }}
                        onPress={() => { onMyWorkPress() }}
                        title='Mi trabajo'
                    />
                    {/* Fecha */}
                    <Button
                        buttonStyle={date ? { ...styles.activeButton } : { ...styles.deactiveButton }}
                        titleStyle={date ? { ...styles.activeText, marginStart: 15 } : { ...styles.deactiveText, marginStart: 15 }}
                        onPress={() => { onDatePress() }}
                        title={dateTitle(date)}
                        icon={<Icon
                            name={'angle-down'}
                            size={11}
                            color={date ? '#FFF' : '#000'}
                        />}
                        iconRight
                    />
                    {/* Estado */}
                    <Button

                        buttonStyle={(status && status.filter(value => value != 0).length > 0) ? { ...styles.activeButton } : { ...styles.deactiveButton }}
                        titleStyle={(status && status.filter(value => value != 0).length > 0) ? { ...styles.activeText, marginStart: 15 } : { ...styles.deactiveText, marginStart: 15 }}
                        onPress={() => { onStatusPress() }}
                        title={statusTitle(status)}
                        icon={<Icon
                            name={'angle-down'}
                            size={11}
                            color={(status && status.filter(value => value != 0).length > 0) ? '#FFF' : '#000'}
                        />}
                        iconRight
                    />                   
                    <Button
                        buttonStyle={(requestType && requestType.filter(value => value != 0).length > 0) ? { ...styles.activeButton } : { ...styles.deactiveButton }}
                        titleStyle={(requestType && requestType.filter(value => value != 0).length > 0) ? { ...styles.activeText, marginStart: 15 } : { ...styles.deactiveText, marginStart: 15 }}
                        onPress={() => { onRequestType() }}
                        title={requestTypeTitle(requestType)}
                        icon={<Icon
                            name={'angle-down'}
                            size={11}
                            color={(requestType && requestType.filter(value => value != 0).length > 0) ? '#FFF' : '#000'}
                        />}
                        iconRight
                    />
                    {/* Location */}
                    <Button
                        buttonStyle={location ? { ...styles.activeButton } : { ...styles.deactiveButton }}
                        titleStyle={location ? { ...styles.activeText, marginStart: 15 } : { ...styles.deactiveText, marginStart: 15 }}
                        onPress={() => { onLocationPress() }}
                        title='Ubicación'
                        icon={<Icon
                            name={'angle-down'}
                            size={11}
                            color={location ? '#FFF' : '#000'}
                        />}
                        iconRight
                    />
                    {/* Limpiar */}
                    <View style={{ height: 25, marginLeft: 5, backgroundColor: 'red', borderRightWidth: 1, borderRightColor: 'dimgray' }} />
                    <Button
                        buttonStyle={styles.cleanButton}
                        titleStyle={styles.cleanText}
                        title='Limpiar'
                        onPress={() => {
                            onCleanPress()
                            onChange('', 'search')
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        padding: 4,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        paddingTop:7,
        marginBottom: 5,
        shadowColor: '#303838',
        shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.35,
          shadowRadius: 10, 
          elevation: 10,

    },
    deactiveButton: {
        backgroundColor: '#D8D8D8',
        borderRadius: 25,
        marginHorizontal: 4,
        //height: 21,
        paddingTop: 3,
        paddingBottom: 3
    },
    deactiveText: {
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',
        paddingRight: 12,


    },
    activeButton: {
        backgroundColor: '#4A92EE',
        borderRadius: 25,
        marginHorizontal: 4,
        paddingTop: 3,
        paddingBottom: 3
    },
    activeText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: 'bold',
        paddingRight: 12,
    },
    cleanButton: {
        backgroundColor: 'transparent',
        //backgroundColor: '#4A92EE',
        borderRadius: 25,
        marginHorizontal: 4,
        paddingTop: 3,
        paddingBottom: 3
    },
    cleanText: {
        fontSize: 14,
        color: '#20BFC8',
        fontWeight: 'bold'
    },
    searchInput: {
        height: 36,
        alignSelf: 'center',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 10
    }
})
