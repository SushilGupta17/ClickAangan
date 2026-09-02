import React from 'react';

import {

View,

Text,

FlatList,

StyleSheet

} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AmenitiesGrid=({amenities=[]})=>{

const renderItem=({item})=>(

<View style={styles.item}>

<Icon

name="check-decagram"

size={18}

color="#2E7D32"

/>

<Text style={styles.text}>

{item.name}

</Text>

</View>

)

return(

<View style={styles.card}>

<Text style={styles.heading}>

Amenities
</Text>

<FlatList

numColumns={4}

scrollEnabled={false}

data={amenities}

renderItem={renderItem}

/>

</View>

)

}

export default AmenitiesGrid;

const styles=StyleSheet.create({

card:{
backgroundColor:'#fff',
marginHorizontal:15,
marginBottom:15,
padding:18,
borderRadius:15
},

heading:{
fontWeight:'700',
fontSize:16,
marginBottom:15
},

item: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 15,
  paddingHorizontal: 2,
},

text: {
  marginTop: 5,
  textAlign: 'center',
  fontSize: 10,   // Ya 10 kar sakte ho
  color: '#444',
},

});