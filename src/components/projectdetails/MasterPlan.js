import React from 'react';

import {

View,
Image,
Text,
StyleSheet

} from 'react-native';

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

source={{uri:image}}

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
margin:15,
padding:18,
borderRadius:15
},

heading:{
fontWeight:'700',
fontSize:20,
marginBottom:15
},

image:{
height:260,
borderRadius:12
}

});