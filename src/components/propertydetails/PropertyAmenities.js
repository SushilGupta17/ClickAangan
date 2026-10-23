
import React, {useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const PropertyAmenities = ({amenities = []}) => {

  // =========================================================
  // READ MORE / READ LESS
  // =========================================================

  const [expanded, setExpanded] = useState(false);


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


  // =========================================================
  // FIRST 8 / ALL AMENITIES
  // =========================================================

  const visibleAmenities = expanded
    ? validAmenities
    : validAmenities.slice(0, 8);


  // =========================================================
  // READ MORE BUTTON TABHI AAYEGA
  // JAB 8 SE ZYADA AMENITIES HONGI
  // =========================================================

  const isLongAmenities = validAmenities.length > 8;


  return (

    <View style={styles.card}>

      <Text style={styles.heading}>
        Amenities
      </Text>


      <View style={styles.grid}>

        {visibleAmenities.map((name, index) => (

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


      {/* =================================================
          READ MORE / READ LESS
      ================================================= */}

      {isLongAmenities && (

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setExpanded(!expanded)}
          style={styles.readMoreButton}
        >

          <Text style={styles.readMoreText}>
            {expanded ? 'Read Less' : 'Read More'}
          </Text>

          <Text style={styles.readMoreArrow}>
            {expanded ? ' ▲' : ' ▼'}
          </Text>

        </TouchableOpacity>

      )}

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
    fontSize: 14,
    fontWeight: '600',
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


  // =======================================================
  // READ MORE BUTTON
  // =======================================================

  readMoreButton: {
    alignSelf: 'flex-end',

    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 2,
    paddingVertical: 4,
  },

  readMoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F7941D',
  },

  readMoreArrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F7941D',
  },

});