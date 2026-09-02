import React from 'react';

import {
View,
Text,
StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PropertyTitle = ({property}) => {

const location = [
property?.location,
property?.locality,
property?.city,
]
.filter(Boolean)
.join(', ');

return (

  
<View style={styles.card}>

  {/* PROPERTY TITLE */}

  <Text style={styles.title}>

    {property?.title || 'Property'}

  </Text>


  {/* LOCATION */}

  {location ? (

    <View style={styles.locationRow}>

      <Icon
        name="map-marker-outline"
        size={18}
        color="#1959A2"
      />

      <Text style={styles.location}>

        {location}

      </Text>

    </View>

  ) : null}


  {/* PROPERTY TYPE */}

  {property?.propertyType ? (

    <View style={styles.typeBadge}>

      <Icon
        name="home-city-outline"
        size={15}
        color="#1959A2"
      />

      <Text style={styles.typeText}>

        {property.propertyType}

      </Text>

    </View>

  ) : null}


  {/* RERA */}

  <View style={styles.reraRow}>

    <Icon
      name="shield-check"
      size={18}
      color="#2E7D32"
    />

    <Text style={styles.rera}>

      RERA No : {property?.reraNumber || 'Not Available'}

    </Text>

  </View>

</View>
  

);

};

export default PropertyTitle;

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

title: {

  
fontSize: 21,

fontWeight: '700',

color: '#102A47',

lineHeight: 28,
  

},

/* LOCATION */

locationRow: {

  
flexDirection: 'row',

alignItems: 'flex-start',

marginTop: 9,
  

},

location: {

  
flex: 1,

marginLeft: 6,

color: '#666',

fontSize: 13,

lineHeight: 19,
  

},

/* TYPE BADGE */

typeBadge: {

  
alignSelf: 'flex-start',

flexDirection: 'row',

alignItems: 'center',

backgroundColor: '#EEF4FB',

paddingHorizontal: 10,

paddingVertical: 6,

borderRadius: 20,

marginTop: 11,
  

},

typeText: {

  
marginLeft: 5,

color: '#1959A2',

fontSize: 11,

fontWeight: '600',
  

},

/* RERA */

reraRow: {

  
flexDirection: 'row',

alignItems: 'center',

marginTop: 11,

paddingTop: 10,

borderTopWidth: 0.5,

borderTopColor: '#E5E5E5',
  

},

rera: {

  
marginLeft: 7,

fontSize: 11,

color: '#555',

fontWeight: '600',
  

},

});
