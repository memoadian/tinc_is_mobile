import React from 'react'
import { Modal, TouchableWithoutFeedback, View } from 'react-native'
import { PresentantionModalProps } from './types'

const PresentantionModal = ({
    onOutsidePressed,
    isVisible,
    children
}: PresentantionModalProps) => {
    return (
        <Modal
            animationType='fade'
            visible={isVisible}
            transparent={true}>
            <TouchableWithoutFeedback
                style={{ flex: 1 }}
                onPress={onOutsidePressed}>

                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }}>
                    <TouchableWithoutFeedback>
                        {children}
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default PresentantionModal