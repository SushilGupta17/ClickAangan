import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BuilderCard = ({project}) => {

  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Builder Details
      </Text>

      <View style={styles.row}>

        <Image
          source={{
            uri: project.builderLogo,
          }}
          style={styles.logo}
        />

        <View style={{flex:1}}>

          <Text style={styles.name}>
            {project.builderName}
          </Text>

          <Text style={styles.info}>
            {project.builderExperience} Years Experience
          </Text>

          <Text style={styles.info}>
            {project.totalProjects} Projects Delivered
          </Text>

        </View>

        <Icon
          name="check-decagram"
          size={28}
          color="#2E7D32"
        />

      </View>

    </View>

  );

};

export default BuilderCard;

const styles = StyleSheet.create({

card:{
backgroundColor:'#fff',
margin:15,
padding:18,
borderRadius:16,
elevation:3
},

heading:{
fontWeight:'700',
fontSize:20,
marginBottom:15
},

row:{
flexDirection:'row',
alignItems:'center'
},

logo:{
width:70,
height:70,
borderRadius:35,
marginRight:15
},

name:{
fontWeight:'700',
fontSize:18
},

info:{
color:'#666',
marginTop:5
}

});