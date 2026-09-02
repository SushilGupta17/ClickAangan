import React from 'react';

import {

View,
Image,
Text,
StyleSheet

} from 'react-native';

const API_URL = 'https://savariyaproperty.in/';
const API_URL1 = 'http://192.168.1.3:7045';


const MasterPlan=({image})=>{

if(!image){

return null;

}

return(

<View style={styles.card}>

<Text style={styles.heading}>

Master Plan

</Text>

<Image
  source={{ uri: `${API_URL}${image}` }}
  style={styles.image}
  resizeMode="cover"
/>

</View>

)

}

export default MasterPlan;

const styles=StyleSheet.create({

card:{
backgroundColor:'#fff',
margin:12,
padding:7,
borderRadius:8
},

heading:{
fontWeight:'700',
fontSize:16,
marginBottom:14
},

image:{
height:260,
borderRadius:12
}

});