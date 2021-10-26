import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEntypo from 'react-native-vector-icons/Entypo';

export default class SideMenuItemSair extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      icon: props.icon,
      text: props.text,
    };
  }
  
  render() {

    const { onAction } = this.props;
    const { icon, text } = this.state;
    
    return (
      <View style={styles.menu_item_sair} onTouchEnd={() => onAction()}>
        <View style={styles.menu_item_interno}>
          <View style={styles.menu_item_icon}>
            <Icon name={icon} color='white' size={20} style={{flex: 1}} />
          </View>
          <View style={styles.menu_item_sair_view}>
            <View style={styles.menu_item_view_text_descricao}>
              <Text style={styles.menu_item_text_value}>{text}</Text>
            </View>            
          </View>
        </View>
      </View>
   );
  }
}

const styles = StyleSheet.create({  
  menu_item_sair: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    
    paddingTop: 20,
  },
  
  menu_item_interno: {
    flex: 1,
    flexDirection: 'row',
    height: '90%',
  },

  menu_item_icon: {
    flex: 1,
    paddingTop: 15,
    alignItems: 'center',
  },
  
  menu_item_sair_view: {
    flex: 6,
    paddingTop: 15,
    paddingLeft: 15,
  },

  menu_item_view_text_descricao: {
    flex: 1,
  },
  
  menu_item_text_value: {
    flex: 1,
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold'
  },

  menu_item_seta: {
    flex: 1,
    paddingTop: 16,
    alignItems: 'center',
  },

});