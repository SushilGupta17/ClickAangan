import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const OverviewCard = ({project}) => {

  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Project Overview
      </Text>

      <Text style={styles.description}>
        {project.description}
      </Text>

    </View>

  );

};

export default OverviewCard;

const styles = StyleSheet.create({

  card:{
    backgroundColor:'#fff',
    margin:15,
    borderRadius:15,
    padding:18,
    elevation:3
  },

  heading:{
    fontSize:20,
    fontWeight:'700',
    marginBottom:10
  },

  description:{
    color:'#555',
    lineHeight:24,
    fontSize:15
  }

});