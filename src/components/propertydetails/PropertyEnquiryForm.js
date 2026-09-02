// import React, {useState} from 'react';

// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const PropertyEnquiryForm = ({property}) => {

//   const [name, setName] = useState('');
//   const [mobile, setMobile] = useState('');

//   const submit = () => {

//     if (!name.trim()) {
//       Alert.alert(
//         'Required',
//         'Please enter your name.',
//       );
//       return;
//     }

//     if (!mobile.trim()) {
//       Alert.alert(
//         'Required',
//         'Please enter your mobile number.',
//       );
//       return;
//     }

//     Alert.alert(
//       'Success',
//       'Your enquiry has been submitted.',
//     );

//   };

//   return (

//     <View style={styles.card}>

//       <View style={styles.headingRow}>

//         <View style={styles.iconContainer}>

//           <Icon
//             name="message-text-outline"
//             size={21}
//             color="#1959A2"
//           />

//         </View>

//         <View>

//           <Text style={styles.heading}>
//             Enquire About This Property
//           </Text>

//           <Text style={styles.subHeading}>
//             Get more details from the owner
//           </Text>

//         </View>

//       </View>


//       {/* Name */}

//       <TextInput
//         placeholder="Your Name"
//         placeholderTextColor="#999"
//         style={styles.input}
//         value={name}
//         onChangeText={setName}
//       />


//       {/* Mobile */}

//       <TextInput
//         placeholder="Mobile Number"
//         placeholderTextColor="#999"
//         style={styles.input}
//         keyboardType="phone-pad"
//         maxLength={10}
//         value={mobile}
//         onChangeText={setMobile}
//       />


//       {/* Submit */}

//       <TouchableOpacity
//         style={styles.button}
//         activeOpacity={0.85}
//         onPress={submit}>

//         <Icon
//           name="send"
//           size={18}
//           color="#fff"
//         />

//         <Text style={styles.btnText}>
//           Submit Enquiry
//         </Text>

//       </TouchableOpacity>

//     </View>

//   );

// };

// export default PropertyEnquiryForm;


// const styles = StyleSheet.create({

//   card: {
//     backgroundColor: '#fff',
//     marginHorizontal: 15,
//     marginTop: 15,
//     marginBottom: 15,
//     padding: 18,
//     borderRadius: 15,
//     elevation: 3,
//   },

//   headingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 18,
//   },

//   iconContainer: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: '#EEF4FB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },

//   heading: {
//     fontWeight: '700',
//     fontSize: 16,
//     color: '#102A47',
//   },

//   subHeading: {
//     marginTop: 3,
//     fontSize: 11,
//     color: '#777',
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 13,
//     marginBottom: 12,
//     fontSize: 14,
//     color: '#222',
//     backgroundColor: '#FAFAFA',
//   },

//   button: {
//     backgroundColor: '#2E7D32',
//     paddingVertical: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },

//   btnText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 14,
//     marginLeft: 8,
//   },

// });