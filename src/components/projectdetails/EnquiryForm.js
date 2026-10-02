import React,{useState} from 'react';

import {

View,
TextInput,
TouchableOpacity,
Text,
StyleSheet,
Alert

} from 'react-native';
import {useAppAlert} from '../../utils/AppAlert';




const EnquiryForm=()=>{
const {success, error, warning} = useAppAlert();


const[name,setName]=useState('');

const[mobile,setMobile]=useState('');

const submit=()=>{

success("Success","Enquiry Submitted");

}

return(

<View style={styles.card}>

<Text style={styles.heading}>

Enquiry

</Text>

<TextInput

placeholder="Your Name"

style={styles.input}

value={name}

onChangeText={setName}

/>

<TextInput

placeholder="Mobile Number"

style={styles.input}

keyboardType="phone-pad"

value={mobile}

onChangeText={setMobile}

/>

<TouchableOpacity

style={styles.button}

onPress={submit}>

<Text style={styles.btnText}>

Submit Enquiry

</Text>

</TouchableOpacity>

</View>

)

}

export default EnquiryForm;

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

input:{
borderWidth:1,
borderColor:'#ddd',
borderRadius:10,
padding:14,
marginBottom:15
},

button:{
backgroundColor:'#2E7D32',
padding:16,
borderRadius:12,
alignItems:'center'
},

btnText:{
color:'#fff',
fontWeight:'700'
}

});