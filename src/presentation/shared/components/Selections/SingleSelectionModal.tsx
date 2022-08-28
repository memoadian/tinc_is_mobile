import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import uuid from 'react-native-uuid';
import ItemUnicSelection from './ItemUnicSelection';
import PresentantionModal from './PresentationModal';
import { ItemRowSelection, SingleSelectionModalProps } from './types';

const SingleSelectionModal = ({
    data,
    showing,
    onOutside,
    onItemPressed
}: SingleSelectionModalProps) => {

    const [internalData, setInternalData] = useState<ItemRowSelection[]>([]);

    useEffect(() => {
        setInternalData(data);
    }, [data]);

    return (
        <PresentantionModal
            onOutsidePressed={() => {
                onOutside?.()
            }}
            isVisible={showing}>
            <View style={styles.modal}>
                <FlatList
                    data={internalData}
                    renderItem={({ item }: any) => (
                        <ItemUnicSelection
                            title={item.name}
                            value={item.id}
                            checked={item.checked}
                            onPressed={(value, checked) => {
                                let elements = internalData.flatMap((element) => {
                                    if (value === item.id) {
                                        return { ...element, checked: checked }
                                    } else {
                                        return { ...element, checked: false }
                                    }
                                })
                                setInternalData(elements)
                                onItemPressed?.(value, checked)
                            }} />
                    )}
                    keyExtractor={(item, index) => `${uuid.v4()}`}
                    ItemSeparatorComponent={() => <Divider />}
                />
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


export default SingleSelectionModal;