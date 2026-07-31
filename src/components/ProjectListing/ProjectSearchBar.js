import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

const ProjectSearchBar = ({
  value,
  onChangeText,
  onFilterPress,
  onLocationPress,
  onVoicePress,
}) => {

  return (

    <View style={styles.container}>

      <View style={styles.searchBox}>

        <Icon
          name="search"
          size={18}
          color="#777"
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search Project, Builder, City..."
          placeholderTextColor="#999"
          style={styles.input}
        />

        <TouchableOpacity
          onPress={onVoicePress}
          style={styles.iconButton}>

          <Icon
            name="microphone"
            size={18}
            color="#1959A2"
          />

        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={onLocationPress}>

        <Icon
          name="map-marker-alt"
          color="#FFF"
          size={18}
        />

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={onFilterPress}>

        <Icon
          name="sliders-h"
          color="#FFF"
          size={18}
        />

      </TouchableOpacity>

    </View>

  );

};

export default ProjectSearchBar;

const styles = StyleSheet.create({

  container:{
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:12,
    paddingVertical:12,
    backgroundColor:'#F5F7FA'
  },

  searchBox:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#FFF',
    borderRadius:15,
    paddingHorizontal:15,
    height:55,
    elevation:4
  },

  input:{
    flex:1,
    marginLeft:10,
    fontSize:15,
    color:'#222'
  },

  iconButton:{
    width:36,
    height:36,
    justifyContent:'center',
    alignItems:'center'
  },

  locationButton:{
    width:55,
    height:55,
    marginLeft:10,
    borderRadius:15,
    backgroundColor:'#28A745',
    justifyContent:'center',
    alignItems:'center',
    elevation:4
  },

  filterButton:{
    width:55,
    height:55,
    marginLeft:10,
    borderRadius:15,
    backgroundColor:'#1959A2',
    justifyContent:'center',
    alignItems:'center',
    elevation:4
  }

});
