import React from 'react';

import {
View,
Text,
StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PropertyStatusCard = ({property}) => {

const status =
property?.propertyStatus ||
property?.status ||
'Available';

const getStatusDetails = () => {

   
const value =
  String(status).toLowerCase();


if (
  value.includes('ready') ||
  value.includes('move')
) {

  return {
    icon: 'home-check-outline',
    color: '#2E7D32',
    background: '#EAF6EC',
    title: 'Ready to Move',
    description:
      'This property is ready for immediate possession.',
  };

}


if (
  value.includes('under') ||
  value.includes('construction')
) {

  return {
    icon: 'hammer-wrench',
    color: '#F57C00',
    background: '#FFF4E5',
    title: 'Under Construction',
    description:
      'Construction work is currently in progress.',
  };

}


if (
  value.includes('new') ||
  value.includes('launch')
) {

  return {
    icon: 'rocket-launch-outline',
    color: '#1959A2',
    background: '#EEF4FB',
    title: 'New Launch',
    description:
      'Explore this newly launched property.',
  };

}


if (value.includes('sold')) {

  return {
    icon: 'home-remove-outline',
    color: '#D32F2F',
    background: '#FDECEC',
    title: 'Sold',
    description:
      'This property has already been sold.',
  };

}


if (value.includes('rent')) {

  return {
    icon: 'home-clock-outline',
    color: '#7B1FA2',
    background: '#F5EAF9',
    title: 'Available for Rent',
    description:
      'This property is currently available for rent.',
  };

}


return {

  icon: 'check-circle-outline',
  color: '#1959A2',
  background: '#EEF4FB',
  title: status,
  description:
    'This property is currently available.',

};
   

};

const details = getStatusDetails();

return (

   
<View style={styles.card}>

  {/* HEADER */}

  <Text style={styles.heading}>

    Property Status

  </Text>


  {/* STATUS ROW */}

  <View style={styles.statusRow}>


    {/* ICON */}

    <View
      style={[
        styles.iconBox,
        {
          backgroundColor:
            details.background,
        },
      ]}>

      <Icon
        name={details.icon}
        size={24}
        color={details.color}
      />

    </View>


    {/* STATUS DETAILS */}

    <View style={styles.info}>

      <Text
        style={[
          styles.statusTitle,
          {
            color: details.color,
          },
        ]}>

        {details.title}

      </Text>


      <Text style={styles.description}>

        {details.description}

      </Text>

    </View>

  </View>

</View>
   

);

};

export default PropertyStatusCard;

/* ============================================= */
/* STYLES */
/* ============================================= */

const styles = StyleSheet.create({

card: {

   
backgroundColor: '#fff',

marginHorizontal: 15,

marginTop: 15,

marginBottom: 0,

borderRadius: 15,

padding: 18,

elevation: 3,
   

},

heading: {

   
fontSize: 16,

fontWeight: '700',

color: '#102A47',

marginBottom: 15,
   

},

/* STATUS ROW */

statusRow: {

   
flexDirection: 'row',

alignItems: 'center',

backgroundColor: '#FAFBFC',

borderRadius: 12,

padding: 12,

borderWidth: 1,

borderColor: '#EEF1F4',
   

},

/* ICON */

iconBox: {

   
width: 48,

height: 48,

borderRadius: 12,

justifyContent: 'center',

alignItems: 'center',
   

},

/* INFO */

info: {

   
flex: 1,

marginLeft: 12,
   

},

statusTitle: {

   
fontSize: 16,

fontWeight: '700',
   

},

description: {

   
marginTop: 4,

color: '#777',

fontSize: 12,

lineHeight: 18,
   

},

});
