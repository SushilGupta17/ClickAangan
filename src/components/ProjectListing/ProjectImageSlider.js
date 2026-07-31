import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

const WIDTH = Dimensions.get('window').width;

const ProjectImageSlider = ({
  image,
  images = [],
  onFavorite,
  favorite = false,
}) => {

  const list =
    images.length > 0
      ? images
      : image
      ? [image]
      : [];

  const [index, setIndex] = useState(0);

  return (
    <View style={styles.container}>

      <Image
        source={{
          uri: list[index],
        }}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={styles.overlay}/>

      <TouchableOpacity
        style={styles.favorite}
        onPress={onFavorite}>

        <Icon
          name="heart"
          solid={favorite}
          size={18}
          color={favorite ? "#E53935" : "#FFF"}
        />

      </TouchableOpacity>

      <View style={styles.counter}>

        <Icon
          name="camera"
          size={12}
          color="#FFF"
        />

        <Text style={styles.counterText}>

          {index + 1}/{list.length}

        </Text>

      </View>

      <View style={styles.bottom}>

        <View style={styles.tag}>

          <Icon
            name="images"
            size={11}
            color="#FFF"
          />

          <Text style={styles.tagText}>
            Project Photos
          </Text>

        </View>

      </View>

    </View>
  );
};

export default ProjectImageSlider;

const styles = StyleSheet.create({

  container:{
    height:230,
    width:'100%',
    backgroundColor:"#EEE",
  },

  image:{
    height:'100%',
    width:'100%',
  },

  overlay:{
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    height:70,
    backgroundColor:'rgba(0,0,0,0.25)'
  },

  favorite:{
    position:'absolute',
    top:15,
    right:15,
    width:42,
    height:42,
    borderRadius:21,
    backgroundColor:'rgba(0,0,0,0.40)',
    justifyContent:'center',
    alignItems:'center'
  },

  counter:{
    position:'absolute',
    right:15,
    bottom:15,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.60)',
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:15
  },

  counterText:{
    color:'#FFF',
    marginLeft:6,
    fontWeight:'600',
    fontSize:12
  },

  bottom:{
    position:'absolute',
    left:15,
    bottom:15,
  },

  tag:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#1959A2',
    paddingHorizontal:12,
    paddingVertical:6,
    borderRadius:18
  },

  tagText:{
    color:'#FFF',
    marginLeft:6,
    fontWeight:'600',
    fontSize:12
  }

});