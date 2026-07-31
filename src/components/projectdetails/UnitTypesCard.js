import React from 'react';

import {

View,

Text,

FlatList,

StyleSheet

} from 'react-native';

const UnitTypesCard=({units=[]})=>{

const renderItem=({item})=>(

<View style={styles.box}>

<Text style={styles.type}>

{item.unitType}

</Text>

<Text>

{item.area} Sq.Ft.

</Text>

<Text style={styles.price}>

₹ {item.price?.toLocaleString()}

</Text>

</View>

)

return(

<View style={styles.card}>

<Text style={styles.heading}>

Available Units

</Text>

<FlatList

horizontal

showsHorizontalScrollIndicator={false}

data={units}

renderItem={renderItem}

/>

</View>

)

}

export default UnitTypesCard;

const styles=StyleSheet.create({

card:{
backgroundColor:'#fff',
padding:18,
marginHorizontal:15,
marginBottom:15,
borderRadius:15
},

heading:{
fontWeight:'700',
fontSize:20,
marginBottom:15
},

box:{
width:150,
backgroundColor:'#F7F7F7',
padding:15,
borderRadius:12,
marginRight:12
},

type:{
fontWeight:'700',
fontSize:18
},

price:{
marginTop:8,
fontWeight:'700',
color:'#2E7D32'
}

});