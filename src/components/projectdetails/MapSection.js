import React from 'react';

import {

View,

Text,

StyleSheet

} from 'react-native';

import MapView,{Marker} from 'react-native-maps';

const MapSection=({project})=>{

return(

<View style={styles.card}>

<Text style={styles.heading}>

Location

</Text>

<MapView

style={styles.map}

initialRegion={{

latitude:project.latitude,

longitude:project.longitude,

latitudeDelta:0.01,

longitudeDelta:0.01

}}

>

<Marker

coordinate={{

latitude:project.latitude,

longitude:project.longitude

}}

/>

</MapView>

</View>

)

}

export default MapSection;

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
fontSize:20,
marginBottom:15
},

map:{
height:220,
borderRadius:12
}

});