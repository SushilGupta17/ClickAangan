import React from 'react';

import {
View,
Text,
StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {formatPrice} from '../../helpers/priceHelper';

const PropertyPriceCard = ({property}) => {

const price = property?.price;

if (!price) {

    
return null;
    

}

return (

    
<View style={styles.card}>

  {/* TITLE */}

  <Text style={styles.heading}>

    Price

  </Text>


  {/* PRICE */}

  <View style={styles.priceRow}>

    <Icon
      name="currency-inr"
      size={22}
      color="#2E7D32"
    />

    <Text style={styles.price}>

      {formatPrice(price)}

    </Text>

  </View>


  {/* PROPERTY INFO */}

  <View style={styles.infoRow}>

    {property?.propertyType ? (

      <View style={styles.infoItem}>

        <Icon
          name="home-city-outline"
          size={16}
          color="#1959A2"
        />

        <Text style={styles.infoText}>

          {property.propertyType}

        </Text>

      </View>

    ) : null}


    {property?.area ? (

      <View style={styles.infoItem}>

        <Icon
          name="floor-plan"
          size={16}
          color="#1959A2"
        />

        <Text style={styles.infoText}>

          {property.area} Sq.Ft.

        </Text>

      </View>

    ) : null}

  </View>


  {/* PRICE NOTE */}

  <View style={styles.noteRow}>

    <Icon
      name="information-outline"
      size={16}
      color="#777"
    />

    <Text style={styles.noteText}>

      Price details available on enquiry

    </Text>

  </View>

</View>
    

);

};

export default PropertyPriceCard;

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

marginBottom: 12,
    

},

/* PRICE */

priceRow: {

    
flexDirection: 'row',

alignItems: 'center',
    

},

price: {

    
marginLeft: 5,

fontSize: 24,

fontWeight: '800',

color: '#2E7D32',
    

},

/* INFO */

infoRow: {

    
flexDirection: 'row',

alignItems: 'center',

marginTop: 14,

flexWrap: 'wrap',
    

},

infoItem: {

    
flexDirection: 'row',

alignItems: 'center',

marginRight: 20,

marginBottom: 5,
    

},

infoText: {

    
marginLeft: 6,

fontSize: 12,

color: '#666',

fontWeight: '500',
    

},

/* NOTE */

noteRow: {

    
flexDirection: 'row',

alignItems: 'center',

marginTop: 10,

paddingTop: 10,

borderTopWidth: 0.5,

borderTopColor: '#E5E5E5',
    

},

noteText: {

    
flex: 1,

marginLeft: 6,

fontSize: 11,

color: '#777',
    

},

});
