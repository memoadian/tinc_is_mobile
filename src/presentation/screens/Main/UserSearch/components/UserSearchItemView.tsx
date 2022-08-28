import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { TouchableFeedback } from '../../../../shared/components/TouchableFeedback';
import { UserItem } from '../UserSearchState';

export interface Props {
    item: UserItem;
    onPress?: (item: UserItem) => void;
}

export const UserSearchItemView = ({ item, onPress }: Props) => {
    return (
        <TouchableFeedback onPress={() => {
            if (onPress) {
                onPress(item)
            }
        }}>
            <View style={{
                flexDirection: 'row',
                backgroundColor: (item.isSelected) ? '#C3D6FF' : '#FFF'
            }}>
                {item.profile_picture === '' &&
                    <Image
                        source={require('../../../../assets/img/empty_user.png')}
                        style={{ ...styles.image, }} />}
                {item.profile_picture !== '' &&
                    <Image
                        source={{ uri: item.profile_picture }}
                        style={{ ...styles.image }} />}
                <View style={styles.nameContainer}>
                    <Text style={styles.textName}>{item.fullname}</Text>
                    <Text style={styles.textMajor}>{item.rolName}</Text>
                </View>
            </View>
        </TouchableFeedback>
    );
}

const styles = StyleSheet.create({
    image: {
        margin: 8,
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        overflow: 'hidden',
    },
    nameContainer: {
        justifyContent: 'center'
    },
    textName: {
        color: '#000',
        fontSize: 14
    },
    textMajor: {
        color: '#888888',
        fontSize: 12
    }
})