import React from 'react';

import {

View,

Text,

FlatList,

StyleSheet

} from 'react-native';

const NearbyPlaces=({nearby=[]})=>{

const renderItem=({item})=>(

<View style={styles.box}>

<Text style={styles.name}>

{item.name}

</Text>

<Text>

{item.distance}

</Text>

</View>

)

return(

<View style={styles.card}>

<Text style={styles.heading}>

Nearby Places

</Text>

<FlatList

horizontal

data={nearby}

renderItem={renderItem}

showsHorizontalScrollIndicator={false}

/>

</View>

)

}

export default NearbyPlaces;

const styles=StyleSheet.create({

card:{
backgroundColor:'#fff',
marginHorizontal:15,
marginBottom:20,
padding:18,
borderRadius:15
},

heading:{
fontSize:20,
fontWeight:'700',
marginBottom:15
},

box:{
width:170,
padding:15,
backgroundColor:'#F5F5F5',
marginRight:12,
borderRadius:12
},

name:{
fontWeight:'700',
fontSize:16
}

});