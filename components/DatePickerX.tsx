import React from 'react';
import { StyleSheet, TouchableOpacity, Platform, Text, View } from 'react-native';
import styled from 'styled-components';
import DateTimePicker from '@react-native-community/datetimepicker';
/* 
const Container = styled.TouchableOpacity`
  background-color: ${Platform.OS === 'ios' ? '#00000066' : 'transparent'};
  position: absolute;
  justify-content: flex-end;
  width: 120%;
  height: 100%; 
`;
const Header = styled.View`
  width: 100%;
  padding: 16px;
  justify-content: flex-end;
  align-items: flex-end;
  background-color: white;
  border-bottom-width: 1px;
`; */
export default class DatePickerX extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      date: new Date(props.date),
    };
  }
  
  render() {
    const { onClose, onChange } = this.props;
    const { date } = this.state;
    return (
      <TouchableOpacity onPress={onClose} style={styles.touchable_style} >
        {Platform.OS === 'ios' && (
          <View style={styles.view_style}>
            <TouchableOpacity onPress={onClose}>
              <Text>Done</Text>
            </TouchableOpacity>
          </View>
        )}
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, d) => {
            if (Platform.OS === 'ios') {
              this.setState({ date: d });
              onChange(d);
            } else {
              onClose(d);
            }
         }}
         style={{ backgroundColor: 'white'}}
       />
     </TouchableOpacity>
   );
  }
}

const styles = StyleSheet.create({
  touchable_style: {
  backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'transparent',
  position: 'absolute',
  justifyContent: 'flex-end',
  width: '120%',
  height: '100%',
  },

  view_style: {
    width: '100%',
    padding: '16',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    borderBottomWidth: 1
  }

});