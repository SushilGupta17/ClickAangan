import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const PropertyAmenities = ({amenities = []}) => {

  // Agar API se amenities object ke form mein aa rahi hain
  // jaise [{name:"Lift"}, {name:"Parking"}]
  // to name extract karega.
  const getAmenityName = item => {

    if (typeof item === 'string') {
      return item;
    }

    return (
      item?.name ||
      item?.amenityName ||
      item?.title ||
      ''
    );

  };


  const getIcon = name => {

    const value = name.toLowerCase();

    if (value.includes('lift') || value.includes('elevator')) {
      return 'elevator';
    }

    if (value.includes('parking')) {
      return 'parking';
    }

    if (value.includes('gym')) {
      return 'dumbbell';
    }

    if (value.includes('security')) {
      return 'shield-check';
    }

    if (value.includes('garden')) {
      return 'flower-outline';
    }

    if (
      value.includes('pool') ||
      value.includes('swimming')
    ) {
      return 'pool';
    }

    if (
      value.includes('club') ||
      value.includes('clubhouse')
    ) {
      return 'home-group';
    }

    if (value.includes('power')) {
      return 'flash';
    }

    if (
      value.includes('water') ||
      value.includes('24')
    ) {
      return 'water-outline';
    }

    if (value.includes('play')) {
      return 'human-child';
    }

    if (
      value.includes('park') ||
      value.includes('green')
    ) {
      return 'tree-outline';
    }

    if (value.includes('wifi')) {
      return 'wifi';
    }

    if (value.includes('cctv')) {
      return 'cctv';
    }

    if (value.includes('visitor')) {
      return 'account-group-outline';
    }

    if (value.includes('fire')) {
      return 'fire';
    }

    return 'check-decagram';

  };


  const validAmenities = amenities
    .map(item => getAmenityName(item))
    .filter(item => item);


  // Agar API se amenities nahi aayi hain
  // to component show nahi hoga.
  if (validAmenities.length === 0) {
    return null;
  }


  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Amenities
      </Text>


      <View style={styles.grid}>

        {validAmenities.map((name, index) => (

          <View
            key={`${name}-${index}`}
            style={styles.item}>

            <View style={styles.iconContainer}>

              <Icon
                name={getIcon(name)}
                size={21}
                color="#1959A2"
              />

            </View>


            <Text
              style={styles.text}
              numberOfLines={2}>

              {name}

            </Text>

          </View>

        ))}

      </View>

    </View>

  );

};


export default PropertyAmenities;


const styles = StyleSheet.create({

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 0,
    padding: 18,
    borderRadius: 15,
    elevation: 3,
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#102A47',
    marginBottom: 18,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  item: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    paddingHorizontal: 3,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#F3F7FC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    marginTop: 7,
    textAlign: 'center',
    fontSize: 10,
    color: '#444',
    fontWeight: '500',
  },

});