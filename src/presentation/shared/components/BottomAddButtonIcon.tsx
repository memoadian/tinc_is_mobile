import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontelloIcon } from './Icon';

export const BottomAddButtonIcon = () => {
  return (
    <>
      <TouchableOpacity containerStyle={{ backgroundColor: '#20BFC8', borderRadius: 50, width: 30, height: 30, marginTop: 10 }} >
        <FontelloIcon
          name='017-add'
          size={18}
          color='#ffffff'
          style={{ marginTop: 5, marginLeft: 6 }}
        />
      </TouchableOpacity>
    </>
  )
}
