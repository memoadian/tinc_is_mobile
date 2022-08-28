import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native';
import { Divider } from '../Divider';
import { TButton } from '../TButton';
import uuid from 'react-native-uuid';
import ItemMultipleSelection from './ItemMultipleSelection';
import { ItemRowSelection, MutipleSelectionModalProps } from './types';
import PresentantionModal from './PresentationModal';

const MutipleSelectionModal = ({
    data,
    showing,
    onContinue,
    onOutside,
    onCancel
}: MutipleSelectionModalProps) => {

    const [internalData, setInternalData] = useState<ItemRowSelection[]>([]);

    useEffect(() => {
        setInternalData(data);
    }, [data]);

    return (
        <PresentantionModal
            isVisible={showing}
            onOutsidePressed={() => {
                onOutside?.()
            }}
        >
            <View style={styles.modal}>
                <FlatList
                    data={internalData}
                    renderItem={({ item }: any) => (
                        <ItemMultipleSelection
                            title={item.name}
                            value={item.id}
                            checked={item.checked}
                            onPressed={(value, checked) => {
                                if (value == 0) {
                                    setInternalData(internalData.flatMap(element => {
                                        return { ...element, checked: checked }
                                    }))
                                } else {
                                    setInternalData(internalData.flatMap(element => {
                                        if (element.id === value || (element.checked ===true && element.id == 0))
                                        {
                                            if (element.id == 0)
                                            element.checked = false
                                            return { ...element, checked: checked }
                                        }
                                        else{
                                            return element;
                                        }                                      
                                    }))
                                }
                            }} />)}
                    keyExtractor={(item, index) => `${uuid.v4()}`}
                    ItemSeparatorComponent={() => <Divider />}
                />
                <View style={{
                    width: '100%',
                    paddingVertical: 8,
                    marginBottom: 4,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
                    <TButton
                        type='transparent'
                        contentStyle={{ marginEnd: 16 }}
                        styleText={{
                            color: 'red',
                            fontWeight: '500'
                        }}
                        title={'Cancelar'}
                        onPress={() => {
                            setInternalData(data)
                            onCancel?.()
                        }} />
                    <TButton
                        type='transparent'
                        title={'Continuar'}
                        contentStyle={{ marginEnd: 16 }}
                        styleText={{
                            color: 'blue',
                            fontWeight: '500'
                        }}
                        onPress={() => {
                            onContinue?.(
                                internalData
                                    .filter((element) => element.checked)
                                    .flatMap(element => element.id)
                            )
                        }} />
                </View>
            </View>
        </PresentantionModal>
    )

}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#FFFFFF',
        width: '90%',
        maxHeight: '90%',
        padding: 4,
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.25,
        elevation: 4,
        borderRadius: 8
    }
})

export default MutipleSelectionModal;