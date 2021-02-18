import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { StyleSheet } from 'react-native'

import { TouchableOpacity, Text } from 'react-native'

const CheckBox = ({ selected, onPressCheck, style, textStyle, size = 40, color = '#064c7a', text = '', ...props}) => (
    <TouchableOpacity style={[styles.checkBox, style]}  {...props}>
        <Icon
            style={{marginRight: 5}}
            size={size}
            color={color}
            name={ selected ? 'check-box' : 'check-box-outline-blank'}
            onPress={onPressCheck}
        />

        <Text style={textStyle}> {text} </Text>
    </TouchableOpacity>
)

export default CheckBox

const styles = StyleSheet.create({
    checkBox: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})