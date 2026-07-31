import React from 'react';
import {View,Text,StyleSheet} from 'react-native';

const PriceCard=({project})=>{

return(

<View style={styles.card}>

<Text style={styles.title}>
Price Range
</Text>

<Text style={styles.price}>

₹ {project.priceFrom?.toLocaleString()} - ₹ {project.priceTo?.toLocaleString()}

</Text>

<Text style={styles.note}>

Starting Price

</Text>

</View>

)

}

export default PriceCard;

const styles=StyleSheet.create({

card:{
backgroundColor:'#fff',
marginHorizontal:15,
marginBottom:15,
padding:18,
borderRadius:15,
elevation:3
},

title:{
fontWeight:'700',
fontSize:20
},

price:{
fontSize:28,
fontWeight:'bold',
color:'#2E7D32',
marginTop:12
},

note:{
marginTop:6,
color:'#777'
}

});