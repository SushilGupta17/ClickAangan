import React from 'react';

import {

View,
Text,
TouchableOpacity,
StyleSheet,
Linking

} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BrochureSection=({project})=>{

const download=()=>{

if(project.brochure){

Linking.openURL(project.brochure);

}

}

return(

<View style={styles.card}>

<Text style={styles.heading}>

Project Brochure

</Text>

<TouchableOpacity
style={styles.button}
onPress={download}>

<Icon
name="file-pdf-box"
size={26}
color="red"
/>

<Text style={styles.text}>

Download Brochure

</Text>

</TouchableOpacity>

</View>

)

}

export default BrochureSection;

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

button:{
flexDirection:'row',
alignItems:'center'
},

text:{
marginLeft:12,
fontWeight:'600'
}

});