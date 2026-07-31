import React from 'react';

import {

View,
TouchableOpacity,
Text,
StyleSheet,
Linking

} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StickyBottomBar=({project})=>{

return(

<View style={styles.container}>

<TouchableOpacity

style={styles.call}

onPress={()=>Linking.openURL(`tel:${project.mobile}`)}>

<Icon

name="phone"

size={22}

color="#fff"

/>

<Text style={styles.text}>

Call

</Text>

</TouchableOpacity>

<TouchableOpacity

style={styles.whatsapp}

onPress={()=>Linking.openURL(`https://wa.me/91${project.mobile}`)}>

<Icon

name="whatsapp"

size={22}

color="#fff"

/>

<Text style={styles.text}>

WhatsApp

</Text>

</TouchableOpacity>

<TouchableOpacity

style={styles.enquiry}>

<Text style={styles.text}>

Contact Builder

</Text>

</TouchableOpacity>

</View>

)

}

export default StickyBottomBar;

const styles=StyleSheet.create({

container:{

position:'absolute',

bottom:0,

left:0,

right:0,

height:70,

backgroundColor:'#fff',

flexDirection:'row',

elevation:20

},

call:{

flex:1,

backgroundColor:'#1565C0',

justifyContent:'center',

alignItems:'center'

},

whatsapp:{

flex:1,

backgroundColor:'#2E7D32',

justifyContent:'center',

alignItems:'center'

},

enquiry:{

flex:2,

backgroundColor:'#FF9800',

justifyContent:'center',

alignItems:'center'

},

text:{

color:'#fff',

fontWeight:'700',

marginTop:5

}

});